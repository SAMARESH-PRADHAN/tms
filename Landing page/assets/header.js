// const navBar = document.querySelector(".nav");
const iconClose = document.querySelector(".icon");
let btnLogin = document.querySelector(".btnLogin-popup");

// iconClose.addEventListener('click', () => {
//   box.classList.remove('btnLogin');
// });

const anchor = document.createElement("a");

// Set attributes for the anchor
anchor.href = "login.html";
// anchor.textContent = 'Login';
anchor.target = "_blank"; // Open link in a new tab
anchor.classList.add("anchor-link"); // Add a class for styling

// Add the anchor to the DOM
btnLogin.appendChild(anchor);

// var loginBtn = document.getElementById("loginBtn");
// loginBtn.addEventListener("click", (e) => {
//   e.preventDefault();
//   loginBtn.classList.add("loginHidden");
//   window.location.href = "login.html";
// });
// $(document).ready(function () {
//     const navContainer = $(".navigation");

//     // Check if user is logged in
//     let isLoggedIn = localStorage.getItem("isLoggedIn");

//     if (isLoggedIn) {
//         showProfileIcon();
//     } else {
//         showLoginButton();
//     }

//     // Show Profile Icon after Login
//     function showProfileIcon() {
//         navContainer.html(`
//             <div class="profile-container">
//                 <img src="./assets/profile-icon.png" id="profileIcon" class="profile-icon" alt="Profile">
//                 <div class="dropdown-menu hidden">
//                     <button id="logoutBtn">Logout</button>
//                 </div>
//             </div>
//         `);

//         // Add event listeners for dropdown and logout
//         $("#profileIcon").on("click", function () {
//             $(".dropdown-menu").toggleClass("hidden");
//         });

//         $("#logoutBtn").on("click", function () {
//             localStorage.removeItem("isLoggedIn"); // Clear session
//             window.location.href = "home.html"; // Redirect to home
//         });
//     }

//     // Show Login Button when not logged in
//     function showLoginButton() {
//         navContainer.append(`<button class="btnLogin-popup">Login</button>`);
//         $(".btnLogin-popup").on("click", function () {
//             window.location.href = "login.html";
//         });
//     }
// });
