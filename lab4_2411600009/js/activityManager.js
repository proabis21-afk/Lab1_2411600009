const CONFIG = {
    API_URL: "api.php",
    REFRESH_INTERVAL_MS: 20000,
    DAILY_STEP_GOAL: 10000
};

const AppState = {
    activities: [],
    searchQuery: "",
    filters: {
        type: "all",
        status: "all",
        minCal: null,
        maxCal: null
    }
};


/* FETCH DATA */

async function initializeData() {

    const response = await fetch(
        `${CONFIG.API_URL}?action=activities`,
        {
            cache: "no-store"
        }
    );

    if (!response.ok) {
        throw new Error(
            `API Error: ${response.status}`
        );
    }

    const result = await response.json();

    if (!result.success) {
        throw new Error(
            result.message || "Unable to load data."
        );
    }

    AppState.activities =
        Array.isArray(result.data)
            ? result.data
            : [];

    return AppState.activities;
}


/* GET DATA */

function getActivities() {
    return AppState.activities;
}


/* ADD DATA */

async function addActivity(activity) {

    const response = await fetch(
        `${CONFIG.API_URL}?action=activities`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(activity)
        }
    );

    if (!response.ok) {
        throw new Error(
            `API Error: ${response.status}`
        );
    }

    const result = await response.json();

    if (!result.success) {
        throw new Error(
            result.message
        );
    }

    AppState.activities.push(result.data);

    return result.data;
}


/* UPDATE */

async function updateActivity(id, changes) {

    const response = await fetch(
        `${CONFIG.API_URL}?action=activities`,
        {
            method: "PATCH",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                id: id,
                ...changes
            })
        }
    );

    if (!response.ok) {
        throw new Error(
            `API Error: ${response.status}`
        );
    }

    const result = await response.json();

    if (!result.success) {
        throw new Error(
            result.message
        );
    }

    const index =
        AppState.activities.findIndex(
            activity =>
                Number(activity.id) === Number(id)
        );

    if (index !== -1) {
        AppState.activities[index] =
            result.data;
    }

    return result.data;
}


/* FILTERS */

function filterByType(type) {
    AppState.filters.type = type;
}

function filterByStatus(status) {
    AppState.filters.status = status;
}

function filterByCalorieRange(min, max) {

    AppState.filters.minCal = min;
    AppState.filters.maxCal = max;

}

function updateSearchResults(query) {
    AppState.searchQuery = query || "";
}


/* APPLY FILTER */

function applyFilters() {

    const search =
        AppState.searchQuery
            .trim()
            .toLowerCase();

    return AppState.activities.filter(
        activity => {

            const matchesSearch =
                !search ||
                String(activity.name)
                    .toLowerCase()
                    .includes(search) ||
                String(activity.type)
                    .toLowerCase()
                    .includes(search);

            const matchesType =
                AppState.filters.type === "all" ||
                activity.type ===
                AppState.filters.type;

            const matchesStatus =
                AppState.filters.status === "all" ||
                activity.status ===
                AppState.filters.status;

            const calories =
                Number(
                    activity.caloriesBurned
                ) || 0;

            const matchesMin =
                AppState.filters.minCal === null ||
                calories >=
                AppState.filters.minCal;

            const matchesMax =
                AppState.filters.maxCal === null ||
                calories <=
                AppState.filters.maxCal;

            return (
                matchesSearch &&
                matchesType &&
                matchesStatus &&
                matchesMin &&
                matchesMax
            );
        }
    );
}


/* STATISTICS */

function getActivityStatistics() {

    const activities =
        AppState.activities;

    const completed =
        activities.filter(
            a => a.status === "completed"
        );

    const inProgress =
        activities.filter(
            a => a.status === "in-progress"
        );

    const missed =
        activities.filter(
            a => a.status === "missed"
        );

    const totalCalories =
        activities.reduce(
            (sum, a) =>
                sum +
                Number(
                    a.caloriesBurned || 0
                ),
            0
        );

    const heartRates =
        activities
            .map(
                a =>
                    Number(
                        a.avgHeartRate || 0
                    )
            )
            .filter(hr => hr > 0);

    const avgHeartRate =
        heartRates.length
            ? Math.round(
                heartRates.reduce(
                    (a, b) => a + b,
                    0
                ) / heartRates.length
            )
            : 0;

    return {

        latestSteps:
            calculateLatestSteps(),

        totalCalories,

        completedCount:
            completed.length,

        inProgressCount:
            inProgress.length,

        missedCount:
            missed.length,

        avgHeartRate

    };
}


