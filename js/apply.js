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
    const fileInfo = document.getElementById('resumeInfo');
    const status = document.getElementById('resumeStatus');

    if (file) {
        fileInfo.innerHTML = `<span class="file-name">${file.name}</span>`;
        status.textContent = 'Successfully Uploaded';
        status.classList.add('success');
    } else {
        fileInfo.innerHTML = '';
        status.textContent = '';
        status.classList.remove('success');
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
async function handleFormSubmit(e) {
    e.preventDefault();

    const jobId = getJobIdFromURL();
    if (!jobId || jobId === 'undefined' || jobId === 'null') {
        showMessage('Invalid Job ID. Please go back and select a job again.', 'error');
        return;
    }

    // Get form values
    const experienceLevel = document.getElementById('experienceLevel').value;

    // Get files (optional for now)
    const photoFile = document.getElementById('profilePhoto').files[0];
    const resumeFile = document.getElementById('resume').files[0];

    try {
        // Show loading state
        const submitBtn = document.querySelector('.save-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        // Prepare application data
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
            status: 'new',
            resumeFileName: resumeFile ? resumeFile.name : 'Not uploaded',
            photoFileName: photoFile ? photoFile.name : 'Not uploaded',
            submittedAt: new Date().toISOString()
        };

        // Check if Firebase is available and db exists
        if (typeof db !== 'undefined' && db !== null && typeof firebaseJobs !== 'undefined') {
            console.log('Using Firebase Firestore...');
            console.log('Submitting application data:', applicationData);

            try {
                // Use the centralized submitApplication function which handles storage uploads
                const result = await firebaseJobs.submitApplication(applicationData, resumeFile, photoFile);

                if (result.success) {
                    console.log('✅ Application submitted with ID:', result.id);
                    showMessage('Application submitted successfully!', 'success');

                    // Redirect after 2 seconds
                    setTimeout(() => {
                        window.location.href = 'jobs.html';
                    }, 2000);
                } else {
                    throw new Error(result.error);
                }

            } catch (firestoreError) {
                console.error('❌ Firestore error:', firestoreError);
                console.error('Error code:', firestoreError.code);
                console.error('Error message:', firestoreError.message);

                // Show user-friendly error
                if (firestoreError.code === 'permission-denied') {
                    // This error comes from Storage rules or Firestore rules
                    showMessage('Permission denied. Please check your internet connection or try again.', 'error');
                } else if (firestoreError.message.includes('Storage')) {
                    showMessage('Resume/Photo upload failed. ' + firestoreError.message, 'error');
                } else {
                    showMessage('Error: ' + firestoreError.message, 'error');
                }

                // Reset button
                const submitBtn = document.querySelector('.save-btn');
                submitBtn.textContent = 'Save Profile';
                submitBtn.disabled = false;
            }
        } else {
            // Fallback: Store in localStorage
            console.log('Firebase not available, storing locally...');
            const applications = JSON.parse(localStorage.getItem('applications') || '[]');
            applications.push(applicationData);
            localStorage.setItem('applications', JSON.stringify(applications));

            showMessage('Application saved locally (Firebase not configured)', 'success');

            setTimeout(() => {
                window.location.href = 'jobs.html';
            }, 2000);
        }
    } catch (error) {
        console.error('Error submitting application:', error);
        showMessage(error.message || 'Failed to submit application. Please try again.', 'error');

        // Reset button
        const submitBtn = document.querySelector('.save-btn');
        submitBtn.textContent = 'Save Profile';
        submitBtn.disabled = false;
    }
}

// Attach form submit handler
document.getElementById('applicationForm')?.addEventListener('submit', handleFormSubmit);

// Show message
function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-size: 16px;
    `;
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
        const targetRoleInput = document.getElementById('targetRole');
        if (targetRoleInput) {
            targetRoleInput.value = jobTitle;
        }
    }

    console.log('Application form loaded for job:', jobId);
});
