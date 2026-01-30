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

// const submitbtn = document.querySelector(".btn");
// let mail_input = document.getElementById("in-mail");
// let password_input = document.getElementById("pw");

// submitbtn.addEventListener("click", (e) => {
//   e.preventDefault();

//   if (validmail() && validpassword()) {
//     alert("succssfully submit");
//   }
// });

// function validmail() {
//   let mail = mail_input.value;

//   if (mail.length == 0) {
//     alert("Email is required");
//     return false;
//   }
//   if (!mail.match(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/)) {
//     alert("Please enter valid email");
//     return false;
//   }
//   return true;
// }

// function validpassword() {
//   let password = password_input.value;
//   console.log(password);
//   if (password.length == 0) {
//     alert("Passwod is required");
//     return false;
//   }
//   if (
//     !password.match(
//       /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,30}$/
//     )
//   ) {
//     alert(
//       "Password should contain 1 Uppercase, 1 Lowercase, 1 Digit & 1 Alphabet"
//     );
//     return false;
//   }
//   return true;
// }

$(document).ready(function () {
  console.log(typeof swal);

  // Load header and footer
  $("#header").load("header.html");
  $("#footer").load("footer.html");
  $("#header").css("background", "none");

  $(document).ready(function () {
    $(".btn").click(function (event) {
      event.preventDefault(); // Prevent the form from reloading the page

      let email = $("#in-mail").val().trim();
      let password = $("#pw").val().trim();

      if (email === "" || password === "") {
        swal("Error!", "Please enter both email and password.", "warning");
        return;
      }

      $.ajax({
        url: "http://127.0.0.1:5000/login", // Adjust based on your Flask server URL
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          email: email,
          password: password,
        }),
        success: function (response) {
          console.log("API Response:", response); // Debugging

          swal({
            title: "Success!",
            text: response.message,
            icon: "success",
            timer: 3000, // Show for 3 seconds
            buttons: false,
          }).then(() => {
            // Redirect AFTER swal() closes
            if (response.message === "Login Successful") {
              localStorage.setItem(
                "user_details",
                JSON.stringify(response.user_details)
              );
              window.location.href = "../HomePage/index.html";
            }
          });
        },
        error: function (xhr) {
          if (xhr.status === 403) {
            swal(
              "Error!",
              "Your account is deactivated. Contact support.",
              "error"
            );
          } else if (xhr.status === 401) {
            swal("Error!", "Invalid email or password.", "error");
          } else {
            swal(
              "Error!",
              "An unexpected error occurred. Please try again later.",
              "error"
            );
          }
        },
      });
    });
  });
});

// $(document).ready(function () {
//   const apiBaseUrl = "http://127.0.0.1:5000"; // Replace with your actual backend URL

//   // Check if user is already logged in
//   if (localStorage.getItem("user")) {
//     showProfileIcon();
//   }

//   // Handle Login
//   $(".btn").click(function (event) {
//     event.preventDefault();

//     let email = $("#in-mail").val();
//     let password = $("#pw").val();

//     $.ajax({
//       url: `${apiBaseUrl}/login`,
//       type: "POST",
//       contentType: "application/json",
//       data: JSON.stringify({ email: email, password: password }),
//       success: function (response) {
//         swal("Success!", "Login Successful", "success");

//         // Store user details in localStorage
//         localStorage.setItem("user", JSON.stringify(response.user_details));

//         // Hide login button and show profile icon
//         showProfileIcon();
//       },
//       error: function (xhr) {
//         swal("Error", "Invalid email or password", "error");
//       },
//     });
//   });

//   // Show Profile Icon in Header
//   function showProfileIcon() {
//     $(".btn").hide();
//     $("#header").append(`
//           <div id="profile">
//               <img src="./assets/profile.png" alt="Profile" id="profileIcon" />
//               <div id="logoutDropdown" class="dropdown-content">
//                   <button id="logoutBtn">Logout</button>
//               </div>
//           </div>
//       `);

//     $("#profileIcon").click(function () {
//       $("#logoutDropdown").toggle();
//     });

//     $("#logoutBtn").click(function () {
//       localStorage.removeItem("user");
//       location.reload();
//     });
//   }
// });
