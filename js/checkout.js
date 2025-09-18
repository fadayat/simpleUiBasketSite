document.addEventListener("DOMContentLoaded", () => {
  // Function to display order summary
  displayOrderSummary();
  localStorage.removeItem("installmentMonth");

  //   validatePaymentInputs();
});

function displayOrderSummary() {
  // Elements
  shippingFee = document.getElementById("shippingFee");
  freeShippingms = document.getElementById("shipping-message");
  summaryTotal = document.getElementById("summary-total");
  summarySubtotal = document.getElementById("summary-subtotal");
  installment = localStorage.getItem("installment");

  installment && localStorage.removeItem("installment");

  // Get total price from localStorage
  let totalPrice = Number(localStorage.getItem("totalPrice"));
  if (!totalPrice) {
    window.location.href = "index.html";
  }

  // Update the sub summary section
  summarySubtotal.textContent = totalPrice + " AZN";

  // Free shipping for orders over 100 AZN
  if (totalPrice > 100) {
    shippingFee.textContent = "Free";
    freeShippingms.textContent =
      "Since your order is over 100 AZN, delivery is free.";
  } else {
    // Add 20 AZN shipping fee for orders 100 AZN or less
    shippingFee.textContent = "20 AZN";
    freeShippingms.textContent = "";
    totalPrice = totalPrice + 20;
  }

  // Update total price
  summaryTotal.textContent = totalPrice + " AZN";
}

// Validate payment inputs

// format card number input
function FormatCardNumberInput(e) {
  let value = e.target.value;

  isOnlyNumber(value, "Only numbers are allowed", "error", "card-number");

  let cleanedValue = value.replace(/[^\d\s]/g, "");

  e.target.value = cleanedValue;

  let presentValue = cleanedValue;

  length = presentValue.length;

  if (length == 4 || length == 9 || length == 14) {
    presentValue += " ";
    e.target.value = presentValue;
  }
}

let lastValidValue = "";

function formatCardDateInput(e) {
  let value = e.target.value;

  const isValid = isOnlyNumber(
    value,
    "Only numbers are allowed",
    "error",
    "expiry-date"
  );

  if (!isValid) {
    e.target.value = lastValidValue;
    return;
  }

  let cleanedValue = value.replace(/[^\d/]/g, "");

  let digits = Number(cleanedValue.slice(0, 2));

  if (digits < 0 || digits > 12) {
    showMessageValidate(
      "password month must be till 12",
      "error",
      "expiry-date"
    );
    e.target.value = lastValidValue;
    return;
  } else {
    hideMessageValidate("expiry-date");
  }

  e.target.value = cleanedValue;

  let presentValue = cleanedValue;

  length = presentValue.length;

  if (length == 2) {
    presentValue += "/";
    e.target.value = presentValue;
  }
}

function formatCvcInput(e) {
  let value = e.target.value;

  isOnlyNumber(value, "Only numbers are allowed", "error", "cvc");

  let cleanedValue = value.replace(/[^\d]/g, "");

  e.target.value = cleanedValue;

  let presentValue = cleanedValue;

  length = presentValue.length;
}

function isOnlyNumber(value, message, type, place) {
  let isNumbers;

  switch (place) {
    case "card-number":
      isNumbers = /^[\d\s]+$/.test(value);
      break;

    case "expiry-date":
      isNumbers = /^[\d\s\/]+$/.test(value);
      break;

    case "cvc":
      isNumbers = /^\d+$/.test(value);
      break;

    case "verification-code":
      isNumbers = /^\d+$/.test(value);
      break;

    default:
      isNumbers = false;
      break;
  }

  if (value !== " ") {
    if (!isNumbers) {
      showMessageValidate(message, type, place);
      return;
    } else if (isNumbers) {
      hideMessageValidate(place);
    }
  }

  return isNumbers;
}

async function handlePay(e) {
  e.preventDefault();
  const isValid = validateInputs();

  const spinner = document.getElementById("submit-spinner");
  const btn = document.getElementById("submit-btn");

  spinner.style.display = "inline-block";
  btn.disabled = true;

  if (isValid) {
    try {
      console.log("card yoxlanilir");

      const data = await fetchAllCards();
      checkCard(data);
    } catch (error) {
      console.error(error);
    }
  }

  spinner.style.display = "none";
  btn.disabled = false;
}

function validateInputs() {
  const isCardValid = cardNumberValidate();

  const isDateValid = expiryDateValidate();

  const isCvcValid = cvcValidate();

  return isCardValid && isDateValid && isCvcValid;
}

