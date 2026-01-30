// $(document).ready(function () {
//   // Load the header dynamically
//   $("#header").load("./header.html", function (response, status, xhr) {
//     if (status === "error") {
//       console.error(
//         "Error loading header: " + xhr.status + " " + xhr.statusText
//       );
//     }
//   });
//   // Load the footer dynamically
//   $("#footer").load("./footer.html", function (response, status, xhr) {
//     if (status === "error") {
//       console.error(
//         "Error loading header: " + xhr.status + " " + xhr.statusText
//       );
//     }
//   });
// });

$(document).ready(function () {
  // Load header and footer
  $("#header").load("header.html");
  $("#footer").load("footer.html");
  $("#header").css("background", "none");

  // Form submission and validation
  $("form").submit(function (event) {
    event.preventDefault(); // Prevent default form submission

    var user_name = $("#user_name").val();
    var user_email = $("#user_email").val();
    var user_mobile_no = $("#user_mobile_no").val();
    var user_password = $("#user_password").val();
    var confirmPassword = $("#confirmPassword").val();
    var user_address = $("#user_address").val();

    // Validation for username and password
    if (user_name === "") {
      swal("Error", "Please enter your name.", "error");
      return false;
    } else if (user_mobile_no === "") {
      swal("Error", "Please enter your mobile no.", "error");
      return false;
    } else if (user_email === "") {
      swal("Error", "Please enter your email.", "error");
      return false;
    } else if (user_password === "") {
      swal("Error", "Please enter your password.", "error");
      return false;
    } else if (confirmPassword === "") {
      swal("Error", "Please confirm your password.", "error");
      return false;
    } else if (user_address === "") {
      swal("Error", "Please enter your Address", "error");
      return false;
    } else {
      var user_nameRegex = /^[a-zA-Z0-9_]+$/;
      if (!user_name.match(user_nameRegex)) {
        swal(
          "Error",
          "Username can only contain letters, numbers, and underscores.",
          "error"
        );
        return false;
      }

      // Validation for username length
      if (user_name.length < 3 || user_name.length > 10) {
        swal(
          "Error",
          "Username must be between 3 and 10 characters long.",
          "error"
        );
        return false;
      }

      var mobileRegex = /^[0-9]{10}$/;
      if (!user_mobile_no.match(mobileRegex)) {
        swal(
          "Error",
          "Invalid mobile number. Please enter a 10-digit number.",
          "error"
        );
        return false;
      }

      var user_emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
      if (!user_email.match(user_emailRegex)) {
        swal("Error", "Enter Valid Email.", "error");
        return false;
      }

      // Validation for password
      var user_passwordRegex =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&])[a-zA-Z\d!@#$%^&]{6,}$/;
      if (!user_password.match(user_passwordRegex)) {
        swal(
          "Error",
          "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
          "error"
        );
        return false;
      }

      // Validation for password confirmation
      if (user_password !== confirmPassword) {
        swal("Error", "Passwords do not match.", "error");
        return false;
      }
    }

    submitForm();
  });

  function submitForm() {
    var user_name = $("#user_name").val();
    console.log(user_name);
    var email = $("#user_email").val();
    var password = $("#user_password").val();
    var mobile = $("#user_mobile_no").val();
    var address = $("#user_address").val();

    var data = {
      user_name: user_name,
      email: email,
      password: password,
      mobile: mobile,
      address: address,
    };
const API_BASE = "https://tms-backend.onrender.com"; // Render backend URL

    // AJAX request
    $.ajax({
      type: "POST",
      url: `${API_BASE}/registration`,
      contentType: "application/json",
      data: JSON.stringify(data),
      success: function (response) {
        swal("Success", "Registration successful!", "success").then(() => {
          window.location.href = "login.html";
        });
      },
      error: function (xhr, status, error) {
        console.error("Error:", error);
        swal("Error", "An error occurred. Please try again later.", "error");
      },
    });
  }
});
