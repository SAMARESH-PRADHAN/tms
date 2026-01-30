document.getElementById("mToggle").addEventListener("click", function () {
  let navLinks = document.getElementById("nLink");

  // Toggle the 'active' class to show/hide the menu
  navLinks.classList.toggle("active");
});

$(document).ready(function () {
  const user_details = JSON.parse(localStorage.getItem("user_details"));
  const roleId = user_details?.role_id;
  if (roleId === 1) {
    $("#adminBtn").show();
  } else {
    $("#adminBtn").hide();
  }

  $("#loginBtn").click(function () {
    localStorage.clear();
    window.location.href = "../Landing page/home.html";
  });
});
$(document).ready(function () {
  $("#mToggle").on("click", function () {
    $("#nLink").toggleClass("active");
  });
});
