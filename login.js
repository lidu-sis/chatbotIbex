// Google OAuth Configuration
const CLIENT_ID = '249382766368-8idv5sht3m47lbt17ro08744g6amff3h.apps.googleusercontent.com'; // Replace with your Google Client ID
const REDIRECT_URI = window.location.origin + '/chatbot.html';

// Get the base URL (without path)
const baseUrl = window.location.origin;

// Add Ethiopian greeting animation
function addEthiopianGreeting() {
    const wrapper = document.querySelector('.wrapper');
    const greetingDiv = document.createElement('div');
    greetingDiv.className = 'ethiopian-greeting';
    greetingDiv.innerHTML = '<span>እንኳን ደህና መጡ</span>';
    wrapper.insertBefore(greetingDiv, wrapper.firstChild);
    
    setTimeout(() => {
        greetingDiv.style.opacity = '0';
        setTimeout(() => greetingDiv.remove(), 1000);
    }, 3000);
}

// Login form handling
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById("login-form");
    if (!loginForm) return;

    // Add Ethiopian greeting
    addEthiopianGreeting();

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value;
        const errorMessage = document.getElementById("login-error-message");
        
        if (!email || !password) {
            errorMessage.style.color = "var(--accent-color)";
            errorMessage.textContent = "እባክዎ ሁሉንም ቦታዎች ይሙሉ! (Please fill out all fields!)";
            return;
        }
        
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find((u) => u.email === email && u.password === password);
        
        if (!user) {
            errorMessage.style.color = "var(--accent-color)";
            errorMessage.textContent = "ልክ ያልሆነ ኢሜል ወይም የይለፍ ቃል። እባክዎ እንደገና ይሞክሩ! (Invalid email or password!)";
            return;
        }
        
        // Set authentication token
        const authToken = generateAuthToken();
        const userSession = {
            email: user.email,
            name: user.name,
            authToken: authToken,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem("currentUser", JSON.stringify(userSession));
        
        errorMessage.style.color = "var(--primary-color)";
        errorMessage.textContent = "በተሳካ ሁኔታ ገብተዋል! እየተዛወሩ ነው... (Login successful! Redirecting...)";
        setTimeout(() => {
            window.location.href = "chatbot.html";
        }, 1000);
    });
});

// Generate a random auth token
function generateAuthToken() {
    return 'auth_' + Math.random().toString(36).substr(2) + Date.now().toString(36);
}

// Check authentication status
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || !currentUser.authToken) {
        window.location.href = "login.html";
        return false;
    }
    return true;
}

// Google OAuth handling
function handleGoogleSignIn(response) {
    console.log("Google Sign-In Response received"); // For debugging
    
    if (!response || !response.credential) {
        console.error("Invalid Google sign-in response");
        showError("Google sign-in failed. Please try again.");
        return;
    }

    try {
        const credential = response.credential;
        const decodedToken = JSON.parse(atob(credential.split('.')[1]));
        console.log("Sign-in successful for email:", decodedToken.email);
        
        // Create user object from Google data
        const googleUser = {
            email: decodedToken.email,
            name: decodedToken.name,
            picture: decodedToken.picture,
            authToken: generateAuthToken(),
            loginTime: new Date().toISOString(),
            isGoogleUser: true
        };
        
        // Save user to localStorage
        localStorage.setItem("currentUser", JSON.stringify(googleUser));
        
        // Show success and redirect
        showSuccess("Login successful! Redirecting...");
        setTimeout(() => {
            window.location.href = "chatbot.html";
        }, 1000);
    } catch (error) {
        console.error("Error processing Google sign-in:", error);
        showError("Error processing Google sign-in. Please try again.");
    }
}

// Initialize Google Sign-In
window.onload = function() {
    console.log("Initializing Google Sign-In...");
    console.log("Current origin:", baseUrl); // This will help debug

    google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleGoogleSignIn,
        auto_select: false,
        cancel_on_tap_outside: true
    });
    
    google.accounts.id.renderButton(
        document.querySelector(".g_id_signin"),
        { 
            theme: "outline", 
            size: "large",
            width: 250,
            text: "continue_with"
        }
    );
}

// Helper functions
function showError(message) {
    const errorMessage = document.getElementById("login-error-message");
    if (errorMessage) {
        errorMessage.style.color = "var(--accent-color)";
        errorMessage.textContent = message;
    }
}

function showSuccess(message) {
    const errorMessage = document.getElementById("login-error-message");
    if (errorMessage) {
        errorMessage.style.color = "var(--primary-color)";
        errorMessage.textContent = message;
    }
}

// Logout function
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

// Protect chat page
if (window.location.pathname.includes('chatbot.html')) {
    if (!checkAuth()) {
        window.location.href = "login.html";
    }
}