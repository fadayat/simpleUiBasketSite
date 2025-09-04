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
  },

  {
    id: 2,
    username: "fake2",
    password: "1234",
    email: "fake2@gmail.com",
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
