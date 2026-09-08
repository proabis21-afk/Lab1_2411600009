document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const feedbackDiv = document.getElementById("loginFeedback");

    if (localStorage.getItem("isLoggedIn") === "true") {
        window.location.href = "dashboard.html";
        return;
    }

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        feedbackDiv.innerHTML = "";

        if (username === "" || password === "") {

            showFeedback(
                "Please enter both username and password.",
                "danger"
            );

            return;
        }

        const validUsername = "admin";
        const validPassword = "password123";

        if (
            username === validUsername &&
            password === validPassword
        ) {

            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("user", username);

            showFeedback(
                "Login successful! Redirecting...",
                "success"
            );

            setTimeout(function () {
                window.location.href = "dashboard.html";
            }, 800);

        } else {

            showFeedback(
                "Invalid username or password.",
                "danger"
            );

        }

    });

    function showFeedback(message, type) {

        feedbackDiv.innerHTML = `
            <div class="alert alert-${type}" role="alert">
                ${message}
            </div>
        `;

    }

});
