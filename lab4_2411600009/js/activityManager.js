/* ============================================================
   activityManager.js
  Light Way Fitness Tracker - Data Layer (Lab 4 enhancement)
   ============================================================ */

const CONFIG = {
  DAILY_STEP_GOAL: 10000,
  REFRESH_INTERVAL_MS: 9000, // simulated wearable sync interval
};

// ---- Central application state ---------------------------------------
const AppState = {
  activities: [],
  filters: {
    type: "all",
    status: "all",
    minCal: null,
    maxCal: null,
  },
  searchQuery: "",
};

// ---- Sample data (stand-in for a fitness-tracker API / JSON source) ---
const ACTIVITY_TYPES = ["Running", "Strength", "Yoga", "HIIT", "Cycling", "Hydration", "Walking"];

const SAMPLE_ACTIVITIES = [
  { id: 1,  name: "Morning Run - 5.2 km completed",   type: "Running",   date: "2026-08-16 07:30", duration: 32, caloriesBurned: 410, avgHeartRate: 148, status: "completed" },
  { id: 2,  name: "Strength Training - Upper Body",    type: "Strength",  date: "2026-08-15 18:45", duration: 45, caloriesBurned: 320, avgHeartRate: 132, status: "completed" },
  { id: 3,  name: "Hydration Goal Reached (2.5L)",     type: "Hydration", date: "2026-08-15 12:10", duration: 0,  caloriesBurned: 0,   avgHeartRate: 0,   status: "info" },
  { id: 4,  name: "Missed Yoga Session",                type: "Yoga",      date: "2026-08-14 06:00", duration: 0,  caloriesBurned: 0,   avgHeartRate: 0,   status: "missed" },
  { id: 5,  name: "HIIT Workout - 30 min",              type: "HIIT",      date: "2026-08-13 19:20", duration: 30, caloriesBurned: 380, avgHeartRate: 156, status: "completed" },
  { id: 6,  name: "Evening Cycling - 12 km",            type: "Cycling",   date: "2026-08-13 17:05", duration: 40, caloriesBurned: 350, avgHeartRate: 140, status: "completed" },
  { id: 7,  name: "Core Strength Circuit",              type: "Strength",  date: "2026-08-12 07:15", duration: 25, caloriesBurned: 210, avgHeartRate: 128, status: "completed" },
  { id: 8,  name: "Missed Morning Run",                 type: "Running",   date: "2026-08-12 06:30", duration: 0,  caloriesBurned: 0,   avgHeartRate: 0,   status: "missed" },
  { id: 9,  name: "Sunset Beach Walk",                  type: "Walking",   date: "2026-08-11 18:00", duration: 35, caloriesBurned: 150, avgHeartRate: 104, status: "completed" },
  { id: 10, name: "Yoga Flow - Flexibility",            type: "Yoga",      date: "2026-08-11 06:45", duration: 30, caloriesBurned: 130, avgHeartRate: 98,  status: "completed" },
  { id: 11, name: "HIIT Sprint Intervals",              type: "HIIT",      date: "2026-08-10 18:30", duration: 20, caloriesBurned: 290, avgHeartRate: 162, status: "in-progress" },
  { id: 12, name: "Long Distance Run - 8 km",           type: "Running",   date: "2026-08-10 06:00", duration: 48, caloriesBurned: 520, avgHeartRate: 151, status: "completed" },
  { id: 13, name: "Missed Cycling Session",             type: "Cycling",   date: "2026-08-09 17:00", duration: 0,  caloriesBurned: 0,   avgHeartRate: 0,   status: "missed" },
  { id: 14, name: "Hydration Goal Reached (3L)",        type: "Hydration", date: "2026-08-09 13:00", duration: 0,  caloriesBurned: 0,   avgHeartRate: 0,   status: "info" },
  { id: 15, name: "Strength Training - Leg Day",        type: "Strength",  date: "2026-08-08 18:15", duration: 50, caloriesBurned: 400, avgHeartRate: 138, status: "completed" },
];

// Steps logged for the last 7 days, used for the weekly trend line chart
const WEEKLY_STEPS = [
  { day: "Aug 10", steps: 9120 },
  { day: "Aug 11", steps: 7640 },
  { day: "Aug 12", steps: 10850 },
  { day: "Aug 13", steps: 8920 },
  { day: "Aug 14", steps: 6200 },
  { day: "Aug 15", steps: 9700 },
  { day: "Aug 16", steps: 8542 },
];

/* ---------------------------------------------------------------------
   Core data functions
--------------------------------------------------------------------- */

/** Simulates fetching activity data from a JSON file / wearable API. */
async function initializeData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      AppState.activities = JSON.parse(JSON.stringify(SAMPLE_ACTIVITIES));
      resolve(AppState.activities);
    }, 400); // simulated network latency
  });
}

function getActivities() {
  return AppState.activities;
}

function getActivityById(id) {
  return AppState.activities.find((a) => a.id === Number(id));
}

