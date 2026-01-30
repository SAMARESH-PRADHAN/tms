$(document).ready(function () {
  // Load header and footer
  $("#headerHome").load("nav.html");
  $("#footer").load("footer.html");
  $("#header").css("background", "none");
});

$(document).ready(function () {
  function loadContacts() {
    $.ajax({
      url: "https://tms-backend-kfut.onrender.com/admin/contacts",
      method: "GET",
      success: function (data) {
        let html = "";
        data.forEach((contact) => {
          const readClass = contact.is_read ? "read" : "";
          const readText = contact.is_read ? "Read" : "Mark as Read";

          html += `
            <div class="contact-card" data-id="${contact.contact_id}">
              <h3><i class="fas fa-user"></i> ${contact.name}</h3>
              <p><i class="fas fa-envelope"></i> ${contact.email}</p>
              <p><i class="fas fa-phone"></i> ${contact.phone}</p>
              <p><i class="fas fa-comment-dots"></i> ${contact.message}</p>
              <p><i class="fas fa-calendar-alt"></i> ${contact.created_on}</p>
              <button class="read-btn ${readClass}" ${
            readClass ? "disabled" : ""
          }>
                ${readText}
              </button>
            </div>
          `;
        });
        $("#contactList").html(html);
      },
      error: function () {
        alert("Could not load contact messages.");
      },
    });
  }

  loadContacts();

  $(document).on("click", ".read-btn:not(.read)", function () {
    const button = $(this);
    const card = button.closest(".contact-card");
    const contactId = card.data("id");

    console.log("Contact ID:", contactId); // Debug line

    if (!contactId) {
      alert("Error: contact ID not found.");
      return;
    }

    $.ajax({
      url: `https://tms-backend-kfut.onrender.com/admin/contact/read/${contactId}`,
      method: "POST",
      success: function () {
        button.addClass("read").text("Read").prop("disabled", true);
      },
      error: function () {
        alert("Failed to mark as read.");
      },
    });
  });
});
