function showWeek(event, weekNum) {
  event.preventDefault();
  // Hide all week cards
  document.querySelectorAll(".week-card").forEach((card) => {
    card.style.display = "none";
    card.classList.remove("active");
  });
  // Show selected week card
  const selectedCard = document.getElementById("week" + weekNum);
  if (selectedCard) {
    selectedCard.style.display = "";
    selectedCard.classList.add("active");
    // Collapse all days in this week
    collapseAllDays(selectedCard);
  }
  // Update tab active state
  document.querySelectorAll(".week-tabs a").forEach((tab) => {
    tab.classList.remove("active");
  });
  event.target.classList.add("active");
}

function collapseAllDays(context) {
  const scope = context || document;
  scope.querySelectorAll(".day-content").forEach((content) => {
    content.style.display = "none"; // always hide
    const header = content.previousElementSibling;
    if (header && header.querySelector("span")) {
      header.querySelector("span").textContent = "▼";
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // Collapse all days at start
  collapseAllDays();

  // Add click event for each day header
  document.querySelectorAll(".day-header").forEach((header) => {
    header.addEventListener("click", function () {
      const content = header.nextElementSibling;
      if (!content) return;
      if (content.style.display === "block") {
        content.style.display = "none";
        header.querySelector("span").textContent = "▼";
      } else {
        content.style.display = "block";
        header.querySelector("span").textContent = "▲";
      }
    });
  });

  // Add event listeners for checkboxes to handle strike-through
  document
    .querySelectorAll('.checkbox-item input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        const label = checkbox.nextElementSibling;
        if (checkbox.checked) {
          label.classList.add("checkbox-done");
        } else {
          label.classList.remove("checkbox-done");
        }
      });
      // On load, set the correct class if already checked
      if (checkbox.checked) {
        const label = checkbox.nextElementSibling;
        label.classList.add("checkbox-done");
      }
    });
});

// Optional: Progress bar logic placeholder
function updateProgress() {
  // You can implement the progress logic here
}
