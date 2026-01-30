$(document).ready(function () {
  // Load header and footer
  $("#headerHome").load("nav.html");
  $("#footer").load("footer.html");
  $("#header").css("background", "none");
});

$(document).ready(function () {
  let imageSlider = $("#img-slider");
  let imgButtons = $(".img-btn");

  imgButtons.on("click", function () {
    let newImage = $(this).data("src");
    imageSlider.attr("src", newImage);

    // Remove active class from all buttons
    imgButtons.removeClass("active");
    // Add active class to the clicked button
    $(this).addClass("active");
  });
});

$(document).ready(function () {
  // Fetch packages from the API
  $.ajax({
    url: "http://127.0.0.1:5000/packages",
    method: "GET",
    dataType: "json",
    success: function (data) {
      let packageContainer = $(".box-container");
      packageContainer.empty(); // Clear existing content

      // Limit to only the first 4 packages
      data.slice(0, 4).forEach((pkg) => {
        let imagePath = pkg.image ? pkg.image : "../image/default-image.jpg"; // Use correct path

        let availabilityText = pkg.availability_status
          ? "Available"
          : "Not Available";
        let availabilityClass = pkg.availability_status
          ? "available"
          : "not-available";

        let packageHTML = `
          <div class="box">
            <img src="${imagePath}" alt="" />
            <div class="content">
                  <div class="package-top">

              <h3><i class="fas fa-map-marker-alt"></i> ${pkg.package_name}</h3>
              <p class="description" data-full="${pkg.description}">
  ${pkg.description.split(" ").slice(0, 10).join(" ")}...
  <span class="read-more-btn" style="color:#f04e30; cursor:pointer;">Read More</span>
</p>

              <div class="stars">
                <p>Duration: ${pkg.duration} days</p>
              </div>
              </div>
             <div class="package-bottom">
              <div class="price">₹${pkg.price} <span>₹${
          pkg.price * 2
        }</span></div>
              <button class="availability-btn ${availabilityClass}" data-available="${
          pkg.availability_status
        }">
                ${availabilityText}
              </button>
             <button class="book-now-btn" data-id="${pkg.package_id}">
                  Book Now
                </button>
                 </div>
            </div>
          </div>
        `;

        packageContainer.append(packageHTML);
      });
      $(".book-now-btn").on("click", function () {
        let packageId = $(this).data("id");

        // Redirect to booking.html with packageId as a URL parameter
        window.location.href = `booking.html?package_id=${packageId}`;
      });
    },
    error: function (xhr, status, error) {
      console.error("Error fetching packages:", error);
    },
  });
});

$(document).on("click", ".read-more-btn", function () {
  const parent = $(this).closest(".description");
  const fullText = parent.data("full");

  if ($(this).text() === "Read More") {
    parent.html(
      `${fullText} <span class="read-more-btn" style="color:#f04e30; cursor:pointer;">Show Less</span>`
    );
  } else {
    const shortText = fullText.split(" ").slice(0, 10).join(" ");
    parent.html(
      `${shortText}... <span class="read-more-btn" style="color:#f04e30; cursor:pointer;">Read More</span>`
    );
  }
});

$(document).ready(function () {
  let currentIndex = 0;
  const imageButtons = $(".img-btn");
  const imgSlider = $("#img-slider");
  let autoSlide;

  function changeImage(index) {
    const newSrc = imageButtons.eq(index).data("src");
    imgSlider.stop(true, true).fadeOut(500, function () {
      imgSlider.attr("src", newSrc).fadeIn(500);
    });
    imageButtons.removeClass("active");
    imageButtons.eq(index).addClass("active");
  }

  function startSlider() {
    autoSlide = setInterval(function () {
      currentIndex = (currentIndex + 1) % imageButtons.length;
      changeImage(currentIndex);
    }, 4000); // 4 seconds
  }

  function stopSlider() {
    clearInterval(autoSlide);
  }

  // Start slider on load
  startSlider();

  // Pause on hover
  $(".home").hover(
    function () {
      stopSlider();
    },
    function () {
      startSlider();
    }
  );

  // Manual click control
  imageButtons.click(function () {
    currentIndex = $(this).index();
    changeImage(currentIndex);
  });
});
