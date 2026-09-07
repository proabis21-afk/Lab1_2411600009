/* ============================================================
   charts.js
   Chart.js configuration and rendering (Sunny Beach theme)
   ============================================================ */

const CHART_COLORS = {
  primary: "#264653",    // charcoal-blue
  secondary: "#2A9D8F",  // verdigris
  accent: "#E9C46A",     // tuscan-sun
  lightAccent: "#F4A261",// sandy-brown
  danger: "#E76F51",     // burnt-peach
  palette: ["#264653", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51", "#8AB0AB"],
};

const ChartRegistry = {};

function destroyChart(key) {
  if (ChartRegistry[key]) {
    ChartRegistry[key].destroy();
    delete ChartRegistry[key];
  }
}

/* ---- Chart 1: Calories Burned by Activity Type (Bar) ------------------ */
function renderCaloriesByTypeChart(canvasId = "chartCaloriesByType") {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  const summary = getCaloriesByType();

  destroyChart(canvasId);
  ChartRegistry[canvasId] = new Chart(ctx, {
    type: "bar",
    data: {
      labels: summary.map((c) => c.type),
      datasets: [
        {
          label: "Calories Burned",
          data: summary.map((c) => c.totalCalories),
          backgroundColor: CHART_COLORS.secondary,
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { callback: (v) => v + " kcal" } } },
    },
  });
}

/* ---- Chart 2: Workout Status Distribution (Doughnut) ------------------- */
function renderStatusDistributionChart(canvasId = "chartStatusDistribution") {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  const stats = getActivityStatistics();

  destroyChart(canvasId);
  ChartRegistry[canvasId] = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Completed", "In Progress", "Missed"],
      datasets: [
        {
          data: [stats.completedCount, stats.inProgressCount, stats.missedCount],
          backgroundColor: [CHART_COLORS.secondary, CHART_COLORS.accent, CHART_COLORS.danger],
          borderWidth: 2,
          borderColor: "#fff",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } },
    },
  });
}

/* ---- Chart 3: Weekly Steps Trend (Line) --------------------------------- */
function renderWeeklyStepsChart(canvasId = "chartWeeklySteps") {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  const trend = getWeeklyStepsTrend();

  destroyChart(canvasId);
  ChartRegistry[canvasId] = new Chart(ctx, {
    type: "line",
    data: {
      labels: trend.labels,
      datasets: [
        {
          label: "Daily Steps",
          data: trend.values,
          borderColor: CHART_COLORS.primary,
          backgroundColor: "rgba(38, 70, 83, 0.12)",
          fill: true,
          tension: 0.35,
          pointBackgroundColor: CHART_COLORS.lightAccent,
          pointRadius: 4,
        },
        {
          label: "Goal (10,000)",
          data: trend.labels.map(() => CONFIG.DAILY_STEP_GOAL),
          borderColor: CHART_COLORS.danger,
          borderDash: [6, 6],
          pointRadius: 0,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } },
      scales: { y: { beginAtZero: true, ticks: { callback: (v) => v.toLocaleString() } } },
    },
  });
}

/* ---- Chart 4: Top 5 Activities by Calories Burned (Horizontal Bar) ----- */
function renderTopActivitiesChart(canvasId = "chartTopActivities") {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  const top = getTopActivitiesByCalories(5);

  destroyChart(canvasId);
  ChartRegistry[canvasId] = new Chart(ctx, {
    type: "bar",
    data: {
      labels: top.map((a) => a.name.length > 22 ? a.name.slice(0, 22) + "…" : a.name),
      datasets: [
        {
          label: "Calories Burned",
          data: top.map((a) => a.caloriesBurned),
          backgroundColor: CHART_COLORS.lightAccent,
          borderRadius: 6,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { x: { beginAtZero: true, ticks: { callback: (v) => v + " kcal" } } },
    },
  });
}

/** Re-render every chart currently on the page (used after data changes). */
function refreshAllCharts() {
  renderCaloriesByTypeChart();
  renderStatusDistributionChart();
  renderWeeklyStepsChart();
  renderTopActivitiesChart();
}
