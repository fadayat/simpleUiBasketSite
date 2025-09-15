const usernameInp = document.getElementById("username");
const passwordInp = document.getElementById("password");

const loggedIn = localStorage.getItem("loggedInUser");
if (loggedIn && loggedIn !== undefined) {
  window.location.href = "index.html";
}

// MOCK USERS
let users = [
  {
    id: 1,
    username: "fake",
    password: "1234",
    email: "fake@gmail.com",
    basket: [],
  },

  {
    id: 2,
    username: "fake2",
    password: "1234",
    email: "fake2@gmail.com",
    basket: [],
  },
];

// CHECK IF USERS EXIST
let storedUsers = localStorage.getItem("users");

if (!storedUsers) {
  localStorage.setItem("users", JSON.stringify(users));
} else {
  users = JSON.parse(storedUsers);
}

// SELECT INPUTS

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
    showMessageValidate("User not found", "error", "password");
    return;
  } else {
    if (user.password !== passwordInp.value) {
      showMessageValidate("Wrong password", "error", "password");
      return;
    }

    // check password

    // succesfull login
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    showMessageValidate("Login successful!", "success", "password");
    window.location.href = "index.html";
  }
}

// VALIDATE FUNCTION
function validateInputs() {
  const allMsgs = document.querySelectorAll(".validation-msg");
  allMsgs.forEach((msg) => msg.remove());

  if (!usernameInp.value || !passwordInp.value) {
    if (!usernameInp.value) {
      showMessageValidate("Please enter your username.", "error", "username");
    }

    if (!passwordInp.value) {
      showMessageValidate("Please enter your password.", "error", "password");
    }
    return false;
  } else {
    return true;
  }
}

// SHOW MSGS FN
