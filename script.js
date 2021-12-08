'use strict';
// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2021-12-05T23:36:17.929Z',
    '2021-12-07T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');

const btnLogin = document.querySelector('.login__btn');
const btnCreateAccount = document.querySelector('.create__btn');
const btnCloseModal = document.querySelector('.close__modal__btn');
const btnOpenAccount = document.querySelector('.open__account__btn');

const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputCreateFirstname = document.querySelector(
  '.create__input--firstname'
);
const inputCreateLastname = document.querySelector('.create__input--lastname');
const inputCreatePin = document.querySelector('.create__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Startup
modal.style.display = 'none';
overlay.style.display = 'none';
let currentAccount;
let sorted = false;
let timer;
createUsernames(accounts);
accounts.forEach(acc => calcBalance(acc));

// Functions
function displayMovements(acc, sort = false) {
  containerMovements.innerHTML = '';
  acc.movementsDates.sort((a, b) => acc.movements[a] - acc.movements[b]);

  let movs, dates;

  if (sort) {
    const pairs = acc.movements.map((mov, i) => [mov, acc.movementsDates[i]]);
    pairs.sort((a, b) => a[0] - b[0]);
    movs = pairs.map(pair => pair[0]);
    dates = pairs.map(pair => pair[1]);
  } else {
    movs = acc.movements;
    dates = acc.movementsDates;
  }

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(dates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCurrency(mov, acc.locale, acc.currency);

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
        </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

function createUsernames(accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .reduce((prev, curr) => prev + curr[0], '');
  });
}

function calcBalance(acc) {
  acc.balance = acc.movements.reduce((account, mov) => account + mov, 0);
  labelBalance.textContent = formatCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  );
}

function calcDisplaySummary(acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCurrency(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCurrency(
    Math.abs(out),
    acc.locale,
    acc.currency
  );

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(mov => mov >= 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = formatCurrency(
    interest,
    acc.locale,
    acc.currency
  );
}

function formatMovementDate(date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return `Today`;
  if (daysPassed === 1) return `Yesterday`;
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
}

function formatCurrency(value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
}

function startLogOutTimer() {
  let time = 300;
  function timingOut() {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time <= 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    time--;
  }

  timingOut();
  const timer = setInterval(timingOut, 1000);

  return timer;
}

function updateUI(acc) {
  calcBalance(acc);
  displayMovements(currentAccount);
  calcDisplaySummary(currentAccount);
}

// Event handler
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    updateUI(currentAccount);
  }

  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();
  inputLoginUsername.blur();
});

btnCreateAccount.addEventListener('click', function (e) {
  e.preventDefault();

  modal.style.display = 'block';
  overlay.style.display = 'block';

  setTimeout(() => {
    modal.style.opacity = 1;
    overlay.style.opacity = 1;
    btnCloseModal.style.opacity = 1;
  }, 1);
});

overlay.addEventListener('click', function (e) {
  modal.style.opacity = 0;
  overlay.style.opacity = 0;
  btnCloseModal.style.opacity = 0;

  setTimeout(() => {
    modal.style.display = 'none';
    overlay.style.display = 'none';
  }, 500);
});

btnOpenAccount.addEventListener('click', function (e) {
  e.preventDefault();

  let firstName = inputCreateFirstname.value;
  let lastName = inputCreateLastname.value;
  const pin = inputCreatePin.value;

  const noNumber = word => {
    for (let letter of [...word]) {
      if (!isNaN(letter)) {
        return false;
      }
    }
    return true;
  };

  if (
    firstName !== '' &&
    lastName !== '' &&
    typeof Number(pin) === 'number' &&
    noNumber(firstName) &&
    noNumber(lastName)
  ) {
    const capitalize = name => {
      const names = name.toLowerCase().split(' ');
      const namesUpper = [];

      for (const n of names) {
        namesUpper.push(n[0].toUpperCase() + n.slice(1));
      }
      return namesUpper.join(' ');
    };

    firstName = capitalize(firstName.toLowerCase());
    lastName = capitalize(lastName.toLowerCase());

    accounts.push({
      owner: `${firstName} ${lastName}`,
      movements: [],
      interestRate: 1.2,
      pin: Number(pin),
      username: `${firstName} ${lastName}`
        .toLowerCase()
        .split(' ')
        .reduce((prev, curr) => prev + curr[0], ''),
      movementsDates: [],
      currency: 'USD',
      locale: navigator.language,
    });

    inputCreatePin.value =
      inputCreateLastname.value =
      inputCreateFirstname.value =
        '';

    modal.style.opacity = 0;
    overlay.style.opacity = 0;
    btnCloseModal.style.opacity = 0;

    setTimeout(() => {
      modal.style.display = 'none';
      overlay.style.display = 'none';
    }, 500);
  }
});

btnCloseModal.addEventListener('click', function (e) {
  e.preventDefault();
  modal.style.opacity = 0;
  overlay.style.opacity = 0;
  btnCloseModal.style.opacity = 0;

  setTimeout(() => {
    modal.style.display = 'none';
    overlay.style.display = 'none';
  }, 500);
});

document.addEventListener('keydown', function (e) {
  console.log(modal.style);
  if (e.key === 'Escape' && modal.style.display !== 'none') {
    e.preventDefault();
    modal.style.opacity = 0;
    overlay.style.opacity = 0;
    btnCloseModal.style.opacity = 0;

    setTimeout(() => {
      modal.style.display = 'none';
      overlay.style.display = 'none';
    }, 500);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
  inputTransferTo.blur();

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);

    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());

      updateUI(currentAccount);
    }, 2500);
  }

  inputLoanAmount.value = '';
  inputLoanAmount.blur();

  clearInterval(timer);
  timer = startLogOutTimer();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);
  sorted = !sorted;

  clearInterval(timer);
  timer = startLogOutTimer();
});
