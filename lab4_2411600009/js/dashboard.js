document.addEventListener('DOMContentLoaded', async function () {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (isLoggedIn !== 'true') {
    window.location.href = 'index.html';
    return;
  }

  const username = localStorage.getItem('user') || 'User';
  const userNameSpan = document.getElementById('userName');
  if (userNameSpan) userNameSpan.textContent = username;

  updateGreeting(username);
  setupLogout();

  showLoadingState(true);
  await initializeData();
  showLoadingState(false);

  populateTypeFilter();
  refreshDashboard();
  attachEventListeners();
  startRealTimeSimulation();
});


function updateGreeting(username) {
  const greetingElement = document.getElementById('greeting');
  if (!greetingElement) return;

  const hour = new Date().getHours();
  let timeOfDay = '';

  if (hour >= 5 && hour < 12) {
    timeOfDay = 'Good Morning';
  } else if (hour >= 12 && hour < 17) {
    timeOfDay = 'Good Afternoon';
  } else if (hour >= 17 && hour < 21) {
    timeOfDay = 'Good Evening';
  } else {
    timeOfDay = 'Good Night';
  }

  greetingElement.textContent = `${timeOfDay}, ${username}!`;
}


function updateStatistics() {
  const stats = getActivityStatistics();

  const stat1Value = document.getElementById('stat1-value'); // Daily Steps
  const stat2Value = document.getElementById('stat2-value'); // Calories Burned
  const stat3Value = document.getElementById('stat3-value'); // Workouts
  const stat4Value = document.getElementById('stat4-value'); // Avg Heart Rate

  if (stat1Value) stat1Value.textContent = stats.latestSteps.toLocaleString();
  if (stat2Value) stat2Value.textContent = `${stats.totalCalories.toLocaleString()} kcal`;
  if (stat3Value) stat3Value.textContent = stats.completedCount;
  if (stat4Value) stat4Value.textContent = `${stats.avgHeartRate || 0} bpm`;
}


function renderActivityTable(activities) {
  const tableBody = document.getElementById('activityTableBody');
  if (!tableBody) return;
  tableBody.innerHTML = '';

  if (activities.length === 0) {
    const emptyRow = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 7;
    cell.className = 'text-center text-muted py-4';
    cell.textContent = 'No activities match the current filters.';
    emptyRow.appendChild(cell);
    tableBody.appendChild(emptyRow);
    return;
  }

  const query = AppState.searchQuery.trim().toLowerCase();

  activities.forEach((activity) => {
    const row = document.createElement('tr');

    row.appendChild(makeCell(activity.date));
    row.appendChild(makeCell(highlightMatch(activity.name, query), true));
    row.appendChild(makeCell(activity.type));
    row.appendChild(makeCell(activity.duration ? `${activity.duration} min` : '—'));
    row.appendChild(makeCell(activity.caloriesBurned ? `${activity.caloriesBurned} kcal` : '—'));
    row.appendChild(makeCell(activity.avgHeartRate ? `${activity.avgHeartRate} bpm` : '—'));

    const statusCell = document.createElement('td');
    let badgeClass = 'bg-secondary';
    if (activity.status === 'completed') badgeClass = 'bg-success';
    else if (activity.status === 'in-progress') badgeClass = 'bg-warning text-dark';
    else if (activity.status === 'missed') badgeClass = 'bg-danger';
    else if (activity.status === 'info') badgeClass = 'bg-info text-dark';
    const badge = document.createElement('span');
    badge.className = `badge ${badgeClass}`;
    badge.textContent = activity.status;
    statusCell.appendChild(badge);
    row.appendChild(statusCell);

    tableBody.appendChild(row);
  });
}

function makeCell(content, isHTML = false) {
  const td = document.createElement('td');
  if (isHTML) td.innerHTML = content;
  else td.textContent = content;
  return td;
}

function highlightMatch(text, query) {
  if (!query) return escapeHTML(text);
  const escaped = escapeHTML(text);
  const idx = escaped.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return escaped;
  return escaped.slice(0, idx) + `<mark>${escaped.slice(idx, idx + query.length)}</mark>` + escaped.slice(idx + query.length);
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}


