const wrapper = document.querySelector(".wrapper");
const loginLink = document.querySelector(".login-link");
const registerLink = document.querySelector(".register-link");
const btnPopup = document.querySelector(".btnLogin-popup");
const iconClose = document.querySelector(".icon-close");

registerLink.addEventListener("click", () => {
  wrapper.classList.add("active");
});

loginLink.addEventListener("click", () => {
  wrapper.classList.remove("active");
});

btnPopup.addEventListener("click", () => {
  wrapper.classList.add("active-popup");
});

iconClose.addEventListener("click", () => {
  wrapper.classList.remove("active-popup");
});

document.addEventListener('DOMContentLoaded', function() {
  var action = localStorage.getItem('action');

  console.log(action);

  if (action === 'register') {
      var registerLink = document.querySelector('.register-link');
      if (registerLink) {
          const wrapper = document.querySelector(".wrapper");
          wrapper.classList.add('active');
      }
  }

  localStorage.removeItem('action');
});
