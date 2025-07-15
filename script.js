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
  // Update progress bar for the newly visible week
  updateProgress();
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

  // Add event listeners for checkboxes to handle strike-through and progress
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
        updateProgress();
      });
      // On load, set the correct class if already checked
      if (checkbox.checked) {
        const label = checkbox.nextElementSibling;
        label.classList.add("checkbox-done");
      }
    });

  // --- Week navigation buttons logic START ---
  const weekTabs = document.querySelectorAll(".week-tabs a");

  function getCurrentWeekIdx() {
    return Array.from(weekTabs).findIndex((tab) =>
      tab.classList.contains("active")
    );
  }

  function navigateWeek(direction) {
    const currentWeek = getCurrentWeekIdx();
    let newIdx = currentWeek + direction;
    if (newIdx < 0 || newIdx >= weekTabs.length) return;
    weekTabs[newIdx].click();
    // .active class will be updated by the click event handler on tab
    updateNavButtons();
    // Progress bar will update by showWeek
  }

  const prevBtn = document.getElementById("prevWeekBtn");
  const nextBtn = document.getElementById("nextWeekBtn");

  function updateNavButtons() {
    const idx = getCurrentWeekIdx();
    if (prevBtn) prevBtn.disabled = idx === 0;
    if (nextBtn) nextBtn.disabled = idx === weekTabs.length - 1;
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => navigateWeek(-1));
    nextBtn.addEventListener("click", () => navigateWeek(1));
    weekTabs.forEach((tab, i) => {
      tab.addEventListener("click", () => {
        updateNavButtons();
      });
    });
    updateNavButtons();
  }
  // --- Week navigation buttons logic END ---

  // Initial progress calculation
  updateProgress();
});

// Progress bar logic implementation
function updateProgress() {
  // Find visible week-card
  const weekCard = Array.from(document.querySelectorAll(".week-card")).find(
    (card) => card.style.display !== "none"
  );
  // If not found, fallback to all checkboxes
  let checkboxes;
  if (weekCard) {
    checkboxes = weekCard.querySelectorAll(
      '.checkbox-item input[type="checkbox"]'
    );
  } else {
    checkboxes = document.querySelectorAll(
      '.checkbox-item input[type="checkbox"]'
    );
  }
  const total = checkboxes.length;
  const checked = Array.from(checkboxes).filter((cb) => cb.checked).length;
  const percent = total === 0 ? 0 : Math.round((checked / total) * 100);

  // Update bar width
  const bar = document.getElementById("progress-bar");
  if (bar) {
    bar.style.width = percent + "%";
  }
  // Update text
  const text = document.getElementById("progress-text");
  if (text) {
    text.textContent = `${percent}% Complete (${checked}/${total} sessions)`;
  }
}