function getActivitiesByType(type) {
  if (type === "all") return AppState.activities;
  return AppState.activities.filter((a) => a.type === type);
}

/** Activities that need attention: missed or still in progress. */
function getMissedActivities() {
  return AppState.activities.filter((a) => a.status === "missed" || a.status === "in-progress");
}

function getActivityStatistics() {
  const activities = AppState.activities;
  const totalActivities = activities.length;
  const totalCalories = activities.reduce((sum, a) => sum + a.caloriesBurned, 0);
  const completedCount = activities.filter((a) => a.status === "completed").length;
  const missedCount = activities.filter((a) => a.status === "missed").length;
  const inProgressCount = activities.filter((a) => a.status === "in-progress").length;
  const latestSteps = WEEKLY_STEPS[WEEKLY_STEPS.length - 1].steps;
  const avgHeartRate = Math.round(
    activities.filter((a) => a.avgHeartRate > 0).reduce((s, a, _, arr) => s + a.avgHeartRate / arr.length, 0)
  );
  return { totalActivities, totalCalories, completedCount, missedCount, inProgressCount, latestSteps, avgHeartRate };
}

function getCaloriesByType() {
  const map = {};
  AppState.activities.forEach((a) => {
    if (!map[a.type]) map[a.type] = { type: a.type, totalCalories: 0, count: 0 };
    map[a.type].totalCalories += a.caloriesBurned;
    map[a.type].count += 1;
  });
  return Object.values(map);
}

function getTopActivitiesByCalories(limit = 5) {
  return [...AppState.activities].sort((a, b) => b.caloriesBurned - a.caloriesBurned).slice(0, limit);
}

function getWeeklyStepsTrend() {
  return { labels: WEEKLY_STEPS.map((d) => d.day), values: WEEKLY_STEPS.map((d) => d.steps) };
}

/* ---------------------------------------------------------------------
   Filtering
--------------------------------------------------------------------- */

function filterByType(type) {
  AppState.filters.type = type;
  return applyFilters();
}

function filterByStatus(status) {
  AppState.filters.status = status;
  return applyFilters();
}

function filterByCalorieRange(min, max) {
  AppState.filters.minCal = min;
  AppState.filters.maxCal = max;
  return applyFilters();
}

function applyFilters() {
  const { type, status, minCal, maxCal } = AppState.filters;
  let result = AppState.activities;

  if (type && type !== "all") {
    result = result.filter((a) => a.type === type);
  }
  if (status && status !== "all") {
    result = result.filter((a) => a.status === status);
  }
  if (minCal !== null && !Number.isNaN(minCal)) {
    result = result.filter((a) => a.caloriesBurned >= minCal);
  }
  if (maxCal !== null && !Number.isNaN(maxCal)) {
    result = result.filter((a) => a.caloriesBurned <= maxCal);
  }
  if (AppState.searchQuery) {
    result = searchWithinList(result, AppState.searchQuery);
  }
  return result;
}

/* ---------------------------------------------------------------------
   Search
--------------------------------------------------------------------- */

function searchWithinList(list, query) {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter((a) => a.name.toLowerCase().includes(q) || a.type.toLowerCase().includes(q));
}

function searchActivities(query) {
  return searchWithinList(AppState.activities, query);
}

function updateSearchResults(query) {
  AppState.searchQuery = query;
  return applyFilters();
}

/* ---------------------------------------------------------------------
   CSV Export
--------------------------------------------------------------------- */

function exportToCSV(data) {
  const headers = ["Date", "Activity", "Type", "Duration (min)", "Calories Burned", "Avg Heart Rate", "Status"];
  const rows = data.map((a) => [
    a.date,
    `"${a.name.replace(/"/g, '""')}"`,
    a.type,
    a.duration,
    a.caloriesBurned,
    a.avgHeartRate,
    a.status,
  ]);
  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

function downloadCSV(csvContent, filename) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/* ---------------------------------------------------------------------
   Real-time simulation (wearable sync)
--------------------------------------------------------------------- */

function simulateNewActivity() {
  const type = ACTIVITY_TYPES[Math.floor(Math.random() * ACTIVITY_TYPES.length)];
  const outcomeRoll = Math.random();
  const status = outcomeRoll < 0.15 ? "missed" : outcomeRoll < 0.25 ? "in-progress" : "completed";
  const duration = status === "completed" ? 15 + Math.floor(Math.random() * 40) : 0;
  const caloriesBurned = status === "completed" ? 80 + Math.floor(Math.random() * 350) : 0;
  const avgHeartRate = status === "completed" ? 95 + Math.floor(Math.random() * 65) : 0;

  const newActivity = {
    id: Math.max(0, ...AppState.activities.map((a) => a.id)) + 1,
    name: `${type} Session - Wearable Sync`,
    type,
    date: new Date().toISOString().slice(0, 16).replace("T", " "),
    duration,
    caloriesBurned,
    avgHeartRate,
    status,
  };

  AppState.activities.unshift(newActivity);
  if (AppState.activities.length > 30) AppState.activities.pop(); // cap log size
  return newActivity;
}
