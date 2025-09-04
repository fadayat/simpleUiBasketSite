const login = document.getElementById("login");
const logout = document.querySelector(".fa-right-from-bracket");
const buyBtn = document.querySelector(".buyPrd");
const addToBasketBtn = document.querySelector(".addToBasket");
const userIcon = document.querySelector(".fa-user");
const cartIcon = document.querySelector(".fa-cart-shopping");

document.addEventListener("DOMContentLoaded", () => {
  const hasUser = localStorage.getItem("loggedInUser");

  loginLogut(hasUser);
});

logout.addEventListener("click", () => {
  logoutClickFn();
});

function loginLogut(hasUser) {
  if (hasUser) {
    loginStyleFn();
  } else {
    logoutStyleFn();
  }
}

function loginStyleFn() {
  console.log("User is logged in.");
  login.style.display = "none";
  logout.style.display = "inline-block";
  buyBtn.classList.remove("disabled");
  addToBasketBtn.classList.remove("disabled");
}

function logoutStyleFn() {
  console.log("User is not logged in.");

  logoutAllStyle();
}

function logoutClickFn() {
  localStorage.removeItem("loggedInUser");
  console.log("User logged out.");
  logoutAllStyle();
}

function logoutAllStyle() {
  login.style.display = "inline-block";
  logout.style.display = "none";
  buyBtn.classList.add("disabled");
  addToBasketBtn.classList.add("disabled");
  userIcon.style.display = "none";
  cartIcon.style.display = "none";
}
