$(document).ready(function () {
  // Load header and footer
  $("#headerHome").load("nav.html");
  $("#footer").load("footer.html");
  $("#header").css("background", "none");
});

$(document).ready(function () {
  $("#fedback-submit").click(function (e) {
    e.preventDefault(); // Prevent default form submission

    let name = $("#name").val().trim();
    let email = $("#email").val().trim();
    let rating = $("#rating").val();
    let comments = $("#comments").val().trim();

    if (!name || !email || !rating || !comments) {
      swal(
        "Warning",
        "Please fill out all fields before submitting!",
        "warning"
      );
      return;
    }

    let feedbackData = {
      name: name,
      email: email,
      rating: rating,
      comments: comments,
    };


    const API_BASE = "https://tms-backend-kfut.onrender.com"; // Render backend URL

    $.ajax({
      url: `${API_BASE}/feedback`,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(feedbackData),
      success: function (response) {
        swal("Success", response.message, "success");
        $(".feedback-form")[0].reset(); // Reset form
      },
      error: function (xhr, status, error) {
        alert("Something went wrong! Please try again.");
      },
    });
  });
});
