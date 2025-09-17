// Utility functions

// Get logged in user from local storage
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

// Show validation message
function showMessageToast(message = "something happened", type = "success") {
  const notification = document.getElementById("toast-notification");

  notification.textContent = message;
  notification.className = "";

  notification.classList.add(type);
  notification.classList.add("show");

  setTimeout(() => notification.classList.remove("show"), 1000);
}

// Save or update user in local storage
function saveUser(user) {
  if (!user) return;

  try {
    localStorage.setItem("loggedInUser", JSON.stringify(user));

    let users = localStorage.getItem("users");
    users = users ? JSON.parse(users) : [];

    users = users.map((u) => (u.id === user.id ? user : u));

    localStorage.setItem("users", JSON.stringify(users));
  } catch (e) {
    console.error("save User error:", e);
  }
}

// Show validation message next to input
function showMessageValidate(message, type, place) {
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

function hideMessageValidate(place) {
  const input = document.getElementById(place);
  const next = input.nextElementSibling;

  if (next && next.classList.contains("validation-msg")) {
    next.remove();
  }
}

function getElByIdValue(id) {
  return document.getElementById(id).value;
}

function userIsLogin() {
  const loggedIn = localStorage.getItem("loggedInUser");
  if (loggedIn && loggedIn !== undefined) {
    window.location.href = "index.html";
  }
}
