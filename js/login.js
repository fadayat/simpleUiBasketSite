if (localStorage.getItem("loggedInUser")) {
  window.location.href = "index.html";
}

// MOCK USERS
const users = [
  {
    id: 1,
    username: "fake",
    password: "1234",
    email: "fake@gmail.com",
    basket: [
      {
        productId: 1,
        productName: "iPhone 13",
        brand: "Apple",
        category: "Smartphone",
        price: 2199,
        discount: 10, // %
        quantity: 100,
        inStock: true,
        rating: 4.8,
        description:
          "Apple iPhone 13 with A15 Bionic chip and dual-camera system.",
        image:
          "https://d2v5dzhdg4zhx3.cloudfront.net/web-assets/images/storypages/primary/ProductShowcasesampleimages/JPEG/Product+Showcase-1.jpg",
      },
      {
        productId: 2,
        productName: "Samsung Galaxy S22",
        brand: "Samsung",
        category: "Smartphone",
        price: 1899,
        discount: 5,
        quantity: 2,
        inStock: true,
        rating: 4.5,
        description:
          "Samsung Galaxy S22 with Dynamic AMOLED display and triple cameras.",
        image:
          "https://d2v5dzhdg4zhx3.cloudfront.net/web-assets/images/storypages/primary/ProductShowcasesampleimages/JPEG/Product+Showcase-1.jpg",
      },
      {
        productId: 3,
        productName: "Google Pixel 7",
        brand: "Google",
        category: "Smartphone",
        price: 1699,
        discount: 0,
        quantity: 1,
        inStock: false,
        rating: 4.6,
        description:
          "Google Pixel 7 with Tensor chip and pure Android experience.",
        image:
          "https://d2v5dzhdg4zhx3.cloudfront.net/web-assets/images/storypages/primary/ProductShowcasesampleimages/JPEG/Product+Showcase-1.jpg",
      },
    ],
  },

  {
    id: 2,
    username: "fake2",
    password: "1234",
    email: "fake2@gmail.com",
    basket: [
      {
        productId: 1,
        productName: "iPhone 13",
        brand: "Apple",
        category: "Smartphone",
        price: 2199,
        discount: 10, // %
        quantity: 1,
        inStock: true,
        rating: 4.8,
        description:
          "Apple iPhone 13 with A15 Bionic chip and dual-camera system.",
        image:
          "https://d2v5dzhdg4zhx3.cloudfront.net/web-assets/images/storypages/primary/ProductShowcasesampleimages/JPEG/Product+Showcase-1.jpg",
      },
    ],
  },
];

localStorage.setItem("users", JSON.stringify(users));

// SELECT INPUTS
const usernameInp = document.getElementById("username");
const passwordInp = document.getElementById("password");

// LOGIN FUNCTION
function handleLogin(e) {
  e.preventDefault();

  // VALIDATE INPUTS
  if (!validateInputs()) {
    return;
  }

  // FIND USER
  const user = users.find((u) => u.username === usernameInp.value);

  console.log(user);

  // USER NOT FOUND
  if (!user) {
    showMessage("User not found", "error", "password");
    return;
  } else {
    if (user.password !== passwordInp.value) {
      showMessage("Wrong password", "error", "password");
      return;
    }

    // check password

    // succesfull login
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    showMessage("Login successful!", "success", "password");
    window.location.href = "index.html";
  }
}

// VALIDATE FUNCTION
function validateInputs() {
  const allMsgs = document.querySelectorAll(".validation-msg");
  allMsgs.forEach((msg) => msg.remove());

  if (!usernameInp.value || !passwordInp.value) {
    if (!usernameInp.value) {
      showMessage("Please enter your username.", "error", "username");
    }

    if (!passwordInp.value) {
      showMessage("Please enter your password.", "error", "password");
    }
    return false;
  } else {
    return true;
  }
}

// SHOW MSGS FN
function showMessage(message, type, place) {
  const input = document.getElementById(place);

  const next = input.nextElementSibling;
  if (next && next.classList.contains("validation-msg")) {
    next.remove();
  }

  const msgDiv = document.createElement("span");
  msgDiv.className = `validation-msg message ${type}`;
  msgDiv.textContent = message;

  input.after(msgDiv);
}
