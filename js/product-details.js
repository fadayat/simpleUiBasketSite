getProductDetails();

function getProductDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  console.log(id);

  showProductDetails(id);
}

function showProductDetails(id) {
  const productName = document.getElementById("productName");
  const productDescription = document.getElementById("productDescription");
  const productPriceValue = document.getElementById("priceValue");
  const productDiscountValue = document.getElementById("discountValue");
  const productStock = document.getElementById("productStock");
  const buyButton = document.getElementById("buyButton");

  let products = localStorage.getItem("products");
  products = JSON.parse(products);
  const p = products.find((p) => p.productId == id);

  if (!p) {
    console.error("Product not found");
    return;
  }

  const inStock = p.inStock ? "Stokda var" : "Stokda yoxdur";

  console.log(p.inStock);

  if (!p.inStock) {
    buyButton.classList.add("disabled"); //islemedi ay muellim
    buyButton.setAttribute("disabled", "true");
  } else {
    buyButton.classList.remove("disabled");
    buyButton.removeAttribute("disabled");
  }

  productName.textContent = p.productName;
  productDescription.textContent = p.description;
  productPriceValue.textContent = p.price;
  productDiscountValue.textContent = p.discount;
  productStock.textContent = inStock;
}
