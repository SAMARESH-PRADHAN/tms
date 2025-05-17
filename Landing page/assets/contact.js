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

const inputs = document.querySelectorAll(".input");

function focusFunc() {
  let parent = this.parentNode;
  parent.classList.add("focus");
}

function blurFunc() {
  let parent = this.parentNode;
  if (this.value == "") {
    parent.classList.remove("focus");
  }
}

inputs.forEach((input) => {
  input.addEventListener("focus", focusFunc);
  input.addEventListener("blur", blurFunc);
});

$(document).ready(function () {
  $(".contact-form form").on("submit", function (e) {
    e.preventDefault(); // Prevent default form submission

    let contactData = {
      name: $("input[name='name']").val(),
      email: $("input[name='email']").val(),
      phone: $("input[name='phone']").val(),
      message: $("textarea[name='message']").val(),
    };

    $.ajax({
      url: "http://127.0.0.1:5000/contact", // API endpoint
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(contactData),
      success: function (response) {
        alert(response.message); // Show success message
        $(".contact-form form")[0].reset(); // Clear form fields
      },
      error: function (xhr) {
        let response = JSON.parse(xhr.responseText);
        alert("Error: " + response.message);
      },
    });
  });
});
