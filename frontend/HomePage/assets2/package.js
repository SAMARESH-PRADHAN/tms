$(document).ready(function () {
  // Load header and footer
  $("#headerHome").load("nav.html");
  $("#footer").load("footer.html");
  $("#header").css("background", "none");
});

$(document).ready(function () {
  // Fetch packages from the API
  $.ajax({
    url: "http://127.0.0.1:5000/packages",
    method: "GET",
    dataType: "json",
    success: function (data) {
      const packageContainer = $(".box-container");
      const paginationContainer = $("#pagination");
      const destinationFilter = $("#destinationFilter");
      const priceFilter = $("#priceFilter");

      const itemsPerPage = 8;
      let currentPage = 1;
      let filteredData = data;
      const totalPages = Math.ceil(data.length / itemsPerPage);

      // Extract unique destination names
      const destinations = [
        ...new Set(data.map((pkg) => pkg.destination_name)),
      ];
      destinations.forEach((dest) => {
        destinationFilter.append(`<option value="${dest}">${dest}</option>`);
      });

      function applyFilters() {
        const selectedDestination = destinationFilter.val();
        const selectedPrice = priceFilter.val();

        filteredData = data.filter((pkg) => {
          const matchesDestination = selectedDestination
            ? pkg.destination_name === selectedDestination
            : true;
          const matchesPrice = selectedPrice
            ? (() => {
                const [min, max] = selectedPrice.split("-").map(Number);
                return pkg.price >= min && pkg.price <= max;
              })()
            : true;

          return matchesDestination && matchesPrice;
        });

        currentPage = 1;
        renderPackages(currentPage);
        renderPagination();
      }

      function renderPackages(page) {
        packageContainer.empty();
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedData = filteredData.slice(start, end);

        paginatedData.forEach((pkg) => {
          const imagePath = pkg.image
            ? pkg.image
            : "../image/default-image.jpg";
          const availabilityText = pkg.availability_status
            ? "Available"
            : "Not Available";
          const availabilityClass = pkg.availability_status
            ? "available"
            : "not-available";

          const packageHTML = `
              <div class="box">
                <img src="${imagePath}" alt="" />
                <div class="content">
                  <div class="package-top">
                    <h3><i class="fas fa-map-marker-alt"></i> ${
                      pkg.package_name
                    }</h3>
                    <p class="description" data-full="${pkg.description}">
                      ${pkg.description.split(" ").slice(0, 20).join(" ")}...
                      <span class="read-more-btn">Read More</span>
                    </p>
                    <div class="stars"><p>Duration: ${pkg.duration} days</p>
                    <p>Destination Name : ${pkg.destination_name}</p></div>
                  </div>
                  <div class="package-bottom">
                    <div class="price">₹${pkg.price} <span>₹${
            pkg.price * 2
          }</span></div>
                    <div id="bll">
                      <button class="availability-btn ${availabilityClass}" data-available="${
            pkg.availability_status
          }">
                        ${availabilityText}
                      </button>
                      <button class="book-now-btn" data-id="${
                        pkg.package_id
                      }">Book Now</button>
                    </div>
                  </div>
                </div>
              </div>
            `;
          packageContainer.append(packageHTML);
        });

        attachButtonHandlers();
      }

      function renderPagination() {
        paginationContainer.empty();
        for (let i = 1; i <= totalPages; i++) {
          const pageButton = $(`<button class="pagination-btn">${i}</button>`);
          if (i === currentPage) {
            pageButton.addClass("active");
          }
          pageButton.on("click", function () {
            currentPage = i;
            renderPackages(currentPage);
            renderPagination();
          });
          paginationContainer.append(pageButton);
        }
      }

      function attachButtonHandlers() {
        $(".book-now-btn").on("click", function () {
          let packageId = $(this).data("id");
          window.location.href = `booking.html?package_id=${packageId}`;
        });
      }

      $("#applyFiltersBtn").on("click", applyFilters);

      renderPackages(currentPage);
      renderPagination();
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
    const shortText = fullText.split(" ").slice(0, 20).join(" ");
    parent.html(
      `${shortText}... <span class="read-more-btn" style="color:#f04e30; cursor:pointer;">Read More</span>`
    );
  }
});
