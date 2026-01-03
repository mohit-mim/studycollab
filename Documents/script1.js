// Configuration
const CONFIG = {
    JUDGE0_API_KEY: '3269b05259mshe4d5bf0db0fff35p184268jsne78ef3843394',
    JUDGE0_HOST: 'judge0-ce.p.rapidapi.com'
};

// ===== NAVIGATION FUNCTIONS =====
function navigateToDashboard() {
    console.log('Navigating to dashboard...');
    window.location.href = "mohit-proj.html";
}

function navigateToEditor() {
    console.log('Navigating to editor...');
    window.location.href = "mohit-proj1.html";
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('vsp_user');
        localStorage.removeItem('vsp_theme');
        localStorage.removeItem('selectedProject');
        localStorage.removeItem('vsp.selectedLanguage');
        window.location.href = "login.html";
    }
}

// ===== PREVENT ALL UNWANTED REDIRECTS =====
function preventAllRedirects() {
    // Prevent default for all buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function(e) {
            console.log('Button clicked:', this.textContent);
            if (!this.hasAttribute('onclick') && this.type !== 'submit') {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    });
    
    // Prevent default for all links
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
        });
    });
    
    // Prevent form submissions
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
        });
    });
}

// Language templates and rest of your existing code continues below...
const languageTemplates = {
    '63': `// JavaScript Template
function binarySearch(arr, target) {
    let left = 0, right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            return mid; // Target found
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1; // Target not found
}

// Test the function
const sortedArray = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
const targetValue = 23;
const result = binarySearch(sortedArray, targetValue);
console.log('Index of', targetValue + ':', result);`,
    // ... rest of your language templates
};

// Global variables
let monacoEditor = null;
let currentLanguage = '63';

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing application...');
    initializeApp();
    preventAllRedirects(); // Add this line
    setupEventListeners();
    loadUserData();
    initializeMonacoEditor();
    testAPIConnection();
});

// Rest of your existing functions remain the same...