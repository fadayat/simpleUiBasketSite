// checkout.js

document.addEventListener("DOMContentLoaded", () => {
  // Function to display order summary
  displayOrderSummary();

  //   validatePaymentInputs();
});

function displayOrderSummary() {
  // Elements
  shippingFee = document.getElementById("shippingFee");
  freeShippingms = document.getElementById("shipping-message");
  summaryTotal = document.getElementById("summary-total");
  summarySubtotal = document.getElementById("summary-subtotal");

  // Get total price from localStorage
  let totalPrice = Number(localStorage.getItem("totalPrice"));

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
  const number = Number(
    getElByIdValue("card-number").trim().replace(/\s/g, "")
  );
  const dateFull = getElByIdValue("expiry-date");
  const cvc = Number(getElByIdValue("cvc"));

  let card = cards.find((card) => number == card.cardNumber);

  if (!card) {
    showMessageValidate("card number is invalid", "error", "card-number");
    return;
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

  otpCodeContainer();
}

let triesCount = 2;
async function handleVerificationSubmit(e) {
  e.preventDefault();

  code = getElByIdValue("verification-code");

  if (code.length != 4) {
    showMessageValidate(
      "code  must be  4 charackter",
      "error",
      "verification-code"
    );
    return;
  } else {
    hideMessageValidate("verification-code");
  }

  const id = localStorage.getItem("nowPayCardId");

  const res = await fetch(
    `https://68be722b227c48698f86d903.mockapi.io/api/products/cards/${id}`
  );

  const card = await res.json();

  if (Number(code) !== card.code) {
    if (triesCount == 0) {
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
        `code is wrong, try again you have ${triesCount} try`,
        "error",
        "verification-code"
      );
      triesCount--;
      return;
    }
  } else {
    const totalPrice = Number(localStorage.getItem("totalPrice"));
    console.log(totalPrice);
    console.log(card.balance);

    if (Number(totalPrice) > Number(card.balance)) {
      showMessageValidate(
        `balance is not enought your balance: ${card.balance}`,
        "error",
        "verification-code"
      );
      return;
    }

    const updatedBalance = card.balance - totalPrice;

    const fullCardData = {
      ...card,
      balance: updatedBalance,
    };

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
            `code is true thanks for your order`,
            "success",
            "verification-code"
          );
        } else {
          showMessageValidate(
            `Failed to update card balance`,
            "error",
            "verification-code"
          );
        }
      })
      .catch((error) => {
        showMessageValidate(
          ` error, please try again error: ${error}`,
          "error",
          "verification-code"
        );
      });
  }
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

function otpCodeContainer() {
  main = document.getElementById("main");
  main.innerHTML = "";

  main.innerHTML = `
    <div class="form-container">
        <form onsubmit="handleVerificationSubmit(event)">
            <h2>Verification Code</h2>
            <p>Enter the verification code sent by your bank to complete the payment.</p>
            <div class="input-piece">
                <label for="verification-code">Otp Code</label>
                <input inputmode="numeric" maxlength="4" type="text"  id="verification-code" oninput="formatVerificationInp(event)" placeholder="Enter the Code" />
            </div>
            <button type="submit">
                <span>Verify the payment</span>
                <span id="submit-spinner" class="spinner"></span>
            </button>
        </form>
        <div id="toast-notification"></div>
    </div>`;
}
