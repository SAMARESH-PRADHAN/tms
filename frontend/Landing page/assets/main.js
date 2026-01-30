$(document).ready(function () {
  // Load header and check login status
  $("#header").load("header.html", function () {
    console.log("Header loaded");

    // Check if user is logged in
    if (localStorage.getItem("user_logged_in")) {
      $("#loginBtn").hide(); // Hide login button if logged in
      $("#logoutBtn").show(); // Show logout button
    }

    // Logout button event
    $("#logoutBtn").click(function () {
      localStorage.removeItem("user_logged_in"); // Remove login status
      window.location.href = "login.html"; // Refresh page to show login button again
    });
  });

  // Hide login button when clicked (before going to login page)
  $(document).on("click", "#loginBtn", function () {
    $(this).hide(); // Hide immediately
  });
});