function cardNumberValidate() {
  const value = getElByIdValue("card-number");

  if (!value.trim()) {
    showMessageValidate(
      "please fill card number input",
      "error",
      "card-number"
    );
    return false;
  } else if (value.trim().length !== 19) {
    showMessageValidate(
      "please write card number with 16 number ",
      "error",
      "card-number"
    );
    return false;
  }
  return true;
}

function expiryDateValidate() {
  const value = getElByIdValue("expiry-date");

  if (!value.trim()) {
    showMessageValidate(
      "please fill expiry date input",
      "error",
      "expiry-date"
    );
    return false;
  } else if (value.trim().length !== 5) {
    showMessageValidate("please fill this input full", "error", "expiry-date");
    return false;
  }
  return true;
}

function cvcValidate() {
  const value = getElByIdValue("cvc");

  if (!value.trim()) {
    showMessageValidate("please fill cvc input", "error", "cvc");
    return false;
  } else if (value.trim().length !== 3) {
    showMessageValidate("please fill cvc input full", "error", "cvc");
    return false;
  }
  return true;
}

async function fetchAllCards() {
  const res = await fetch(
    "https://68be722b227c48698f86d903.mockapi.io/api/products/cards"
  );

  const data = await res.json();

  return data;
}

function checkCard(cards) {
  const installmentYes = localStorage.getItem("installment");
  const select = getElByIdValue("installment-months");
  let hasMonth = select
    ? Number(select)
    : Number(localStorage.getItem("installmentMonth"));

  console.log(hasMonth);

  const number = Number(
    getElByIdValue("card-number").trim().replace(/\s/g, "")
  );
  const dateFull = getElByIdValue("expiry-date");
  const cvc = Number(getElByIdValue("cvc"));

  if (![3, 6, 12].includes(hasMonth) && installmentYes) {
    showMessageValidate("please select month", "error", "installment-months");
    return;
  }

  let card = cards.find((card) => number == card.cardNumber);

  if (!card) {
    showMessageValidate("card number is invalid", "error", "card-number");
    return;
  }

  if (installmentYes) {
    if (card.installment !== true) {
      showMessageValidate(
        "this card doesnt support to pay in installment",
        "error",
        "cvc"
      );
      return;
    }
  }

  if (dateFull) {
    let [month, year] = dateFull.split("/");
    month = Number(month);
    year = Number(year);

    if (month !== card.expiryMonth) {
      showMessageValidate("month is invalid", "error", "expiry-date");
      return;
    }

    if (year !== card.expiryYear) {
      showMessageValidate("card  year is invalid", "error", "expiry-date");
      return;
    }
  }

  if (cvc !== card.cvc) {
    showMessageValidate("cvc is invalid", "error", "cvc");
    return;
  }

  localStorage.setItem("nowPayCardId", card.id);

  let installment = false;
  if (hasMonth && installmentYes) {
    installment = true;
  }

  otpCodeContainer(installment, hasMonth);
}

async function handleVerificationSubmit(e) {
  const form = document.getElementById("verification-form");
  let installament = document.getElementById("installament-payment");

  if (installament) {
    installament = true;
  } else {
    installament = false;
  }

  e.preventDefault();

  code = getElByIdValue("verification-code");

  const letterCount = checkLetterCount(code);
  if (!letterCount) {
    return;
  }

  const card = await getCard();

  cardValidation(code, card, form.dataset.tries, installament);
}

function CompleteOrderUpdateBalance(card, fullCardData) {
  fetch(
    `https://68be722b227c48698f86d903.mockapi.io/api/products/cards/${card.id}`,
    {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(fullCardData),
    }
  )
    .then((response) => {
      if (response.ok) {
        showMessageValidate(
          `code is true thanks for your order, you are redirecting to main page`,
          "success",
          "verification-code"
        );

        cleanBasket();
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1500);
        return true;
      } else {
        showMessageValidate(
          `Failed to complete order`,
          "error",
          "verification-code"
        );
      }
    })
    .catch((error) => {
      showMessageValidate(
        `error, please try again, error: ${error}`,
        "error",
        "verification-code"
      );
    });
}

function checkLetterCount(code) {
  if (code.length != 4) {
    showMessageValidate(
      "code  must be  4 charackter",
      "error",
      "verification-code"
    );
    return false;
  } else {
    hideMessageValidate("verification-code");
    return true;
  }
}
async function getCard() {
  const id = localStorage.getItem("nowPayCardId");

  const res = await fetch(
    `https://68be722b227c48698f86d903.mockapi.io/api/products/cards/${id}`
  );

  const card = await res.json();
  return card;
}

