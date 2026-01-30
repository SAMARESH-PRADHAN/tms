$(document).ready(function () {
  // Load header and footer
  $("#headerHome").load("nav.html");
  $("#footer").load("footer.html");
  $("#header").css("background", "none");
});

$(document).ready(function () {
  fetchDestinations();

  // Fetch all destinations
  function fetchDestinations() {
    const API_BASE = "https://tms-backend-kfut.onrender.com"; // Render backend URL
    $.ajax({
      url: `${API_BASE}/destinations`,
      type: "GET",
      dataType: "json",
      success: function (data) {
        let tableBody = $("tbody");
        tableBody.empty();
        data.forEach((dest) => {
          let statusText = dest.is_active ? "Deactivate" : "Activate";
          let buttonClass = dest.is_active ? "active-btn" : "inactive-btn";
          let row = `<tr data-id="${dest.destination_id}">
                      <td>${dest.destination_id}</td>
                      <td>${dest.destination_name}</td>
                      <td>${dest.longitude}</td>
                      <td>${dest.latitude}</td>
                      <td>
                          <button class="edit-btn">Edit</button>
                          <button class="toggle-status-btn ${buttonClass}" data-status="${dest.is_active}">${statusText}</button>
                      </td>
                  </tr>`;
          tableBody.append(row);
        });
      },
      error: function (err) {
        console.error("Error fetching destinations:", err);
      },
    });
  }

  // Add Destination
  $("#destinationForm").submit(function (e) {
    e.preventDefault();
    let destination_name = $("#destinationName").val();
    let longitude = parseFloat($("#Longitude").val());
    let latitude = parseFloat($("#Latitude").val());

    const API_BASE = "https://tms-backend-kfut.onrender.com"; // Render backend URL
    $.ajax({
      url: `${API_BASE}/destinations`,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        destination_name: destination_name,
        longitude: longitude,
        latitude: latitude,
        is_active: true,
      }),
      success: function (response) {
        alert(response.message);
        $("#destinationForm")[0].reset();
        fetchDestinations();
      },
      error: function (err) {
        console.error("Error adding destination:", err);
      },
    });
  });

  // Edit button click
  $(document).on("click", ".edit-btn", function () {
    let row = $(this).closest("tr");
    let destination_id = row.data("id");
    let destination_name = row.find("td:eq(1)").text();
    let longitude = row.find("td:eq(2)").text();
    let latitude = row.find("td:eq(3)").text();

    let newName = prompt("Enter new name:", destination_name);
    let newLongitude = prompt("Enter new longitude:", longitude);
    let newLatitude = prompt("Enter new latitude:", latitude);

    if (newName && newLongitude && newLatitude) {
      const API_BASE = "https://tms-backend-kfut.onrender.com"; // Render backend URL
      $.ajax({
        url: `${API_BASE}/destinations/${destination_id}`,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify({
          destination_name: newName,
          longitude: newLongitude,
          latitude: newLatitude,
        }),
        success: function (response) {
          alert(response.message);
          fetchDestinations();
        },
        error: function (err) {
          console.error("Error updating destination:", err);
        },
      });
    }
  });

  // Toggle Active/Deactivate button click
  $(document).on("click", ".toggle-status-btn", function () {
    let row = $(this).closest("tr");
    let destination_id = row.data("id");
    let isActive = $(this).data("status") === true;
    let newStatus = !isActive;
    let button = $(this);

    const API_BASE = "https://tms-backend-kfut.onrender.com"; // Render backend URL

    $.ajax({
      url: `${API_BASE}/destinations/${destination_id}/toggle`,
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify({ is_active: newStatus }),
      success: function (response) {
        alert(response.message);
        button.text(newStatus ? "Deactivate" : "Activate");
        button.data("status", newStatus);
        button
          .removeClass("active-btn inactive-btn")
          .addClass(newStatus ? "active-btn" : "inactive-btn");
      },
      error: function (err) {
        console.error("Error toggling destination status:", err);
      },
    });
  });
});

// Add styles
$("<style>")
  .prop("type", "text/css")
  .html(
    `
  .active-btn {
      background-color: green;
      color: white;
      border: none;
      padding: 5px 10px;
      cursor: pointer;
  }
  .inactive-btn {
      background-color: red;
      color: white;
      border: none;
      padding: 5px 10px;
      cursor: pointer;
  }
`,
  )
  .appendTo("head");
