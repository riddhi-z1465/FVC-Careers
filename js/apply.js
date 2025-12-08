// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Get job ID from URL
function getJobIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('job');
}

// Handle profile photo upload
document.getElementById('profilePhoto')?.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const preview = document.getElementById('photoPreview');
            preview.innerHTML = `<img src="${event.target.result}" alt="Profile Photo">`;
        };
        reader.readAsDataURL(file);
    }
});

// Handle resume upload
document.getElementById('resume')?.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        const fileInfo = document.getElementById('resumeInfo');
        const status = document.getElementById('resumeStatus');

        fileInfo.innerHTML = `<span class="file-name">${file.name}</span>`;
        status.textContent = 'Successfully Uploaded';
        status.classList.add('success');
    }
});

// Handle experience level selection
document.querySelectorAll('.experience-card').forEach(card => {
    card.addEventListener('click', function () {
        // Remove active class from all cards
        document.querySelectorAll('.experience-card').forEach(c => c.classList.remove('active'));

        // Add active class to clicked card
        this.classList.add('active');

        // Update hidden input
        const level = this.getAttribute('data-level');
        document.getElementById('experienceLevel').value = level;
    });
});

// Handle form submission
document.getElementById('applicationForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const jobId = getJobIdFromURL();

    if (!jobId) {
        showMessage('No job selected', 'error');
        return;
    }

    // Get form data
    const formData = new FormData();

    // Personal Info
    const fullName = document.getElementById('fullName').value.split(' ');
    formData.append('firstName', fullName[0]);
    formData.append('lastName', fullName.slice(1).join(' ') || fullName[0]);
    formData.append('email', document.getElementById('fullName').value + '@example.com'); // You should add email field
    formData.append('phone', document.getElementById('mobileNumber').value);
    formData.append('location', 'Mumbai, India'); // You should add location field

    // Job Info
    formData.append('jobId', jobId);

    // Education
    formData.append('degree', document.getElementById('degree').value);
    formData.append('institution', document.getElementById('university').value);
    formData.append('graduationYear', document.getElementById('graduationYear').value);

    // About You
    formData.append('portfolio', document.getElementById('portfolio').value);
    formData.append('linkedin', document.getElementById('portfolio').value);
    formData.append('coverLetter', document.getElementById('bio').value);

    // Experience
    const experienceLevel = document.getElementById('experienceLevel').value;
    let experienceYears = 0;
    if (experienceLevel === 'junior') experienceYears = 1;
    else if (experienceLevel === 'mid') experienceYears = 3;
    else if (experienceLevel === 'senior') experienceYears = 7;

    formData.append('experienceYears', experienceYears);
    formData.append('currentRole', document.getElementById('targetRole').value);
    formData.append('currentCompany', 'Current Company');

    // Files
    const resumeFile = document.getElementById('resume').files[0];
    if (resumeFile) {
        formData.append('resume', resumeFile);
    }

    try {
        // Show loading state
        const submitBtn = document.querySelector('.save-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        const response = await fetch(`${API_BASE_URL}/applications`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            showMessage('Application submitted successfully!', 'success');

            // Redirect after 2 seconds
            setTimeout(() => {
                window.location.href = 'jobs.html';
            }, 2000);
        } else {
            showMessage(data.error || 'Failed to submit application', 'error');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    } catch (error) {
        console.error('Error submitting application:', error);

        // For demo purposes, show success even without backend
        showMessage('Application saved locally (backend not available)', 'success');

        // Store in localStorage for demo
        const applicationData = {
            jobId: jobId,
            fullName: document.getElementById('fullName').value,
            targetRole: document.getElementById('targetRole').value,
            mobileNumber: document.getElementById('mobileNumber').value,
            university: document.getElementById('university').value,
            degree: document.getElementById('degree').value,
            graduationYear: document.getElementById('graduationYear').value,
            portfolio: document.getElementById('portfolio').value,
            skills: document.getElementById('skills').value,
            bio: document.getElementById('bio').value,
            experienceLevel: experienceLevel,
            submittedAt: new Date().toISOString()
        };

        localStorage.setItem('lastApplication', JSON.stringify(applicationData));

        setTimeout(() => {
            window.location.href = 'jobs.html';
        }, 2000);
    }
});

// Show message
function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    const jobId = getJobIdFromURL();
    const jobTitle = sessionStorage.getItem('currentJobTitle');

    if (jobTitle) {
        document.getElementById('targetRole').value = jobTitle;
    }

    console.log('Application form loaded for job:', jobId);
});