function formatVerificationInp(e) {
  let value = e.target.value;

  if (value != "")
    isOnlyNumber(
      value,
      "Only numbers are allowed",
      "error",
      "verification-code"
    );

  let cleanedValue = value.replace(/\D/g, "");

  e.target.value = cleanedValue;
}

function otpCodeContainer(installment, month) {
  const main = document.getElementById("main");
  const total = localStorage.getItem("totalPrice");
  main.innerHTML = "";

  main.innerHTML = `
    <div class="form-container">
        <form id="verification-form" onsubmit="handleVerificationSubmit(event)" data-tries="2">
            <h2>Verification Code</h2>
            <p>Enter the verification code sent by your bank to complete the payment.</p>
            <div class="input-piece">
                <label for="verification-code">Otp Code</label>
                <input inputmode="numeric" maxlength="4" type="text" id="verification-code" oninput="formatVerificationInp(event)" placeholder="Enter the Code" />
            </div>
            <button id='smtButton' type="submit">
                <span>Verify the payment</span>
                <span id="submit-spinner" class="spinner"></span>
            </button>

            ${
              installment
                ? `<div class="installment-info">
                    <p id="installament-payment" >Installament Payment</p>
                    <p>${month} month </p>
                    <p>Monthly Payment ${total / month} </p>
                   </div>`
                : ""
            }
        </form>
        <div id="toast-notification"></div>
    </div>`;
}

function cardValidation(code, card, tryCount, installament) {
  const form = document.getElementById("verification-form");

  if (Number(code) !== card.code) {
    if (tryCount == 0) {
      showMessageValidate(
        `card is blocked, you are redirecting to main page`,
        "error",
        "verification-code"
      );
      setTimeout(() => {
        window.location.href = "index.html";
        return;
      }, 2000);
    } else {
      showMessageValidate(
        `code is wrong, try again you have ${tryCount} try`,
        "error",
        "verification-code"
      );

      tryCount--;
      form.dataset.tries = tryCount;
      return;
    }
  } else {
    const totalPrice = Number(localStorage.getItem("totalPrice"));

    if (Number(totalPrice) > Number(card.balance)) {
      showMessageValidate(
        `balance is not enought, your balance: ${card.balance}, you are redirecting to checkout page`,
        "error",
        "verification-code"
      );
      setTimeout(() => {
        window.location.href = "checkout.html";
      }, 1500);
      return;
    }

    const btn = document.getElementById("smtButton");
    btn.classList = "disabled";

    if (installament) {
      updatedBalance = card.balance;
    } else {
      const updatedBalance = card.balance - totalPrice;
    }

    const fullCardData = {
      ...card,
      balance: updatedBalance,
    };

    CompleteOrderUpdateBalance(card, fullCardData);

    return true;
  }
}

function cleanBasket() {
  let user = localStorage.getItem("loggedInUser");
  user = JSON.parse(user);
  console.log(user);
  user = { ...user, basket: [] };

  saveUser(user);
}

function handleInstallment(e) {
  const btn = document.getElementById("installmentYes");

  let localInstallament = localStorage.getItem("installment");

  const select = document.getElementById("installment-months");

  const monthlyPaymentMainDiv = document.getElementById("monthlyPayMainDiv");

  if (localInstallament) {
    btn?.classList?.remove("installmentYes");
    localStorage.removeItem("installment");
    select.style.display = "none";
    localStorage.removeItem("installmentMonth");
    monthlyPaymentMainDiv.style.display = "none";
  } else {
    btn?.classList?.add("installmentYes");
    localStorage.setItem("installment", 1);
    select.style.display = "inline-block";
  }
  chooseMonth();
}

function chooseMonth() {
  const month = document.getElementById("installment-months");

  const label = document.getElementById("installmentYesLabel");
  const monthlyPay = document.getElementById("monthlyPay");
  label.textContent =
    label.textContent === "Choose Month"
      ? "Would you like to pay in installments?"
      : "Choose Month";
}

function handleMonth(e) {
  localStorage.setItem("installmentMonth", e.target.value);
  showMonthlyPay();
}

function showMonthlyPay() {
  const totalPrice = Number(localStorage.getItem("totalPrice"));
  const month = Number(localStorage.getItem("installmentMonth"));

  monthlyPaymentDiv = document.getElementById("monthlyPay");
  monthlyPaymentMainDiv = document.getElementById("monthlyPayMainDiv");

  monthlyPayment = totalPrice / Number(month);
  monthlyPaymentDiv.textContent = monthlyPayment;
  console.log(month);

  if (month !== 0) {
    monthlyPaymentMainDiv.style.display = "block";
  }
}
