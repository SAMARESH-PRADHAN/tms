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

$(document).ready(function () {
  // Open modal when clicking a service card
  $(".service-card").click(function (e) {
    e.preventDefault();

    let heading = $(this).find("h2").text();
    let info =
      {
        "Tour Packages":
          "India is a land of diverse cultures, breathtaking landscapes, and rich heritage. Whether you want to relax on serene beaches, explore majestic mountains, experience vibrant cities, or dive into ancient history, our tour packages offer the perfect travel experience across India!",
        Feedback:
          "We value your opinion! Share your feedback and help us improve our services to provide you with an even better travel experience. Please keep support us to provide more and more travel plans",
        MapView:
          "View locations on an interactive map and plan your trip effortlessly. Discover popular attractions, hotels, and must-visit places near you.",
        Destination:
          "Discover beautiful destinations and plan your perfect vacation. Get insights on travel spots, local attractions, and cultural experiences.",
      }[heading] ||
      "Our Map View feature in the Tour Management System allows travelers to explore destinations across India with a single click. Whether you're planning a trip to the majestic Himalayas, serene beaches of Goa, or the historical forts of Rajasthan, our interactive map provides a visual and informative guide to help you plan your journey effortlessly.";

    $("#modalHeading").text(heading);
    $("#modalInfo").text(info);

    // Add "show" class to trigger blooming animation
    $("#serviceModal").fadeIn(200).addClass("show");
  });

  // Close modal when clicking the close button
  $(".close, .close-btn").click(function () {
    $("#serviceModal").removeClass("show").fadeOut(300);
  });

  // Close modal when clicking outside of it
  $(window).click(function (event) {
    if ($(event.target).is("#serviceModal")) {
      $("#serviceModal").removeClass("show").fadeOut(300);
    }
  });
});
