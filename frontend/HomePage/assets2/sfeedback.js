$(document).ready(function () {
  fetchFeedbacks();

  function fetchFeedbacks() {
    $.ajax({
      url: "https://tms-backend-kfut.onrender.com/admin/feedbacks",
      type: "GET",
      success: function (data) {
        let cards = "";
        data.forEach((fb) => {
          cards += `
            <div class="feedback-card">
              <h3>${fb.name}</h3>
              <p><strong>Email:</strong> ${fb.email}</p>
              <p><strong>Rating:</strong> ${fb.rate_us} ⭐</p>
              <p><strong>Comments:</strong> ${fb.comments}</p>
              <div class="card-footer">
                <small>${new Date(fb.created_on).toLocaleString()}</small>
                <button class="delete-btn" data-id="${
                  fb.feedback_id
                }">Delete</button>
              </div>
            </div>
          `;
        });
        $("#card-container").html(cards);
      },
      error: function (xhr) {
        console.error("Error:", xhr.responseText);
        alert("Failed to fetch feedbacks.");
      },
    });
  }

  // Delete handler
  $(document).on("click", ".delete-btn", function () {
    const id = $(this).data("id");
    if (confirm("Are you sure you want to delete this feedback?")) {
      $.ajax({
        url: `https://tms-backend-kfut.onrender.com/admin/feedbacks/${id}`,
        type: "DELETE",
        success: function (res) {
          alert(res.message);
          fetchFeedbacks();
        },
        error: function (xhr) {
          console.error("Delete error:", xhr.responseText);
          alert("Failed to delete feedback.");
        },
      });
    }
  });
});
