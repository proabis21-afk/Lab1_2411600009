document.addEventListener(
    "DOMContentLoaded",
    async function () {

        if (
            localStorage.getItem(
                "isLoggedIn"
            ) !== "true"
        ) {

            window.location.href =
                "index.html";

            return;
        }

        const username =
            localStorage.getItem("user") ||
            "User";

        document.getElementById(
            "userName"
        ).textContent = username;

        updateGreeting(username);

        setupLogout();

        showLoadingState(true);

        try {

            await initializeData();

            populateTypeFilter();

            refreshDashboard();

            attachEventListeners();

            startRealTimeSimulation();

        } catch (error) {

            console.error(error);

            alert(
                "Unable to connect to PHP API.\n\n" +
                "Make sure Apache is running and open the project using:\n" +
                "http://localhost/lab4_2411600009/"
            );

        } finally {

            showLoadingState(false);

        }

    }
);


function updateGreeting(username) {

    const hour =
        new Date().getHours();

    let greeting;

    if (hour >= 5 && hour < 12) {

        greeting = "Good Morning";

    } else if (
        hour >= 12 &&
        hour < 17
    ) {

        greeting = "Good Afternoon";

    } else if (
        hour >= 17 &&
        hour < 21
    ) {

        greeting = "Good Evening";

    } else {

        greeting = "Good Night";

    }

    document.getElementById(
        "greeting"
    ).textContent =
        `${greeting}, ${username}!`;
}


function updateStatistics() {

    const stats =
        getActivityStatistics();

    document.getElementById(
        "stat1-value"
    ).textContent =
        stats.latestSteps.toLocaleString();

    document.getElementById(
        "stat2-value"
    ).textContent =
        `${stats.totalCalories.toLocaleString()} kcal`;

    document.getElementById(
        "stat3-value"
    ).textContent =
        stats.completedCount;

    document.getElementById(
        "stat4-value"
    ).textContent =
        `${stats.avgHeartRate} bpm`;
}


function renderActivityTable(
    activities
) {

    const tableBody =
        document.getElementById(
            "activityTableBody"
        );

    tableBody.innerHTML = "";

    if (activities.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="8"
                    class="text-center text-muted py-4"
                >
                    No activities found.
                </td>
            </tr>
        `;

        return;
    }

    activities.forEach(
        activity => {

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>${activity.date}</td>

                <td>
                    ${escapeHTML(activity.name)}
                </td>

                <td>
                    ${escapeHTML(activity.type)}
                </td>

                <td>
                    ${activity.duration} min
                </td>

                <td>
                    ${activity.caloriesBurned} kcal
                </td>

                <td>
                    ${activity.avgHeartRate} bpm
                </td>

                <td>
                    <span class="badge ${getStatusClass(activity.status)}">
                        ${activity.status}
                    </span>
                </td>

                <td></td>
            `;

            const actionCell =
                row.lastElementChild;

            if (
                activity.status ===
                "in-progress"
            ) {

                const button =
                    document.createElement(
                        "button"
                    );

                button.className =
                    "btn btn-sm btn-success";

                button.textContent =
                    "Complete";

                button.addEventListener(
                    "click",
                    async function () {

                        try {

                            await updateActivity(
                                activity.id,
                                {
                                    status:
                                        "completed"
                                }
                            );

                            refreshDashboard();

                            showToast(
                                "Workout completed!"
                            );

                        } catch (error) {

                            console.error(error);

                            alert(
                                "Unable to update activity."
                            );

                        }

                    }
                );

                actionCell.appendChild(
                    button
                );

            } else {

                actionCell.textContent =
                    "—";

            }

            tableBody.appendChild(row);

        }
    );
}


function getStatusClass(status) {

    if (status === "completed") {
        return "bg-success";
    }

    if (status === "in-progress") {
        return "bg-warning text-dark";
    }

    if (status === "missed") {
        return "bg-danger";
    }

    return "bg-secondary";
}


function populateTypeFilter() {

    const select =
        document.getElementById(
            "typeFilter"
        );

    const types =
        [
            ...new Set(
                getActivities()
                    .map(
                        activity =>
                            activity.type
                    )
            )
        ];

    types.forEach(
        type => {

            const option =
                document.createElement(
                    "option"
                );

            option.value = type;
            option.textContent = type;

            select.appendChild(option);

        }
    );
}


function refreshDashboard() {

    const filtered =
        applyFilters();

    renderActivityTable(
        filtered
    );

    updateStatistics();

    renderMissedAlerts();

    refreshAllCharts();
}