function renderMissedAlerts() {
  const container = document.getElementById('alertContainer');
  if (!container) return;
  container.innerHTML = '';
  const missed = getMissedActivities();

  if (missed.length === 0) {
    container.classList.add('d-none');
    return;
  }
  container.classList.remove('d-none');

  const alert = document.createElement('div');
  alert.className = 'alert alert-warning d-flex align-items-start gap-2 shadow-sm';
  alert.setAttribute('role', 'alert');

  const icon = document.createElement('i');
  icon.className = 'bi bi-exclamation-triangle-fill fs-4';

  const textWrap = document.createElement('div');
  const title = document.createElement('strong');
  title.textContent = `${missed.length} workout(s) need attention: `;
  const list = document.createElement('span');
  list.textContent = missed.map((a) => `${a.name} (${a.status})`).join(', ');

  textWrap.appendChild(title);
  textWrap.appendChild(list);
  alert.appendChild(icon);
  alert.appendChild(textWrap);
  container.appendChild(alert);
}


function populateTypeFilter() {
  const select = document.getElementById('typeFilter');
  if (!select) return;
  const types = [...new Set(getActivities().map((a) => a.type))];
  types.forEach((type) => {
    const opt = document.createElement('option');
    opt.value = type;
    opt.textContent = type;
    select.appendChild(opt);
  });
}

function refreshDashboard() {
  const filtered = applyFilters();
  renderActivityTable(filtered);
  updateStatistics();
  renderMissedAlerts();
  refreshAllCharts();
}

function attachEventListeners() {
  document.getElementById('typeFilter').addEventListener('change', (e) => {
    filterByType(e.target.value);
    refreshDashboard();
  });

  document.querySelectorAll('[data-status-filter]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('[data-status-filter]').forEach((b) => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      filterByStatus(e.currentTarget.dataset.statusFilter);
      refreshDashboard();
    });
  });

  document.getElementById('calMin').addEventListener('input', debounce(applyCalorieFilter, 300));
  document.getElementById('calMax').addEventListener('input', debounce(applyCalorieFilter, 300));

  document.getElementById('searchInput').addEventListener('input', (e) => {
    updateSearchResults(e.target.value);
    renderActivityTable(applyFilters());
  });

  document.getElementById('exportCsvBtn').addEventListener('click', () => {
    const data = applyFilters();
    const csv = exportToCSV(data);
    downloadCSV(csv, `activity_log_${Date.now()}.csv`);
    showToast(`Exported ${data.length} activity record(s) to CSV.`);
  });

  document.getElementById('clearFiltersBtn').addEventListener('click', () => {
    AppState.filters = { type: 'all', status: 'all', minCal: null, maxCal: null };
    AppState.searchQuery = '';
    document.getElementById('typeFilter').value = 'all';
    document.getElementById('calMin').value = '';
    document.getElementById('calMax').value = '';
    document.getElementById('searchInput').value = '';
    document.querySelectorAll('[data-status-filter]').forEach((b) => b.classList.remove('active'));
    document.querySelector('[data-status-filter="all"]').classList.add('active');
    refreshDashboard();
  });
}

function applyCalorieFilter() {
  const min = parseFloat(document.getElementById('calMin').value);
  const max = parseFloat(document.getElementById('calMax').value);
  filterByCalorieRange(isNaN(min) ? null : min, isNaN(max) ? null : max);
  refreshDashboard();
}

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}


function startRealTimeSimulation() {
  setInterval(() => {
    const newActivity = simulateNewActivity();
    refreshDashboard();
    showToast(`New activity synced: ${newActivity.name} (${newActivity.status})`);
  }, CONFIG.REFRESH_INTERVAL_MS);
}

function showToast(message) {
  const toastEl = document.getElementById('liveToast');
  document.getElementById('toastBody').textContent = message;
  const toast = new bootstrap.Toast(toastEl, { delay: 3500 });
  toast.show();
}

function showLoadingState(isLoading) {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) overlay.classList.toggle('d-none', !isLoading);
}


function setupLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  const logoutLink = document.getElementById('logoutLink');

  function performLogout(e) {
    if (e) e.preventDefault();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
  }

  if (logoutBtn) logoutBtn.addEventListener('click', performLogout);
  if (logoutLink) logoutLink.addEventListener('click', performLogout);
}
