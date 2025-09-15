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

function formatCardDateInput(e) {
  let value = e.target.value;

  isOnlyNumber(value, "Only numbers are allowed", "error", "expiry-date");

  let cleanedValue = value.replace(/[^\d/]/g, "");

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
