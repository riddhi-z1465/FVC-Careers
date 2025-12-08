// HR Portal Login Logic

// Demo credentials (in production, use Firebase Authentication)
const DEMO_CREDENTIALS = {
    hr: {
        username: 'hr_admin',
        password: 'hr123',
        code: 'FVC2025'
    },
    admin: {
        username: 'admin',
        password: 'admin123',
        code: 'ADMIN2025'
    }
};

let currentRole = 'hr';

// Handle role tab switching
document.querySelectorAll('.role-tab').forEach(tab => {
    tab.addEventListener('click', function () {
        // Remove active class from all tabs
        document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));

        // Add active class to clicked tab
        this.classList.add('active');

        // Update current role
        currentRole = this.getAttribute('data-role');

        // Update placeholder text based on role
        updatePlaceholders(currentRole);
    });
});

// Update form placeholders based on role
function updatePlaceholders(role) {
    const usernameInput = document.getElementById('username');
    const codeInput = document.getElementById('code');

    if (role === 'hr') {
        usernameInput.placeholder = 'hr_admin';
        codeInput.placeholder = 'Enter HR code...';
    } else {
        usernameInput.placeholder = 'admin';
        codeInput.placeholder = 'Enter admin code...';
    }
}

// Handle form submission
document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Get form values
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const code = document.getElementById('code').value.trim();

    // Get submit button
    const submitBtn = document.querySelector('.login-btn');
    const originalText = submitBtn.textContent;

    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Logging in';
    submitBtn.disabled = true;

    // Remove any existing messages
    removeMessages();

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Validate credentials
    const credentials = DEMO_CREDENTIALS[currentRole];

    if (username === credentials.username &&
        password === credentials.password &&
        code === credentials.code) {

        // Success!
        showSuccess('Login successful! Redirecting...');

        // Store session
        sessionStorage.setItem('hrLoggedIn', 'true');
        sessionStorage.setItem('hrRole', currentRole);
        sessionStorage.setItem('hrUsername', username);

        // Redirect to dashboard after 1.5 seconds
        setTimeout(() => {
            window.location.href = 'hr-dashboard.html';
        }, 1500);

    } else {
        // Failed login
        submitBtn.classList.remove('loading');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        showError('Invalid credentials. Please try again.');

        // Show demo credentials hint
        console.log('Demo Credentials:');
        console.log('HR - Username: hr_admin, Password: hr123, Code: FVC2025');
        console.log('Admin - Username: admin, Password: admin123, Code: ADMIN2025');
    }
});

// Show error message
function showError(message) {
    const form = document.querySelector('.login-form');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message show';
    errorDiv.textContent = message;
    form.insertBefore(errorDiv, form.firstChild);
}

// Show success message
function showSuccess(message) {
    const form = document.querySelector('.login-form');
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message show';
    successDiv.textContent = message;
    form.insertBefore(successDiv, form.firstChild);
}

// Remove all messages
function removeMessages() {
    document.querySelectorAll('.error-message, .success-message').forEach(msg => {
        msg.remove();
    });
}

// Check if already logged in
document.addEventListener('DOMContentLoaded', function () {
    if (sessionStorage.getItem('hrLoggedIn') === 'true') {
        window.location.href = 'hr-dashboard.html';
    }

    // Show demo credentials in console
    console.log('=== HR Portal Demo Credentials ===');
    console.log('HR Role:');
    console.log('  Username: hr_admin');
    console.log('  Password: hr123');
    console.log('  Code: FVC2025');
    console.log('');
    console.log('Admin Role:');
    console.log('  Username: admin');
    console.log('  Password: admin123');
    console.log('  Code: ADMIN2025');
    console.log('================================');
});
