// --- Mobile Hamburger Menu ---
function openMobileMenu() {
  document.getElementById('mobileMenu').classList.add('show');
}
function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('show');
}

// --- Collapsible Day Sections ---
function toggleDay(dayHeader) {
  const content = dayHeader.nextElementSibling;
  if (!content) return;
  if (content.classList.contains('collapsed')) {
    content.classList.remove('collapsed');
    dayHeader.querySelector('.toggle-btn').textContent = '▲';
  } else {
    content.classList.add('collapsed');
    dayHeader.querySelector('.toggle-btn').textContent = '▼';
  }
}

// --- Week Navigation ---
function showWeek(weekNum) {
  // Hide all weeks
  document.querySelectorAll('.week-content').forEach(w => w.classList.remove('active'));
  // Remove active tab
  document.querySelectorAll('.week-tab').forEach(tab => tab.classList.remove('active'));
  // Remove active link (mobile)
  document.querySelectorAll('.week-link').forEach(link => link.classList.remove('active'));
  // Show selected week
  const weekDiv = document.getElementById('week' + weekNum);
  if (weekDiv) weekDiv.classList.add('active');
  // Set active tab
  const activeTab = document.querySelector('.week-tab[data-week="' + weekNum + '"]');
  if (activeTab) activeTab.classList.add('active');
  // Set active mobile link
  const activeLink = document.querySelector('.week-link[data-week="' + weekNum + '"]');
  if (activeLink) activeLink.classList.add('active');
  // Update week indicator
  document.getElementById('weekIndicator').textContent = 'Week ' + weekNum + ' of 7';
  // Update prev/next button states
  document.getElementById('prevWeek').disabled = (weekNum <= 1);
  document.getElementById('nextWeek').disabled = (weekNum >= 7);
}

// --- Bottom Pagination ---
function previousWeek() {
  const current = getCurrentWeekNum();
  if (current > 1) showWeek(current - 1);
}
function nextWeek() {
  const current = getCurrentWeekNum();
  if (current < 7) showWeek(current + 1);
}
function getCurrentWeekNum() {
  const indicator = document.getElementById('weekIndicator').textContent;
  const match = indicator.match(/Week (\d+)/);
  return match ? parseInt(match[1]) : 1;
}

// --- Progress Tracking ---
function updateProgress() {
  // 196 total checkboxes
  const total = 196;
  const checked = document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked').length;
  const percent = Math.round((checked / total) * 100);
  // Progress bar fill
  document.getElementById('overall-progress').style.width = percent + '%';
  // Progress text
  document.getElementById('progress-text').textContent = percent + '% Complete (' + checked + '/' + total + ' sessions)';
}

// --- Initial Setup ---
document.addEventListener('DOMContentLoaded', function () {
  // Set up collapsible days
  document.querySelectorAll('.day-header').forEach(header => {
    header.addEventListener('click', function() { toggleDay(header); });
  });
  // Set up week navigation tabs
  document.querySelectorAll('.week-tab').forEach(tab => {
    tab.addEventListener('click', function (e) {
      e.preventDefault();
      const weekNum = tab.getAttribute('data-week');
      showWeek(weekNum);
    });
  });
  // Set up mobile week links
  document.querySelectorAll('.week-link').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const weekNum = link.getAttribute('data-week');
      showWeek(weekNum);
      closeMobileMenu();
    });
  });
  // Set up hamburger
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openMobileMenu);
  const closeBtn = document.querySelector('.close-menu');
  if (closeBtn) closeBtn.addEventListener('click', closeMobileMenu);

  // Set up previous/next buttons
  document.getElementById('prevWeek').addEventListener('click', previousWeek);
  document.getElementById('nextWeek').addEventListener('click', nextWeek);

  // Set up progress tracking on all checkboxes
  document.querySelectorAll('.checkbox-group input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', updateProgress);
  });

  // Initial state: Show week 1
  showWeek(1);
  updateProgress();
});