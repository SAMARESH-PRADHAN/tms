$(document).ready(function () {
  // Load header and footer
  $("#headerHome").load("nav.html");
  $("#footer").load("footer.html");
  $("#header").css("background", "none");
});

// $(document).ready(function () {
//   const apiUrl = "http://127.0.0.1:5000/users";

//   // 🟢 Fetch & Display Users
//   function loadUsers() {
//     $.ajax({
//       url: apiUrl,
//       type: "GET",
//       dataType: "json",
//       success: function (users) {
//         let rows = "";
//         users.forEach((user) => {
//           rows += `
//                       <tr data-id="${user.user_id}">
//                           <td>${user.user_id}</td>
//                           <td>${user.user_name}</td>
//                           <td>${user.email}</td>
//                           <td>
//                               <button class="btn edit-btn">Edit</button>
//                               <button class="btn delete-btn">Delete</button>
//                           </td>
//                       </tr>
//                   `;
//         });
//         $("#userTable tbody").html(rows);
//       },
//       error: function () {
//         alert("Failed to load users");
//       },
//     });
//   }
//   loadUsers(); // Load users on page load

//   // 🟢 Add New User
//   $("#addUserForm").submit(function (e) {
//     e.preventDefault();
//     let userData = {
//       user_name: $("#userName").val(),
//       email: $("#userEmail").val(),
//       mobile: $("#userMobile").val(),
//       address: $("#userAddress").val(),
//       password: $("#userPassword").val(),
//     };

//     $.ajax({
//       url: apiUrl,
//       type: "POST",
//       contentType: "application/json",
//       data: JSON.stringify(userData),
//       success: function () {
//         alert("User added successfully!");
//         $("#addUserForm")[0].reset();
//         loadUsers();
//       },
//       error: function () {
//         alert("Error adding user!");
//       },
//     });
//   });

//   // 🟢 Open Edit Modal & Fill Data
//   $(document).on("click", ".edit-btn", function () {
//     let row = $(this).closest("tr");
//     let user_id = row.data("id");
//     // console.log("Editing User ID:", user_id);
//     let user_name = row.find("td:eq(1)").text();
//     let email = row.find("td:eq(2)").text();

//     $("#editUserId").val(user_id);
//     $("#editUserName").val(user_name);
//     $("#editUserEmail").val(email);
//     $("#editUserModal").show();
//   });

//   // 🟢 Update User
//   $("#editUserForm").submit(function (e) {
//     e.preventDefault();
//     let user_id = $("#editUserId").val();
//     // console.log(user_id);
//     let updatedUser = {
//       user_name: $("#editUserName").val(),
//       email: $("#editUserEmail").val(),
//     };

//     $.ajax({
//       url: `${apiUrl}/${user_id}`,
//       type: "PUT",
//       contentType: "application/json",
//       data: JSON.stringify(updatedUser),
//       success: function () {
//         alert("User updated successfully!");
//         $("#editUserModal").hide();
//         loadUsers();
//       },
//       error: function (xhr) {
//         alert("Error updating user!" + xhr.responseText);
//       },
//     });
//   });

//   // 🟢 Delete Single User
//   $(document).on("click", ".delete-btn", function () {
//     let user_id = $(this).closest("tr").data("id");
//     if (confirm("Are you sure you want to delete this user?")) {
//       $.ajax({
//         url: `${apiUrl}/${user_id}`,
//         type: "DELETE",
//         success: function () {
//           alert("User deleted successfully!");
//           loadUsers();
//         },
//         error: function (xhr) {
//           alert("Error deleting user!" + xhr.responseText);
//         },
//       });
//     }
//   });

// $(document).ready(function () {
//   const apiUrl = "http://127.0.0.1:5000/users";

//   // 🟢 Fetch & Display Users
//   function loadUsers() {
//     $.ajax({
//       url: apiUrl,
//       type: "GET",
//       dataType: "json",
//       success: function (users) {
//         let rows = "";
//         users.forEach((user) => {
//           let isActive = user.status === "Active";
//           let statusColor = isActive ? "red" : "green";
//           let statusText = isActive ? "Deactivate" : "Activate";
//           rows += `
//                       <tr data-id="${user.user_id}">
//                           <td>${user.user_id}</td>
//                           <td>${user.user_name}</td>
//                           <td>${user.email}</td>
//                           <td>
//                               <button class="status-btn" data-id="${user.user_id}" data-active="${isActive}" style="background-color: ${statusColor}; color: white; border: none; padding: 5px 10px; cursor: pointer;">
//                                   ${statusText}
//                               </button>
//                               <button class="btn edit-btn" data-id="${user.user_id}">Edit</button>
//                           </td>
//                       </tr>
//                   `;
//         });
//         $("#userTable tbody").html(rows);
//       },
//       error: function () {
//         alert("Failed to load users");
//       },
//     });
//   }
//   loadUsers(); // Load users on page load

//   // 🟢 Add New User
//   $("#addUserForm").submit(function (e) {
//     e.preventDefault();
//     let userData = {
//       user_name: $("#userName").val(),
//       email: $("#userEmail").val(),
//       mobile: $("#userMobile").val(),
//       address: $("#userAddress").val(),
//       password: $("#userPassword").val(),
//     };

//     $.ajax({
//       url: apiUrl,
//       type: "POST",
//       contentType: "application/json",
//       data: JSON.stringify(userData),
//       success: function () {
//         alert("User added successfully!");
//         $("#addUserForm")[0].reset();
//         loadUsers();
//       },
//       error: function () {
//         alert("Error adding user!");
//       },
//     });
//   });

