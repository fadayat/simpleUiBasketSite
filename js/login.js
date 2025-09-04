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
      // {
      //   productId: 1,
      //   productName: "iPhone 13",
      //   brand: "Apple",
      //   category: "Smartphone",
      //   price: 2199,
      //   discount: 10, // %
      //   quantity: 1,
      //   inStock: true,
      //   rating: 4.8,
      //   description:
      //     "Apple iPhone 13 with A15 Bionic chip and dual-camera system.",
      //   image:
      //     "https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fthvnext.bing.com%2Fth%2Fid%2FOIP.v4mbTq6Q_8qVN5MYI8XOEgHaFG%3Fcb%3Ducfimg2%26pid%3DApi%26ucfimg%3D1&sp=1756983322Tc19508e6044d2ab1882b71dcff5485a2e374e8d6f34b592793ec8eb69e1210f5",
      // },
      // {
      //   productId: 2,
      //   productName: "Samsung Galaxy S22",
      //   brand: "Samsung",
      //   category: "Smartphone",
      //   price: 1899,
      //   discount: 5,
      //   quantity: 2,
      //   inStock: true,
      //   rating: 4.5,
      //   description:
      //     "Samsung Galaxy S22 with Dynamic AMOLED display and triple cameras.",
      //   image:
      //     "https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fthvnext.bing.com%2Fth%2Fid%2FOIP.v4mbTq6Q_8qVN5MYI8XOEgHaFG%3Fcb%3Ducfimg2%26pid%3DApi%26ucfimg%3D1&sp=1756983322Tc19508e6044d2ab1882b71dcff5485a2e374e8d6f34b592793ec8eb69e1210f5",
      // },
      // {
      //   productId: 3,
      //   productName: "Google Pixel 7",
      //   brand: "Google",
      //   category: "Smartphone",
      //   price: 1699,
      //   discount: 0,
      //   quantity: 1,
      //   inStock: false,
      //   rating: 4.6,
      //   description:
      //     "Google Pixel 7 with Tensor chip and pure Android experience.",
      //   image:
      //     "https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fthvnext.bing.com%2Fth%2Fid%2FOIP.v4mbTq6Q_8qVN5MYI8XOEgHaFG%3Fcb%3Ducfimg2%26pid%3DApi%26ucfimg%3D1&sp=1756983322Tc19508e6044d2ab1882b71dcff5485a2e374e8d6f34b592793ec8eb69e1210f5",
      // },
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
        image: "../img/card.jpg",
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
