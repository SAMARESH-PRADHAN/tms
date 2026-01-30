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
