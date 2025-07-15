// --- WEEK AND DAY NAVIGATION LOGIC WITH "NEXT UNFINISHED DAY" FEATURE ---
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
  // Save last opened week to localStorage
  localStorage.setItem('lastOpenedWeek', weekNum);
  // Update progress bar for the newly visible week
  updateProgress();
}

function collapseAllDays(context) {
  const scope = context || document;
  scope.querySelectorAll(".day-content").forEach((content) => {
    content.style.display = "none";
    const header = content.previousElementSibling;
    if (header && header.querySelector("span")) {
      header.querySelector("span").textContent = "▼";
    }
    if (header) {
      header.classList.remove("day-open");
    }
  });
}

function saveCheckboxState(checkbox) {
  localStorage.setItem(checkbox.id, checkbox.checked ? "true" : "false");
}

function restoreCheckboxStates() {
  document
    .querySelectorAll('.checkbox-item input[type="checkbox"]')
    .forEach((checkbox) => {
      const stored = localStorage.getItem(checkbox.id);
      if (stored !== null) {
        checkbox.checked = stored === "true";
      }
      // On load, set the correct class if already checked
      const label = checkbox.nextElementSibling;
      if (checkbox.checked) {
        label.classList.add("checkbox-done");
      } else {
        label.classList.remove("checkbox-done");
      }
    });
}

function updateDayHeaderStatus() {
  document.querySelectorAll('.day').forEach(day => {
    const header = day.querySelector('.day-header');
    const checkboxes = day.querySelectorAll('.checkbox-item input[type="checkbox"]');
    const isComplete = checkboxes.length > 0 && Array.from(checkboxes).every(cb => cb.checked);
    if (isComplete) {
      header.classList.add('day-complete');
    } else {
      header.classList.remove('day-complete');
    }
  });
}

// --- NEW LOGIC: Open next unfinished day automatically ---
function openNextUnfinishedDay() {
  const allDays = Array.from(document.querySelectorAll('.day'));
  for (let day of allDays) {
    const checkboxes = day.querySelectorAll('.checkbox-item input[type="checkbox"]');
    if (checkboxes.length > 0 && Array.from(checkboxes).some(cb => !cb.checked)) {
      // Open the containing week tab
      const weekCard = day.closest('.week-card');
      if (weekCard) {
        const weekNum = weekCard.id.replace('week', '');
        let weekTab = document.querySelector('.week-tabs a[data-week="' + weekNum + '"]');
        if (weekTab) weekTab.click();
      }
      // Expand this day
      const header = day.querySelector('.day-header');
      if (header) header.click();
      return;
    }
  }
  // If all days are complete, open the last day
  if (allDays.length > 0) {
    const lastDay = allDays[allDays.length - 1];
    const weekCard = lastDay.closest('.week-card');
    if (weekCard) {
      const weekNum = weekCard.id.replace('week', '');
      let weekTab = document.querySelector('.week-tabs a[data-week="' + weekNum + '"]');
      if (weekTab) weekTab.click();
    }
    const header = lastDay.querySelector('.day-header');
    if (header) header.click();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Restore checkbox state on load
  restoreCheckboxStates();

  // Collapse all days at start
  collapseAllDays();

  // --- DAY HEADER CLICK LOGIC ---
  document.querySelectorAll(".day-header").forEach((header) => {
    header.addEventListener("click", function () {
      document.querySelectorAll('.day-header').forEach(h => {
        if (h !== header) h.classList.remove('day-open');
      });
      const content = header.nextElementSibling;
      if (!content) return;
      if (content.style.display === "block") {
        content.style.display = "none";
        header.classList.remove('day-open');
        header.querySelector("span").textContent = "▼";
      } else {
        // Close all other day contents
        document.querySelectorAll('.day-content').forEach(dc => {
          if (dc !== content) dc.style.display = "none";
        });
        content.style.display = "block";
        header.classList.add('day-open');
        header.querySelector("span").textContent = "▲";
      }
    });
  });

  // --- CHECKBOX CHANGE LOGIC ---
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
        saveCheckboxState(checkbox);
        updateProgress();
      });
      if (checkbox.checked) {
        const label = checkbox.nextElementSibling;
        label.classList.add("checkbox-done");
      }
    });

  // --- WEEK NAVIGATION BUTTONS LOGIC ---
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
    updateNavButtons();
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

  // --- OPEN NEXT UNFINISHED DAY AT START ---
  openNextUnfinishedDay();

  // Initial progress calculation
  updateProgress();
});

// --- PROGRESS BAR LOGIC ---
function updateProgress() {
  const checkboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]');
  const total = checkboxes.length;
  const checked = Array.from(checkboxes).filter((cb) => cb.checked).length;
  const percent = total === 0 ? 0 : Math.round((checked / total) * 100);

  const bar = document.getElementById("progress-bar");
  if (bar) {
    bar.style.width = percent + "%";
  }
  const text = document.getElementById("progress-text");
  if (text) {
    text.textContent = `${percent}% Complete (${checked}/${total} sessions)`;
  }

  updateDayHeaderStatus();
}
