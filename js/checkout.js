// checkout.js

document.addEventListener("DOMContentLoaded", () => {
  // Function to display order summary
  displayOrderSummary();
  formatCardNumberInput();

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

// function validatePaymentInputs() {}

function formatCardNumberInput() {
  const cardNumberInp = document.getElementById("card-number");

  cardNumberInp.addEventListener("input", (e) => {
    presentValue = e.target.value;

    presentValueLenghts = presentValue.length;

    if (
      presentValueLenghts == 4 ||
      presentValueLenghts == 9 ||
      presentValueLenghts == 14
    ) {
      presentValue += " ";
      e.target.value = presentValue;
    }
  });
}