//   // 🟢 Toggle User Status
//   $(document).on("click", ".status-btn", function (event) {
//     event.stopPropagation(); // Prevent event bubbling
//     let button = $(this);
//     let user_id = button.attr("data-id");
//     let isActive = button.attr("data-active") === "true";
//     let newStatus = !isActive;

//     $.ajax({
//       url: `${apiUrl}/${user_id}/status`,
//       type: "PUT",
//       contentType: "application/json",
//       data: JSON.stringify({ is_active: newStatus }),
//       success: function () {
//         button.attr("data-active", newStatus);
//         button.text(newStatus ? "Deactivate" : "Activate");
//         button.css("background-color", newStatus ? "green" : "red");
//       },
//       error: function (err) {
//         alert("Error updating user status: " + err.responseText);
//       },
//     });
//   });

//   // 🟢 Open Edit Modal & Fill Data
//   $(document).on("click", ".edit-btn", function (event) {
//     event.stopPropagation(); // Prevent event bubbling
//     let row = $(this).closest("tr");
//     let user_id = row.data("id");
//     let user_name = row.find("td:eq(1)").text();
//     let email = row.find("td:eq(2)").text();

//     $("#editUserId").val(user_id);
//     $("#editUserName").val(user_name);
//     $("#editUserEmail").val(email);
//     $("#editUserModal").show();
//   });

//   // 🟢 Update User
//   $("#editUserForm").submit(function (e) {
//     e.preventDefault();
//     let user_id = $("#editUserId").val();
//     let updatedUser = {
//       user_name: $("#editUserName").val(),
//       email: $("#editUserEmail").val(),
//     };

//     $.ajax({
//       url: `${apiUrl}/${user_id}`,
//       type: "PUT",
//       contentType: "application/json",
//       data: JSON.stringify(updatedUser),
//       success: function () {
//         alert("User updated successfully!");
//         $("#editUserModal").hide();
//         loadUsers();
//       },
//       error: function (xhr) {
//         alert("Error updating user!" + xhr.responseText);
//       },
//     });
//   });

//   // 🟢 Close Edit Modal
//   $(".close").click(function () {
//     $("#editUserModal").hide();
//   });
// });

$(document).ready(function () {
  const apiUrl = "http://127.0.0.1:5000/users";

  // 🟢 Fetch & Display Users
  function loadUsers() {
    $.ajax({
      url: apiUrl,
      type: "GET",
      dataType: "json",
      success: function (users) {
        let rows = "";
        users.forEach((user) => {
          let isActive = user.status === "Active";
          let statusColor = isActive ? "green" : "red";
          let statusText = isActive ? "Deactivate" : "Activate";
          rows += `
                      <tr data-id="${user.user_id}">
                          <td>${user.user_id}</td>
                          <td>${user.user_name}</td>
                          <td>${user.email}</td>
                          <td>
                              <button class="status-btn" data-id="${user.user_id}" data-active="${isActive}" style="background-color: ${statusColor}; color: white; border: none; padding: 5px 10px; cursor: pointer;">
                                  ${statusText}
                              </button>
                              <button class="btn edit-btn" data-id="${user.user_id}">Edit</button>
                          </td>
                      </tr>
                  `;
        });
        $("#userTable tbody").html(rows);
      },
      error: function () {
        alert("Failed to load users");
      },
    });
  }
  loadUsers(); // Load users on page load

  // 🟢 Add New User
  $("#addUserForm").submit(function (e) {
    e.preventDefault();
    let userData = {
      user_name: $("#userName").val(),
      email: $("#userEmail").val(),
      mobile: $("#userMobile").val(),
      address: $("#userAddress").val(),
      password: $("#userPassword").val(),
    };

    $.ajax({
      url: apiUrl,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(userData),
      success: function () {
        alert("User added successfully!");
        $("#addUserForm")[0].reset();
      },
      error: function () {
        alert("Error adding user!");
      },
    });
  });

  // 🟢 Toggle User Status (without changing table structure)
  $(document).on("click", ".status-btn", function (event) {
    event.stopPropagation(); // Prevent event bubbling
    let button = $(this);
    let user_id = button.attr("data-id");
    let isActive = button.attr("data-active") === "true";
    let newStatus = !isActive;

    $.ajax({
      url: `${apiUrl}/${user_id}/status`,
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify({ is_active: newStatus }),
      success: function () {
        button.attr("data-active", newStatus);
        button.text(newStatus ? "Deactivate" : "Activate");
        button.css("background-color", newStatus ? "green" : "red");
      },
      error: function (err) {
        alert("Error updating user status: " + err.responseText);
      },
    });
  });

  // 🟢 Open Edit Modal & Fill Data
  $(document).on("click", ".edit-btn", function (event) {
    event.stopPropagation(); // Prevent event bubbling
    let row = $(this).closest("tr");
    let user_id = row.data("id");
    let user_name = row.find("td:eq(1)").text();
    let email = row.find("td:eq(2)").text();

    $("#editUserId").val(user_id);
    $("#editUserName").val(user_name);
    $("#editUserEmail").val(email);
    $("#editUserModal").show();
  });

  // 🟢 Update User
  $("#editUserForm").submit(function (e) {
    e.preventDefault();
    let user_id = $("#editUserId").val();
    let updatedUser = {
      user_name: $("#editUserName").val(),
      email: $("#editUserEmail").val(),
    };

    $.ajax({
      url: `${apiUrl}/${user_id}`,
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify(updatedUser),
      success: function () {
        alert("User updated successfully!");
        $("#editUserModal").hide();
        loadUsers();
      },
      error: function (xhr) {
        alert("Error updating user!" + xhr.responseText);
      },
    });
  });

  // 🟢 Close Edit Modal
  $(".close").click(function () {
    $("#editUserModal").hide();
  });
});
