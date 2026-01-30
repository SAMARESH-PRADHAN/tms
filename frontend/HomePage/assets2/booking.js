$(document).ready(function () {
  // Load header and footer
  $("#headerHome").load("nav.html");
  $("#footer").load("footer.html");
  $("#header").css("background", "none");

  // Ensure user is logged in
  let userDetails = localStorage.getItem("user_details");
  if (!userDetails) {
    swal("Error", "You must be logged in to book a package!", "error");
    setTimeout(() => (window.location.href = "login.html"), 2000);
    return;
  }

  let currentUser = JSON.parse(userDetails).user_id;
  if (!currentUser) {
    swal("Error", "You must be logged in to book a package!", "error");
    setTimeout(() => (window.location.href = "login.html"), 2000);
    return;
  }

  // Auto-fill booking date with today's date
  $("#booking_date").val(new Date().toISOString().split("T")[0]);

  // Get package ID from URL
  function getQueryParam(param) {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  let packageId = getQueryParam("package_id");

  if (!packageId) {
    swal("Error", "Invalid package selection!", "error");
    setTimeout(() => (window.location.href = "index.html"), 2000);
    return;
  }
const API_BASE = "https://tms-backend-kfut.onrender.com"; // Render backend URL

  // Fetch package details based on package ID
  $.ajax({
    url: `${API_BASE}/packagesss/${packageId}`, // Ensure this route matches the backend
    type: "GET",
    success: function (response) {
      if (response.success) {
        // swal("Success", response.message, "success");
        $("#package_name").val(response.package_name); // Auto-fill package name
        $("#price_per_person").val(response.price); // Auto-fill price per person
        $("#num_people").val(0); // Default to 1 person
        $("#num_people").trigger("input"); // Trigger price calculation
      } else {
        swal("Error", "data not fetching", "error");
      }
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error:", xhr.responseText);
      swal(
        "Error",
        "Failed to fetch package details! " + xhr.responseText,
        "error"
      );
    },
  });

  // Auto-calculate total price when number of people changes
  $("#num_people").on("input", function () {
    let numPeople = parseInt($(this).val());
    let pricePerPerson = parseFloat($("#price_per_person").val());

    if (!pricePerPerson || numPeople < 1) {
      $("#total_price").val(0);
      return;
    }

    let totalPrice = numPeople * pricePerPerson;
    $("#total_price").val(totalPrice.toFixed(2));
  });

  // Submit booking form
  $("#bookingForm").submit(function (event) {
    event.preventDefault();

    let travelDate = $("#travel_date").val();
    let numPeople = $("#num_people").val();
    let totalPrice = $("#total_price").val();

    if (!packageId || !travelDate || numPeople < 1 || totalPrice <= 0) {
      swal("Warning", "Please fill all required fields correctly!", "warning");
      return;
    }

    let bookingData = {
      package_id: packageId,
      travel_date: travelDate,
      num_people: numPeople,
      total_price: totalPrice,
      user_id: currentUser,
    };
    console.log(bookingData);
const API_BASE = "https://tms-backend-kfut.onrender.com"; // Render backend URL

    $.ajax({
      url: `${API_BASE}/book`,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(bookingData),
      success: function (response) {
        if (response.success) {
          swal("Success", "Your booking has been confirmed!", "success");
          setTimeout(() => (window.location.href = "index.html"), 2000);
        } else {
          swal("Error", response.message, "error");
        }
      },
      error: function () {
        swal("Error", "Could not complete booking", "error");
      },
    });
  });
});
