const login = document.getElementById("login");
const logout = document.querySelector(".fa-right-from-bracket");
const buyBtn = document.querySelector(".buyPrd");
const addToBasketBtn = document.querySelector(".addToBasket");
const userIcon = document.querySelector(".fa-user");
const cartIcon = document.querySelector(".fa-cart-shopping");
const userUl = document.querySelector(".userUl");
const basketUl = document.querySelector(".basketUl");
const emptyLi = document.querySelector(".empty");

// console.log(getUser());

document.addEventListener("DOMContentLoaded", () => {
  const user = getUser();
  console.log(user);

  loginLogout(user);

  userInfoAddHover(user);

  checkBasket(user);

  addBasketItems(user);
});

logout.addEventListener("click", () => {
  logoutClickFn();
  basketUl.innerHTML = "";
});

function getUser() {
  const userHas = localStorage.getItem("loggedInUser");
  const user = JSON.parse(userHas);

  return user;
}

function loginLogout(hasUser) {
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

// ADD USER INFO ON HOVER
function userInfoAddHover(user) {
  const nameLi = document.createElement("li");
  nameLi.textContent = `ad: ${user.username}`;

  const emailLi = document.createElement("li");
  emailLi.textContent = `email: ${user.email}`;

  userUl.appendChild(nameLi);
  userUl.appendChild(emailLi);
}

function addBasketItems(user) {
  if (user.basket) {
    emptyLi.remove();

    itemAddToBasket(user);
  }
}
function checkBasket(user) {
  basketUl.innerHTML = "";

  if (user.basket) {
    itemAddToBasket(user);
  }
}

function itemAddToBasket(user) {
  basketUl.innerHTML = "";

  user.basket.forEach((item) => {
    const itemLi = document.createElement("li");
    itemLi.classList.add("basket-item");

    const discountedPrice = Math.floor(item.price * (1 - item.discount / 100));

    const inStockClass = item.inStock ? "inStock" : "noStock";
    const inStockText = item.inStock ? "in Stock" : "No Stock";

    itemLi.innerHTML = `
  <div class="basket-product">
    <img class="itemImg" src="${item.image}" alt="${item.productName}" />
    <div class="product-info">
      <h3>${item.productName}</h3>
      <p> Price:  $${item.price}</p>
      <p> Discount:  ${item.discount}%</p>
      <p class="finalPrice"> Final Price:  $${discountedPrice}</p>
      <p> Count:  ${item.quantity}</p>
      <p class="${inStockClass}">  ${inStockText}</p>
      <hr/>
    </div>
  </div>
`;

    basketUl.appendChild(itemLi);
  });
}
