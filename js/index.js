const login = document.getElementById("login");
const logout = document.querySelector(".fa-right-from-bracket");
const buyBtn = document.querySelector(".buyPrd");
const addToBasketBtn = document.querySelector(".addToBasket");
const userIcon = document.querySelector(".fa-user");
const cartIcon = document.querySelector(".fa-cart-shopping");
const userUl = document.querySelector(".userUl");
const basketUl = document.querySelector(".basketUl");
const emptyLi = document.querySelector(".empty");

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

  if (!userHas) {
    return false;
  }

  try {
    const user = JSON.parse(userHas);
    return user;
  } catch (e) {
    console.error("JSON parse error in getUser:", e);
    return false;
  }
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
  userIcon.style.display = "inline-block";
  cartIcon.style.display = "inline-block";
}

function logoutStyleFn() {
  console.log("User is not logged in.");
  saveUser();

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
  userUl.innerHTML = "";
  basketUl.innerHTML = "";
}

function userInfoAddHover(user) {
  userUl.innerHTML = "";

  if (!user) return;

  const nameLi = document.createElement("li");
  nameLi.textContent = `ad: ${user.username}`;

  const emailLi = document.createElement("li");
  emailLi.textContent = `email: ${user.email}`;

  userUl.appendChild(nameLi);
  userUl.appendChild(emailLi);
}

function addBasketItems(user) {
  if (user && user.basket && user.basket.length > 0) {
    if (emptyLi) emptyLi.remove();

    itemAddToBasket(user);
    addEventToQuantityButtons();
  }
}

function checkBasket(user) {
  basketUl.innerHTML = "";

  if (user && user.basket && user.basket.length > 0) {
    itemAddToBasket(user);
    addEventToQuantityButtons();

    if (emptyLi) {
      emptyLi.remove();
    }
  } else {
    if (emptyLi) {
      basketUl.appendChild(emptyLi);
    }
  }
}

function itemAddToBasket(user) {
  basketUl.innerHTML = "";

  let totalPrice = 0;

  user.basket.forEach((item) => {
    const quantity = Number(item.quantity);

    if (quantity > 0) {
      const discountedPrice = Math.floor(
        item.price * (1 - item.discount / 100)
      );
      if (item.inStock) {
        totalPrice += discountedPrice * quantity;
      }
      const inStockClass = item.inStock ? "inStock" : "noStock";
      const inStockText = item.inStock ? "In Stock" : "No Stock";

      const itemLi = document.createElement("li");
      itemLi.classList.add("basket-item");

      itemLi.innerHTML = `
        <div class="basket-product">
          <img class="itemImg" src="${item.image}" alt="${item.productName}" />
          <div class="product-info">
            <h3>${item.productName}</h3>
            <p>Price: ${item.price}</p>
            <p>Discount: ${item.discount}%</p>
            <p class="finalPrice"> Final Price: ${discountedPrice}</p>
            <p class="align-center">Count:
              <i data-id="${item.productId}" class="fa-solid fa-minus"></i>
              <span class="countSpan">${quantity}</span>
              <i class="fa-solid fa-plus" data-id="${item.productId}"></i>
            </p>
            <p class="${inStockClass}">${inStockText}</p>
            <hr/>
          </div>
        </div>
      `;

      basketUl.appendChild(itemLi);
    }
  });

  totalPriced(totalPrice, basketUl);
}

function totalPriced(totalPrice, basketUl) {
  const existingTotalLi = basketUl.querySelector(".totalPrice");
  if (existingTotalLi) {
    existingTotalLi.remove();
  }

  const totalLi = document.createElement("li");
  totalLi.classList.add("totalPrice");
  totalLi.textContent = `Total Price: ${totalPrice}$`;

  basketUl.appendChild(totalLi);
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

function handleMinusClick(btnId) {
  updateQuantity(btnId, "minus");
}

function handlePlusClick(btnId) {
  updateQuantity(btnId, "plus");
}

function saveUser(user) {
  if (!user) return;

  try {
    localStorage.setItem("loggedInUser", JSON.stringify(user));

    let users = localStorage.getItem("users");
    users = users ? JSON.parse(users) : [];

    users = users.map((u) => (u.id === user.id ? user : u));

    localStorage.setItem("users", JSON.stringify(users));
  } catch (e) {
    console.error("saveUser error:", e);
  }
}

function updateQuantity(productId, type) {
  const user = getUser();
  if (!user || !user.basket) return;

  const product = user.basket.find((item) => item.productId == productId);
  if (!product) return;

  if (type === "minus" && product.quantity > 0) {
    product.quantity--;

    if (product.quantity === 0) {
      user.basket = user.basket.filter((item) => item.productId !== productId);
    }
  } else if (type === "plus") {
    product.quantity++;
  }

  saveUser(user);

  checkBasket(user);
}
