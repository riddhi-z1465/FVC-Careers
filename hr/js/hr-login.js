// HR Portal Login Logic

// Demo credentials (in production, use Firebase Authentication)
const DEMO_CREDENTIALS = {
    hr: [
        {
            username: 'hr_admin',
            password: 'hr123',
            code: 'FVC2025'
        },
        {
            username: 'recruiter',
            password: 'rec123',
            code: 'FVC2025'
        },
        {
            username: 'hiring_manager',
            password: 'hm123',
            code: 'FVC2025'
        },
        {
            username: 'talent_scout',
            password: 'ts123',
            code: 'FVC2025'
        }
    ],
    admin: [{
        username: 'admin',
        password: 'admin123',
        code: 'ADMIN2025'
    }],
    manager: [{
        username: 'manager_demo',
        password: 'manager123',
        code: 'MANAGER2025'
    }]
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
    // Validate credentials (handle array of possible users)
    const credentialsList = DEMO_CREDENTIALS[currentRole];

    // Find matching credential
    const validUser = credentialsList.find(c =>
        c.username === username &&
        c.password === password &&
        c.code === code
    );

    if (validUser) {
        // Success!
        showSuccess('Login successful! Redirecting...');

        // Store session
        sessionStorage.setItem('hrLoggedIn', 'true');
        sessionStorage.setItem('hrRole', currentRole);
        sessionStorage.setItem('hrUsername', username);

        // Redirect based on role
        setTimeout(() => {
            console.log(`[LOGIN] Redirecting user (${currentRole}) to hr-jobs.html`);
            window.location.replace('hr-jobs.html');
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
    // Prevent infinite redirect loops
    // If we came from hr-jobs.html and are still "logged in", we might be in a loop if hr-jobs.html redirected us back.
    // However, if we came from hr-dashboard, we SHOULD redirect to hr-jobs.html if that is the target.
    // The previous logic cleared session on ANY return. We should only clear if we are stuck.

    const referrer = document.referrer;
    console.log('[LOGIN] Referrer:', referrer);

    // If we were explicitly sent back to login (e.g. from logout), session should be cleared already. 
    // If not, let's trust the session unless we see a loop pattern.
    if (referrer && referrer.includes('hr-jobs.html')) {
        // If we came from hr-jobs.html, it probably means authentication failed there or we clicked logout.
        // In either case, we should NOT auto-redirect back to hr-jobs.html immediately.
        console.log('[LOGIN] Returning from hr-jobs.html. NOT redirecting.');
        return;
    }
    if (sessionStorage.getItem('hrLoggedIn') === 'true') {
        // Always redirect to hr-jobs.html
        window.location.replace('hr-jobs.html');
    }

    // Show demo credentials in console
    console.log('=== HR Portal Demo Credentials ===');
    console.log('Internal Team (Multiple Users):');
    console.log('  1. hr_admin / hr123 / FVC2025');
    console.log('  2. recruiter / rec123 / FVC2025');
    console.log('  3. hiring_manager / hm123 / FVC2025');
    console.log('  4. talent_scout / ts123 / FVC2025');
    console.log('');
    console.log('Admin Role:');
    console.log('  Username: admin');
    console.log('  Password: admin123');
    console.log('  Code: ADMIN2025');
    console.log('');
    console.log('Manager Role:');
    console.log('  Username: manager_demo');
    console.log('  Password: manager123');
    console.log('  Code: MANAGER2025');
    console.log('================================');
});
