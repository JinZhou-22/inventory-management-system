document.addEventListener("DOMContentLoaded", function() {
    // To verify if the user has already accepted cookies, check LocalStorage
    if (!localStorage.getItem("cookiesAccepted")) {
        document.getElementById("cookie-banner").style.display = "block";
    }
    // To accept cookies, add an event listener to the Accept button
    document.getElementById("accept-cookies").addEventListener("click", function() {
        localStorage.setItem("cookiesAccepted", "true");
        document.getElementById("cookie-banner").style.display = "none";
    });
});