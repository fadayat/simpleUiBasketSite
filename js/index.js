const login = document.getElementById("login");
const logout = document.querySelector(".fa-right-from-bracket");
const userIcon = document.querySelector(".fa-user");
const cartIcon = document.querySelector(".fa-cart-shopping");
const userUl = document.querySelector(".userUl");
const basketUl = document.querySelector(".basketUl");
const emptyLi = document.querySelector(".empty");
const cards = document.querySelector(".cards");
let products = [];
const badge = document.querySelector(".badget");

document.addEventListener("DOMContentLoaded", () => {
  const user = getUser();

  if (!user) {
    loginStyleFn();
  }
  fetchProducts();

  loginLogout(user);

  userInfoAddHover(user);

  checkBasket(user);

  addBasketItems(user);

  updateBadge();
});

logout?.addEventListener("click", () => {
  logoutClickFn();
  basketUl.innerHTML = "";
});

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

  document.querySelectorAll(".buyPrd").forEach((btn) => {
    btn.classList.remove("disabled");
  });

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
  logoutAllStyle();
  showMessageToast("successfully log out");
}

function logoutAllStyle() {
  login.style.display = "inline-block";
  logout.style.display = "none";

  document.querySelectorAll(".buyPrd").forEach((btn) => {
    btn.classList.add("disabled");
  });

  userIcon.style.display = "none";
  cartIcon.style.display = "none";
  userUl.innerHTML = "";
  basketUl.innerHTML = "";
  badge.style.display = "none";
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
          <img class="itemImg" src="${"./img/card.jpeg"}" alt="${
        item.productName
      }" />
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

  const checkOutBtn = document.createElement("button");
  checkOutBtn.classList.add("checkOutBtn");
  checkOutBtn.textContent = "Check out";

  localStorage.setItem("totalPrice", totalPrice);

  checkOutBtn.setAttribute("onclick", "handleCheck()");

  basketUl.appendChild(totalLi);
  basketUl.appendChild(checkOutBtn);
}

function addEventToQuantityButtons() {
  const minusButtons = document.querySelectorAll(".fa-minus");
  const plusButtons = document.querySelectorAll(".fa-plus");

  minusButtons.forEach((btn) => {
    const btnId = btn.getAttribute("data-id");
    btn.addEventListener("click", () => {
      handleMinusClick(btnId);
      updateBadge();
    });
  });

  plusButtons.forEach((btn) => {
    const btnId = btn.getAttribute("data-id");
    btn.addEventListener("click", () => {
      handlePlusClick(btnId);
      updateBadge();
    });
  });
}

function handleMinusClick(btnId) {
  updateQuantity(btnId, "minus");
}

function handlePlusClick(btnId) {
  updateQuantity(btnId, "plus");
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
      showMessageToast("product removed from basket");
    }
  } else if (type === "plus") {
    product.quantity++;
  }

  saveUser(user);

  checkBasket(user);
}

async function fetchProducts() {
  products = await fetch(
    "https://68be722b227c48698f86d903.mockapi.io/api/products/product"
  )
    .then((response) => response.json())
    .then((data) => {
      products = data;
      return products;
    })
    .catch((error) => console.log("error found", error));

  showProducts(products);

  localStorage.setItem("products", JSON.stringify(products));

  // buyBtnsEventListener();
}

function showProducts(products) {
  products.forEach((product) => {
    const shortDescription =
      product.description.length > 15
        ? product.description.slice(0, 20) + "..."
        : product.description;

    const addBasketDisabled = product.inStock ? "" : "disabledForBadge";
    const card = document.createElement("div");
    card.innerHTML = `
    <div  class="card">
          <img src="./img/card.jpeg" alt="${shortDescription}" />
          <div class="card_content">
            <h3>${product.productName}</h3>
            <p onclick="handleCard(${product.productId})" >${shortDescription}<a href='#' class='red'>read more</a></p>
          </div>
        
          <div class="auth btns">
            <button onclick="handleBtn(${product.productId})"  class="btn buyPrd  ${addBasketDisabled} ">Add to Basket</button>
          </div>
        </div>
    `;
    cards?.appendChild(card);
  });
}

function handleBtn(id) {
  const user = getUser();
  if (!user) {
    showMessageToast("Please login to add the product", "error");
    return;
  }

  const productToAdd = products.find((p) => p.productId == id);

  if (!productToAdd.inStock) {
    showMessageToast("Unfortunately, the product is out of stock", "error");
    return;
  }

  const existingItemInBasket = user.basket.find(
    (basketItem) => basketItem.productId == id
  );

  if (existingItemInBasket) {
    existingItemInBasket.quantity++;
  } else {
    const newItemForBasket = {
      ...productToAdd,
      quantity: 1,
    };
    user.basket.push(newItemForBasket);
  }

  showMessageToast("Product added to basket");
  saveUser(user);
  checkBasket(user);
  updateBadge();
}

function updateBadge() {
  if (!badge) return;

  const user = getUser();

  if (user && user.basket && user.basket.length > 0) {
    const badge = document.querySelector(".badget");

    const total = user.basket.reduce((acc, item) => {
      return acc + item.quantity;
    }, 0);
    badge.style.display = "inline-block";

    badge.textContent = total;
  } else {
    badge.style.display = "none";
  }
}

function handleCard(id) {
  window.location.href = `product-details.html?id=${id}`;
}

function handleCheck() {
  const totalPrice = localStorage.getItem("totalPrice");

  if (totalPrice > 0) {
    window.location.href = "checkout.html";
  } else {
    showMessageToast("add product to continue checkout", "error");
  }
}