function attachEventListeners() {

    document.getElementById(
        "typeFilter"
    ).addEventListener(
        "change",
        function (event) {

            filterByType(
                event.target.value
            );

            refreshDashboard();

        }
    );


    document.querySelectorAll(
        "[data-status-filter]"
    ).forEach(
        button => {

            button.addEventListener(
                "click",
                function () {

                    document.querySelectorAll(
                        "[data-status-filter]"
                    ).forEach(
                        btn =>
                            btn.classList.remove(
                                "active"
                            )
                    );

                    this.classList.add(
                        "active"
                    );

                    filterByStatus(
                        this.dataset.statusFilter
                    );

                    refreshDashboard();

                }
            );

        }
    );


    document.getElementById(
        "searchInput"
    ).addEventListener(
        "input",
        function (event) {

            updateSearchResults(
                event.target.value
            );

            refreshDashboard();

        }
    );


    document.getElementById(
        "calMin"
    ).addEventListener(
        "input",
        applyCalorieFilter
    );


    document.getElementById(
        "calMax"
    ).addEventListener(
        "input",
        applyCalorieFilter
    );


    document.getElementById(
        "exportCsvBtn"
    ).addEventListener(
        "click",
        function () {

            const data =
                applyFilters();

            const csv =
                exportToCSV(data);

            downloadCSV(
                csv,
                `activity_log_${Date.now()}.csv`
            );

            showToast(
                `Exported ${data.length} record(s).`
            );

        }
    );


    document.getElementById(
        "clearFiltersBtn"
    ).addEventListener(
        "click",
        function () {

            AppState.filters = {
                type: "all",
                status: "all",
                minCal: null,
                maxCal: null
            };

            AppState.searchQuery = "";

            document.getElementById(
                "typeFilter"
            ).value = "all";

            document.getElementById(
                "searchInput"
            ).value = "";

            document.getElementById(
                "calMin"
            ).value = "";

            document.getElementById(
                "calMax"
            ).value = "";

            document.querySelectorAll(
                "[data-status-filter]"
            ).forEach(
                button =>
                    button.classList.remove(
                        "active"
                    )
            );

            document.querySelector(
                '[data-status-filter="all"]'
            ).classList.add(
                "active"
            );

            refreshDashboard();

        }
    );
}


function applyCalorieFilter() {

    const min =
        parseFloat(
            document.getElementById(
                "calMin"
            ).value
        );

    const max =
        parseFloat(
            document.getElementById(
                "calMax"
            ).value
        );

    filterByCalorieRange(
        Number.isNaN(min)
            ? null
            : min,

        Number.isNaN(max)
            ? null
            : max
    );

    refreshDashboard();
}


function renderMissedAlerts() {

    const container =
        document.getElementById(
            "alertContainer"
        );

    const missed =
        getMissedActivities();

    if (missed.length === 0) {

        container.classList.add(
            "d-none"
        );

        return;
    }

    container.classList.remove(
        "d-none"
    );

    container.innerHTML = `
        <div class="alert alert-warning">
            <strong>
                ⚠ Low Activity Alert:
            </strong>
            ${missed.length}
            workout(s) need attention.
        </div>
    `;
}


function startRealTimeSimulation() {

    setInterval(
        async function () {

            try {

                const newActivity =
                    await simulateNewActivity();

                refreshDashboard();

                showToast(
                    `New activity synced: ${newActivity.name}`
                );

            } catch (error) {

                console.error(
                    "Real-time update failed:",
                    error
                );

            }

        },
        CONFIG.REFRESH_INTERVAL_MS
    );
}


function showToast(message) {

    const toastElement =
        document.getElementById(
            "liveToast"
        );

    document.getElementById(
        "toastBody"
    ).textContent = message;

    const toast =
        new bootstrap.Toast(
            toastElement
        );

    toast.show();
}


function showLoadingState(
    loading
) {

    const overlay =
        document.getElementById(
            "loadingOverlay"
        );

    if (!overlay) return;

    if (loading) {

        overlay.style.display =
            "flex";

    } else {

        overlay.style.display =
            "none";

    }
}


function setupLogout() {

    function logout(event) {

        if (event) {
            event.preventDefault();
        }

        localStorage.removeItem(
            "isLoggedIn"
        );

        localStorage.removeItem(
            "user"
        );

        window.location.href =
            "index.html";
    }

    document.getElementById(
        "logoutBtn"
    ).addEventListener(
        "click",
        logout
    );

    document.getElementById(
        "logoutLink"
    ).addEventListener(
        "click",
        logout
    );
}


function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;
}
