$(document).ready(function () {
  // Load the header dynamically
  $("#header").load("./header.html", function (response, status, xhr) {
    if (status === "error") {
      console.error(
        "Error loading header: " + xhr.status + " " + xhr.statusText
      );
    }
  });
  // Load the footer dynamically
  $("#footer").load("./footer.html", function (response, status, xhr) {
    if (status === "error") {
      console.error(
        "Error loading header: " + xhr.status + " " + xhr.statusText
      );
    }
  });
});

let userEmail = "";

// 📌 1️⃣ Request OTP
function requestOTP() {
  userEmail = $("#email").val().trim();

  if (userEmail === "") {
    swal("Error!", "Please enter your email.", "error");
    return;
  }
  const API_BASE = "https://tms-backend-kfut.onrender.com"; // Render backend URL

  $.ajax({
    url: `${API_BASE}/forgot-password`,
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({ email: userEmail }),
    success: function (response) {
      swal("Success!", response.message, "success");
      $("#step1").hide();
      $("#step2").show();
    },
    error: function (xhr) {
      swal("Error!", xhr.responseJSON.message, "error");
    },
  });
}

// 📌 2️⃣ Verify OTP
function verifyOTP() {
  let otp = $("#otp").val().trim();

  if (otp === "") {
    swal("Error!", "Please enter the OTP.", "error");
    return;
  }

  $.ajax({
    url: `${API_BASE}verify-otp`,
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({ email: userEmail, otp: otp }),
    success: function (response) {
      swal("Success!", response.message, "success");
      $("#step2").hide();
      $("#step3").show();
    },
    error: function (xhr) {
      swal("Error!", xhr.responseJSON.message, "error");
    },
  });
}

// 📌 3️⃣ Reset Password
function resetPassword() {
  let newPassword = $("#newPassword").val().trim();

  if (newPassword === "") {
    swal("Error!", "Please enter a new password.", "error");
    return;
  }

  $.ajax({
    url: `${API_BASE}/reset-password`,
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({ email: userEmail, new_password: newPassword }),
    success: function (response) {
      swal("Success!", response.message, "success").then(() => {
        window.location.href = "login.html";
      });
    },
    error: function (xhr) {
      swal("Error!", xhr.responseJSON.message, "error");
    },
  });
}
