const CHART_COLORS = {

    primary: "#264653",

    secondary: "#2A9D8F",

    accent: "#E9C46A",

    lightAccent: "#F4A261",

    danger: "#E76F51"

};

const ChartRegistry = {};


function destroyChart(key) {

    if (ChartRegistry[key]) {

        ChartRegistry[key].destroy();

        delete ChartRegistry[key];

    }

}


/* CHART 1 */

function renderCaloriesByTypeChart() {

    const canvas =
        document.getElementById(
            "chartCaloriesByType"
        );

    if (!canvas) return;

    destroyChart(
        "chartCaloriesByType"
    );

    const summary =
        getCaloriesByType();

    ChartRegistry[
        "chartCaloriesByType"
    ] = new Chart(
        canvas,
        {

            type: "bar",

            data: {

                labels:
                    summary.map(
                        item =>
                            item.type
                    ),

                datasets: [

                    {

                        label:
                            "Calories Burned",

                        data:
                            summary.map(
                                item =>
                                    item.totalCalories
                            ),

                        backgroundColor:
                            CHART_COLORS.secondary

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    }

                }

            }

        }
    );
}


/* CHART 2 */

function renderStatusDistributionChart() {

    const canvas =
        document.getElementById(
            "chartStatusDistribution"
        );

    if (!canvas) return;

    destroyChart(
        "chartStatusDistribution"
    );

    const stats =
        getActivityStatistics();

    ChartRegistry[
        "chartStatusDistribution"
    ] = new Chart(
        canvas,
        {

            type: "doughnut",

            data: {

                labels: [
                    "Completed",
                    "In Progress",
                    "Missed"
                ],

                datasets: [

                    {

                        data: [
                            stats.completedCount,
                            stats.inProgressCount,
                            stats.missedCount
                        ],

                        backgroundColor: [
                            CHART_COLORS.secondary,
                            CHART_COLORS.accent,
                            CHART_COLORS.danger
                        ]

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false

            }

        }
    );
}


/* CHART 3 */

function renderWeeklyStepsChart() {

    const canvas =
        document.getElementById(
            "chartWeeklySteps"
        );

    if (!canvas) return;

    destroyChart(
        "chartWeeklySteps"
    );

    const trend =
        getWeeklyStepsTrend();

    ChartRegistry[
        "chartWeeklySteps"
    ] = new Chart(
        canvas,
        {

            type: "line",

            data: {

                labels:
                    trend.labels,

                datasets: [

                    {

                        label:
                            "Daily Steps",

                        data:
                            trend.values,

                        borderColor:
                            CHART_COLORS.primary,

                        backgroundColor:
                            "rgba(38,70,83,0.12)",

                        fill: true,

                        tension: 0.3

                    },

                    {

                        label:
                            "Goal",

                        data:
                            trend.labels.map(
                                () =>
                                    CONFIG.DAILY_STEP_GOAL
                            ),

                        borderColor:
                            CHART_COLORS.danger,

                        borderDash: [
                            5,
                            5
                        ],

                        pointRadius: 0

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false

            }

        }
    );
}


/* CHART 4 */

function renderTopActivitiesChart() {

    const canvas =
        document.getElementById(
            "chartTopActivities"
        );

    if (!canvas) return;

    destroyChart(
        "chartTopActivities"
    );

    const top =
        getTopActivitiesByCalories(5);

    ChartRegistry[
        "chartTopActivities"
    ] = new Chart(
        canvas,
        {

            type: "bar",

            data: {

                labels:
                    top.map(
                        activity =>
                            activity.name
                    ),

                datasets: [

                    {

                        label:
                            "Calories Burned",

                        data:
                            top.map(
                                activity =>
                                    activity.caloriesBurned
                            ),

                        backgroundColor:
                            CHART_COLORS.lightAccent

                    }

                ]

            },

            options: {

                indexAxis: "y",

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    }

                }

            }

        }
    );
}


function refreshAllCharts() {

    renderCaloriesByTypeChart();

    renderStatusDistributionChart();

    renderWeeklyStepsChart();

    renderTopActivitiesChart();

}