/* STEPS */

function calculateLatestSteps() {

    if (AppState.activities.length === 0) {
        return 0;
    }

    const calories =
        AppState.activities.reduce(
            (sum, activity) =>
                sum +
                Number(
                    activity.caloriesBurned || 0
                ),
            0
        );

    return Math.min(
        15000,
        Math.max(
            2500,
            Math.round(calories * 12)
        )
    );
}


/* CALORIES BY TYPE */

function getCaloriesByType() {

    const map = {};

    AppState.activities.forEach(
        activity => {

            const type =
                activity.type || "Other";

            if (!map[type]) {
                map[type] = 0;
            }

            map[type] +=
                Number(
                    activity.caloriesBurned || 0
                );
        }
    );

    return Object.keys(map)
        .map(type => ({
            type: type,
            totalCalories: map[type]
        }))
        .sort(
            (a, b) =>
                b.totalCalories -
                a.totalCalories
        );
}


/* WEEKLY STEPS */

function getWeeklyStepsTrend() {

    const labels = [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun"
    ];

    const values = labels.map(
        (_, index) => {

            const activity =
                AppState.activities[index];

            if (!activity) {
                return 0;
            }

            return Math.min(
                15000,
                Math.max(
                    2000,
                    Number(
                        activity.caloriesBurned || 0
                    ) * 15
                )
            );
        }
    );

    return {
        labels,
        values
    };
}


/* TOP ACTIVITIES */

function getTopActivitiesByCalories(
    limit = 5
) {

    return [
        ...AppState.activities
    ]
        .sort(
            (a, b) =>
                Number(
                    b.caloriesBurned || 0
                ) -
                Number(
                    a.caloriesBurned || 0
                )
        )
        .slice(0, limit);
}


/* MISSED */

function getMissedActivities() {

    return AppState.activities.filter(
        activity =>
            activity.status === "missed"
    );
}


/* CSV */

function exportToCSV(activities) {

    const headers = [
        "Date",
        "Activity",
        "Type",
        "Duration",
        "Calories",
        "Heart Rate",
        "Status"
    ];

    const rows =
        activities.map(
            activity => [
                activity.date,
                activity.name,
                activity.type,
                activity.duration,
                activity.caloriesBurned,
                activity.avgHeartRate,
                activity.status
            ]
        );

    return [
        headers,
        ...rows
    ]
        .map(
            row =>
                row
                    .map(
                        value =>
                            `"${String(value ?? "")
                                .replaceAll('"', '""')}"`
                    )
                    .join(",")
        )
        .join("\n");
}


/* DOWNLOAD CSV */

function downloadCSV(
    csv,
    filename
) {

    const blob =
        new Blob(
            [csv],
            {
                type: "text/csv;charset=utf-8;"
            }
        );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);
}


/* REAL TIME */

async function simulateNewActivity() {

    const activities = [

        {
            name: "Morning Run",
            type: "Running"
        },

        {
            name: "Quick Walk",
            type: "Walking"
        },

        {
            name: "Gym Workout",
            type: "Strength"
        },

        {
            name: "Indoor Cycling",
            type: "Cycling"
        }

    ];

    const selected =
        activities[
            Math.floor(
                Math.random() *
                activities.length
            )
        ];

    const newActivity = {

        name: selected.name,

        type: selected.type,

        date:
            new Date()
                .toISOString()
                .slice(0, 16)
                .replace("T", " "),

        duration:
            Math.floor(
                Math.random() * 40
            ) + 20,

        caloriesBurned:
            Math.floor(
                Math.random() * 350
            ) + 150,

        avgHeartRate:
            Math.floor(
                Math.random() * 40
            ) + 110,

        status: "completed"

    };

    return await addActivity(
        newActivity
    );
}
