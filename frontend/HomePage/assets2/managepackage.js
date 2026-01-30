$(document).ready(function () {
  // Load header and footer
  $("#headerHome").load("nav.html");
  $("#footer").load("footer.html");
  $("#header").css("background", "none");
});

$(document).ready(function () {
  const apiBaseUrl = "http://127.0.0.1:5000/packages"; // API Endpoint
  const uploadBaseUrl = "http://127.0.0.1:5000/uploads"; //Image Folder

  function loadDestinations() {
    $.ajax({
      url: "http://127.0.0.1:5000/destinationsP", // Fetch destinations
      type: "GET",
      success: function (data) {
        let options = '<option value="">Select Destination</option>';
        data.forEach((dest) => {
          options += `<option value="${dest.destination_id}">${dest.d_name}</option>`;
        });
        $("#destinationName, #editDestinationName").html(options);
      },
      error: function () {
        console.error("Failed to load destinations.");
      },
    });
  }
  loadDestinations(); // Load destinations when the page loads

  // Function to fetch packages and display them
  function loadPackages() {
    // $.get(apiBaseUrl, function (data) {
    //   $("#packageTable").empty();
    //   data.forEach((pkg) => {
    //     $("").append(;
    //   });
    // });
    $.ajax({
      url: apiBaseUrl,
      type: "GET",
      dataType: "json",
      success: function (data) {
        let rows = "";
        data.forEach((pkg) => {
          let imagePath = pkg.image ? pkg.image : "../image/default-image.jpg"; // Use correct path

          rows += `
           <tr data-id="${pkg.package_id}">
             <td>${pkg.package_id}</td>
             <td>${pkg.package_name}</td>
             <td>${pkg.description}</td>
             <td>${pkg.price}</td>
             <td>${pkg.duration} days</td>
             <td>${pkg.availability_status}</td>
             <td>${pkg.destination_name}</td> 
             <td><img src="${imagePath}" alt="package Image" width="100"></td>
             <td>
               <button class="btn-edit">Edit</button>
               <button class="btn-delete">Delete</button>
             </td>
           </tr>
         `;
        });
        $("#packageTable").html(rows);
      },
      error: function () {
        alert("Error loading packages: " + xhr.responseText);
      },
    });
  }

  loadPackages(); // Load packages initially

  // Handle form submission (Add Package)
  $("#packageSubmit").click(function (e) {
    e.preventDefault();

    let formData = new FormData();
    formData.append("package_name", $("#packageName").val());
    formData.append("description", $("#description").val());
    formData.append("price", $("#price").val());
    formData.append("duration", $("#duration").val());
    formData.append("availability_status", $("#availability").val());
    formData.append("destination_id", $("#destinationName").val()); // Store destination_id

    // Check if an image is selected before appending
    let imageFile = $("#packageImage")[0].files[0];
    if (imageFile) {
      formData.append("image", imageFile);
    }
    // let newPackage = {
    //   package_name: $("#packageName").val(),
    //   description: $("#description").val(),
    //   price: $("#price").val(),
    //   duration: $("#duration").val(),
    //   availability_status: $("#availability").val(),
    // };
    // console.log(newPackage);

    $.ajax({
      url: apiBaseUrl,
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      // contentType: "application/json",
      // data: JSON.stringify(newPackage),
      success: function () {
        alert("Package added successfully!");
        $("#packageForm")[0].reset();
        loadPackages();
      },
      error: function (xhr) {
        console.error("Error:", xhr.responseText);
        alert("Error adding package! " + (xhr.responseJSON?.error || ""));
      },
    });
  });

  // Handle Delete Package
  $(document).on("click", ".btn-delete", function () {
    let package_id = $(this).closest("tr").data("id");
    if (confirm("Are you sure you want to delete this package?")) {
      $.ajax({
        url: `${apiBaseUrl}/${package_id}`,
        type: "DELETE",
        success: function () {
          alert("User deleted successfully!");
          loadPackages();
        },
        error: function (xhr) {
          alert("Error deleting user!" + xhr.responseText);
        },
      });
    }
  });

  // Open Edit Modal & Fill Data
  $(document).on("click", ".btn-edit", function () {
    let row = $(this).closest("tr");
    let package_id = row.find("td:eq(0)").text().trim();
    let package_name = row.find("td:eq(1)").text().trim();
    let description = row.find("td:eq(2)").text().trim();
    let price = row.find("td:eq(3)").text().replace("RS:", "").trim();
    let duration = row.find("td:eq(4)").text().replace("days", "").trim();
    let availability_status = row.find("td:eq(5)").text().trim();
    let destination_name = row.find("td:eq(6)").text().trim();

    // Fix Image Selector
    let imageSrc = row.find("td:eq(7) img").attr("src");
    if (!imageSrc || imageSrc.includes("null")) {
      imageSrc = "../image/default-image.jpg"; // Default fallback image
    }

    $("#editPackage_id").val(package_id);
    $("#editPackage_name").val(package_name);
    $("#editPrice").val(price);
    $("#editDuration").val(duration);
    $("#editDescription").val(description);
    $("#Availability").val(availability_status);
    $("#editDestinationName").val(destination_name);

    // Set Current Image
    $("#currentPackageImage").attr("src", imageSrc);

    $("#editPackageModal").show();
  });

  // Update Package
  $("#editPackageForm").submit(function (e) {
    e.preventDefault();
    let package_id = $("#editPackage_id").val().trim(); // Ensure no empty spaces
    if (!package_id) {
      alert("Invalid package ID!");
      return;
    }
    let formData = new FormData();
    formData.append("package_name", $("#editPackage_name").val());
    formData.append("description", $("#editDescription").val());
    formData.append("price", $("#editPrice").val());
    formData.append("duration", $("#editDuration").val());
    formData.append("availability_status", $("#Availability").val());
    formData.append("destination_id", $("#editDestinationName").val()); // Store destination_id

    let imageFile = $("#editPackageImage")[0].files[0];
    if (imageFile) {
      formData.append("image", imageFile);
    }

    $.ajax({
      url: `http://127.0.0.1:5000/packages/${package_id}`,
      type: "PUT",
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        alert("Package updated successfully!");
        $("#editPackageModal").hide();
        if (response.image) {
          $("#currentPackageImage").attr(
            "src",
            `http://127.0.0.1:5000/static/uploads/${response.image}`
          );
        }

        // $("#editPackageModal").hide();
        loadPackages();
      },
      error: function (xhr) {
        console.error("Update Error:", xhr.responseText);
        alert("Error updating package! " + xhr.responseText);
      },
    });
  });

  // ✅ Close modal when clicking the close button
  $(".close").click(function () {
    $("#editPackageModal").hide();
  });

  // ✅ Close modal when clicking outside the modal
  $(window).click(function (event) {
    if ($(event.target).is("#editPackageModal")) {
      $("#editPackageModal").hide();
    }
  });
});
