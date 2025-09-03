const usernameInp = document.getElementById("username");
const passwordInp = document.getElementById("password");
const emailInp = document.getElementById("email");

function handleRegister(e) {
  e.preventDefault();

  if (!validateInputs()) {
    return;
  }

  checkDetails(usernameInp.value, passwordInp.value, emailInp.value);
}

function validateInputs() {
  const allMsgs = document.querySelectorAll(".validation-msg");
  allMsgs.forEach((msg) => msg.remove());

  if (!usernameInp.value || !passwordInp.value || !emailInp.value) {
    if (!usernameInp.value) {
      showMessage("Please enter username.", "error", "username");
    }

    if (!passwordInp.value) {
      showMessage("Please enter password.", "error", "password");
    }

    if (!emailInp.value) {
      showMessage("Please enter  email", "error", "email");
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

function checkDetails(username, password, email) {
  // CHECK USERNAME AND EMAIL

  // CATCH USERS FROM LOCALSTORAGE
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  console.log(users);
  usernameAlreadyExist = users.find((user) => user.username === username);
  emailAlreadyExist = users.find((user) => user.email === email);

  // CHECK USERNAME AND GIVE MESG
  if (usernameAlreadyExist) {
    showMessage("Username already exist", "error", "username");
    return;
  }

  // CHCEK EMAIL AND GIVE MESG
  if (emailAlreadyExist) {
    showMessage("Email already exist", "error", "email");
    return;
  }

  // CHECK PASW AND GIVE MESG
  if (!checkPassword(password)) {
    showMessage(
      "sifre 6dan cox simvol, bir kicik, bir boyuk herf ehate etmelidir ",
      "error",
      "password"
    );
    return;
  }
}
// CHECK PASSWORD
function checkPassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return regex.test(password);
}
