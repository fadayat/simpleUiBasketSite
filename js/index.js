const login = document.getElementById("login");
const logout = document.querySelector(".fa-right-from-bracket");
const buyBtn = document.querySelector(".buyPrd");
const addToBasketBtn = document.querySelector(".addToBasket");
const userIcon = document.querySelector(".fa-user");
const cartIcon = document.querySelector(".fa-cart-shopping");
const userUl = document.querySelector(".userUl");
const basketUl = document.querySelector(".basketUl");
const emptyLi = document.querySelector(".empty");
// const minusButton = document.getElementsByClassName("fa-minus");
// const plusButton = document.getElementsByClassName("fa-plus");

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
  let totalPrice = 0; //

  user.basket.forEach((item) => {
    const itemLi = document.createElement("li");
    itemLi.classList.add("basket-item");

    const discountedPrice = Math.floor(item.price * (1 - item.discount / 100));

    if (item.inStock) {
      totalPrice += discountedPrice * item.quantity;
    }
    const inStockClass = item.inStock ? "inStock" : "noStock";
    const inStockText = item.inStock ? "in Stock" : "No Stock";

    console.log(item.productID);

    itemLi.innerHTML = `
  <div class="basket-product">
    <img class="itemImg" src="${item.image}" alt="${item.productName}" />
    <div class="product-info">
      <h3>${item.productName}</h3>
      <p> Price:  ${item.price}</p>
      <p class="finalPrice"> Final Price:  ${discountedPrice}</p>
      <p class="align-center"> Count:
       <i data-id="${item.productId}" class="fa-solid fa-minus"></i>
        <span class="countSpan" >${item.quantity} </span>
      <i  class="fa-solid fa-plus" data-id="${item.productId}" ></i></p>
      <p class="${inStockClass}">  ${inStockText}</p>
      <hr/>
    </div>
  </div>
`;

    basketUl.appendChild(itemLi);
  });

  if (user.basket && user.basket.length > 0) {
    const totalPriceLi = document.createElement("li");

    totalPriceLi.textContent = `Total Price: ${totalPrice}$`;
    basketUl.appendChild(totalPriceLi);
  }
  addEventToQuantityButtons();
}

function addEventToQuantityButtons() {
  const minusButtons = document.querySelectorAll(".fa-minus");
  const plusButtons = document.querySelectorAll(".fa-plus");

  minusButtons.forEach((btn) => {
    const btnId = btn.getAttribute("data-id");
    btn.addEventListener("click", () => {
      handleMinusClick(btnId);
    });
  });

  plusButtons.forEach((btn) => {
    const btnId = btn.getAttribute("data-id");
    btn.addEventListener("click", () => {
      handlePlusClick(btnId);
    });
  });
}

function handleMinusClick(Btnid) {
  updateQuantity();
}

function handlePlusClick(id) {
  updateQuantity();
}

function saveUser(user) {
  localStorage.setItem("loggedInUser", JSON.stringify(user));
}

function updateQuantity(productId, type) {
  const user = getUser();
  if (!user || !user.basket) return;

  const product = user.basket.find((item) => item.productId == productId);
  if (!product) return;

  if (type === "minus" && product.quantity > 0) {
    product.quantity--;
  } else if (type === "plus") {
    product.quantity++;
  }

  //

  saveUser(user);
  checkBasket(user);
}
