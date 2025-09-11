document.addEventListener("DOMContentLoaded", () => {
  displayOrderSummary();
});

function displayOrderSummary() {
  const user = getUser();
  user.basket.forEach((basketItem) => {
    console.log(basketItem);
  });
}
