// HR Jobs Management Logic

// Check authentication
if (sessionStorage.getItem('hrLoggedIn') !== 'true') {
    window.location.href = 'hr-login.html';
}

// Sample jobs data
const jobsData = [
    {
        id: 1,
        title: 'HR Intern',
        type: 'Stipend Based',
        location: 'Remote',
        applicants: 0,
        description: 'An HR intern assists with recruiting, onboarding, employee records, and administrative tasks to support day-to-day HR operations function.',
        avatars: [],
        discussions: 4
    },
    {
        id: 2,
        title: 'QA Assistant Intern',
        type: 'Stipend Based',
        location: 'Remote',
        applicants: 1,
        description: 'A QA Assistant Intern helps test software, document defects, verify fixes, and support quality-assurance processes to ensure the product meets required standards before release.',
        avatars: ['https://i.pravatar.cc/32?img=2', 'https://i.pravatar.cc/32?img=3', 'https://i.pravatar.cc/32?img=4'],
        discussions: 0
    },
    {
        id: 3,
        title: 'Quality Assurance Intern',
        type: '7000',
        location: 'Remote',
        applicants: 8,
        description: 'A Quality Assurance Intern supports testing activities by executing test cases, identifying defects, documenting results, and assisting the QA team in ensuring the product meets quality and performance...',
        avatars: [],
        discussions: 0
    },
    {
        id: 4,
        title: 'Vibe Coding Intern',
        type: '8000',
        location: 'Remote',
        applicants: 16,
        description: 'A Vibe Coding Intern contributes to frontend and interactive design work by implementing UI elements, refining animations or micro-interactions, and supporting developers in creating smooth, respon...',
        avatars: ['https://i.pravatar.cc/32?img=5', 'https://i.pravatar.cc/32?img=6'],
        discussions: 1
    }
];

// Discussion threads
const discussionThreads = [
    {
        id: 1,
        jobId: 1,
        jobTitle: 'HR Intern',
        count: 4,
        messages: [
            {
                sender: 'Sarah Connors',
                avatar: 'https://i.pravatar.cc/32?img=10',
                content: 'Hi candidate!',
                timestamp: '10:30 AM'
            },
            {
                sender: 'Sarah Connors',
                avatar: 'https://i.pravatar.cc/32?img=10',
                content: 'We\'re so excited to invite you for an interview! Please join us here on Wednesday at 2 PM. Check your application tab.',
                timestamp: '10:31 AM'
            },
            {
                sender: 'Sarah Connors',
                avatar: 'https://i.pravatar.cc/32?img=10',
                content: 'We can\'t wait to see you! Please complete it within 24 hours. Check your application tab.',
                timestamp: '10:32 AM',
                action: 'Favor you do better'
            },
            {
                sender: 'Wanda Maxwell',
                avatar: 'https://i.pravatar.cc/32?img=11',
                content: 'question should be answered as there was delay in posting question',
                timestamp: '10:35 AM',
                action: 'I agree'
            }
        ]
    },
    {
        id: 2,
        jobId: 2,
        jobTitle: 'QA Assistant Intern',
        count: 0,
        messages: []
    },
    {
        id: 3,
        jobId: 4,
        jobTitle: 'Vibe Coding Intern',
        count: 1,
        messages: [
            {
                sender: 'John Doe',
                avatar: 'https://i.pravatar.cc/32?img=12',
                content: 'Looking forward to the interview!',
                timestamp: '2:15 PM'
            }
        ]
    }
];

// Sample applicants data
const applicantsData = {
    3: [ // Quality Assurance Intern
        {
            id: 1,
            name: 'Riddhi Zunjarrao',
            role: 'Vibe-coding Intern',
            avatar: 'https://i.pravatar.cc/48?img=20',
            university: 'ITM Skills University',
            location: 'B.tech CSE (2026)',
            phone: '6376617231',
            linkedin: true,
            resume: true,
            status: 'submitted',
            statusText: 'Assessment Submitted'
        },
        {
            id: 2,
            name: 'Ayush Anchore',
            role: 'Founder',
            avatar: 'https://i.pravatar.cc/48?img=21',
            university: 'NITK',
            location: 'B.tech (2020)',
            phone: '7719090064',
            linkedin: true,
            resume: true,
            status: 'view-submission',
            statusText: 'Assessment Sent'
        },
        {
            id: 3,
            name: 'Kruti Mehta',
            role: 'Vibe-coding Intern',
            avatar: 'https://i.pravatar.cc/48?img=22',
            university: '------',
            location: '------',
            phone: '9182909064',
            linkedin: true,
            resume: true,
            status: 'assessment',
            statusText: 'Rejected'
        },
        {
            id: 4,
            name: 'Kiran Baby',
            role: 'Vibe-coding Intern',
            avatar: 'https://i.pravatar.cc/48?img=23',
            university: 'University of Hertfordshire',
            location: 'B.tech (2020)',
            phone: '9182909064',
            linkedin: true,
            resume: true,
            status: 'view-submission',
            statusText: 'Assessment Sent'
        },
        {
            id: 5,
            name: 'Ayush Anchore',
            role: '------',
            avatar: 'https://i.pravatar.cc/48?img=24',
            university: 'NITK',
            location: 'B.tech (2020)',
            phone: '7719090064',
            linkedin: true,
            resume: true,
            status: 'view-submission',
            statusText: 'Assessment Sent'
        },
        {
            id: 6,
            name: 'Riddhi Zunjarrao',
            role: 'Vibe-coding Intern',
            avatar: 'https://i.pravatar.cc/48?img=25',
            university: 'ITM Skills University',
            location: 'B.tech CSE (2026)',
            phone: '6376617231',
            linkedin: true,
            resume: true,
            status: 'submitted',
            statusText: 'Assessment Submitted'
        }
    ]
};

let currentChatJob = null;
let currentJobPopup = null;

// Load jobs on page load
document.addEventListener('DOMContentLoaded', function () {
    loadJobs();
    loadDiscussions();
    loadStats();
});

// Load and update statistics
// Load and update statistics
async function loadStats() {
    try {
        let activeJobsCount = 0;
        let totalApplicantsCount = 0;
        let pendingReviewsCount = 0;
        let pastJobsCount = 0;

        // Fetch jobs from Firebase
        let usedFirebase = false;

        if (typeof firebaseJobs !== 'undefined' && firebaseJobs.fetchJobs) {
            try {
                const jobsResult = await firebaseJobs.fetchJobs();

                if (jobsResult.success && jobsResult.data) {
                    usedFirebase = true;
                    // Count active jobs (isActive = true)
                    activeJobsCount = jobsResult.data.filter(job => job.isActive === true).length;

                    // Count past jobs (isActive = false)
                    pastJobsCount = jobsResult.data.filter(job => job.isActive === false).length;

                    // Sum up all applicants from all jobs
                    totalApplicantsCount = jobsResult.data.reduce((sum, job) => {
                        return sum + (job.applicationsCount || 0);
                    }, 0);
                }
            } catch (e) {
                console.warn('[STATS] Firebase fetch failed, falling back to mock data');
            }
        }

        // Fallback to mock data if Firebase wasn't used
        if (!usedFirebase) {
            console.log('[STATS] Using mock data');

            // Get local storage jobs count
            let localCount = 0;
            let localApplicants = 0;
            try {
                const stored = JSON.parse(localStorage.getItem('fvc_jobs_local_storage') || '[]');
                localCount = stored.length;
                localApplicants = stored.reduce((sum, j) => sum + (j.applicationsCount || 0), 0);
            } catch (e) {
                console.error('[STATS] Error reading local storage:', e);
            }

            // Mock Data Calculation
            activeJobsCount = jobsData.length + localCount;

            // Calculate total applicants from jobsData + local storage
            totalApplicantsCount = jobsData.reduce((sum, job) => {
                return sum + (job.applicants || 0);
            }, 0) + localApplicants;

            // Mock values for stats not fully represented in simple jobsData
            pendingReviewsCount = 5; // Default mock value
            pastJobsCount = 3;       // Default mock value
        }

        // Fetch applications to get pending reviews count (Firebase only)
        if (usedFirebase && typeof firebaseJobs !== 'undefined' && firebaseJobs.fetchAllApplications) {
            try {
                const applicationsResult = await firebaseJobs.fetchAllApplications();

                if (applicationsResult.success && applicationsResult.data) {
                    // Count applications with status 'pending' or 'under_review'
                    pendingReviewsCount = applicationsResult.data.filter(app =>
                        app.status === 'pending' || app.status === 'under_review'
                    ).length;
                }
            } catch (e) {
                console.warn('[STATS] Firebase applications fetch failed');
            }
        }

        // Update the UI
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };

        setVal('activeJobsCount', activeJobsCount);
        setVal('totalApplicantsCount', totalApplicantsCount);
        setVal('pendingReviewsCount', pendingReviewsCount);
        setVal('pastJobsCount', pastJobsCount);

        console.log('[STATS] Updated:', {
            activeJobs: activeJobsCount,
            totalApplicants: totalApplicantsCount,
            pendingReviews: pendingReviewsCount,
            pastJobs: pastJobsCount
        });
    } catch (error) {
        console.error('[ERROR] Error loading stats:', error);
    }
}

// Load jobs into grid
async function loadJobs() {
    const jobsGrid = document.getElementById('jobsGrid');
    let jobs = [];

    try {
        // Try to fetch jobs from Firebase
        if (typeof firebaseJobs !== 'undefined' && firebaseJobs.fetchJobs) {
            console.log('[INFO] Fetching jobs from Firebase...');
            const result = await firebaseJobs.fetchJobs();

            if (result.success && result.data && result.data.length > 0) {
                console.log(`[SUCCESS] Loaded ${result.data.length} jobs from Firebase`);
                jobs = result.data.map(job => ({
                    id: job.id,
                    title: job.title || 'Untitled Job',
                    type: job.salaryRange || 'Not specified',
                    location: job.location || 'Not specified',
                    applicants: job.applicationsCount || 0,
                    description: job.description || 'No description available',
                    avatars: [],
                    discussions: 0
                }));
            } else {
                console.log('[INFO] No jobs in Firebase, using mock data');
                jobs = jobsData;
            }
        } else {
            console.log('[INFO] Firebase not available, using mock data');
            jobs = jobsData;
        }
    } catch (error) {
        console.error('[ERROR] Error fetching jobs:', error);
        console.log('[INFO] Falling back to mock data');
        jobs = jobsData;
    }

    // Merge shared localStorage jobs (from both hr-jobs and jobs.js context)
    // Only if we are falling back to mock jobs (checking if jobs === jobsData is unsafe if we modified it, so just check if we have any jobs or if we want to enforce local ones)
    // We'll enforce local ones always if they exist, assuming they are "new" jobs not present in static data.

    if (jobs === jobsData || jobs.length === 0) { // Simple check: if using mock data
        try {
            const stored = JSON.parse(localStorage.getItem('fvc_jobs_local_storage') || '[]');
            if (stored.length > 0) {
                const storedMapped = stored.map((s, index) => ({
                    id: s.id || `local-${index}`,
                    title: s.title,
                    type: s.salaryRange,
                    location: s.location,
                    applicants: s.applicationsCount || 0,
                    description: s.description,
                    avatars: [],
                    discussions: 0
                }));
                // Add to top of list
                // Filter out any that might have been added to jobsData in-memory to avoid duplicates?
                // If we remove the in-memory push in handleCreateJob, we don't need to filter.
                // For now, let's just prepend.
                jobs = [...storedMapped.reverse(), ...jobs];
            }
        } catch (e) {
            console.error('Error loading local storage jobs in hr-jobs:', e);
        }
    }

    // Save to global state for popups
    window.currentRenderedJobs = jobs;

    const html = jobs.map(job => `
        <div class="job-card">
            <div class="job-card-header">
                <div>
                    <div class="job-title">${job.title}</div>
                    <div class="job-badges">
                        <span class="job-badge stipend">
                            ₹ ${job.type}
                        </span>
                        <span class="job-badge remote">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline-block; vertical-align: middle; margin-right: 4px;">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                            ${job.location}
                        </span>
                    </div>
                </div>
                <div class="applicants-count">
                    <div>${job.applicants}</div>
                    <div class="applicants-label">Applicants</div>
                </div>
            </div>
            
            <div class="job-description">
                <h4>About</h4>
                <p>${job.description}</p>
            </div>
            
            <div class="job-footer">
                <div class="applicant-avatars">
                    ${job.avatars && job.avatars.length > 0 ? `
                        <div class="avatar-group" onclick="openJobPopup('${job.id}')" style="cursor: pointer;" title="View Applicants">
                            ${job.avatars.map(avatar => `
                                <div class="avatar">
                                    <img src="${avatar}" alt="Applicant">
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                    <button class="manage-btn" onclick="openJobPopup('${job.id}')">Manage</button>
                    ${job.discussions > 0 ? `
                    <button class="action-icon-btn" onclick="openDiscussion('${job.id}')" title="Discussions">
                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                             <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"></path>
                         </svg>
                         ${job.discussions}
                    </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');

    jobsGrid.innerHTML = html || '<p style="text-align: center; padding: 40px; color: #676767;">No jobs available. Create your first job!</p>';
}

// Load discussions
function loadDiscussions() {
    const discussionList = document.getElementById('discussionList');
    if (!discussionList) return;

    const html = discussionThreads.map(thread => `
        <div class="discussion-item ${thread.id === 1 ? 'active' : ''}" onclick="openChat(${thread.id})">
            <div class="discussion-title">${thread.jobTitle}</div>
            <div class="discussion-count">+ ${thread.count} Online</div>
        </div>
    `).join('');

    discussionList.innerHTML = html;
}

// Open job popup
async function openJobPopup(jobId) {
    // Look in the currently rendered jobs first (supports Firebase/Local)
    let job = window.currentRenderedJobs ? window.currentRenderedJobs.find(j => String(j.id) === String(jobId)) : null;

    // Fallback to static data if not found
    if (!job) {
        job = jobsData.find(j => String(j.id) === String(jobId));
    }

    if (!job) {
        console.error('Job not found:', jobId);
        return;
    }

    currentJobPopup = job;

    // Update popup content
    document.getElementById('popupJobTitle').textContent = job.title;
    document.getElementById('popupSalary').textContent = `₹ ${job.type}`;
    document.getElementById('popupLocation').textContent = `📍 ${job.location}`;
    document.getElementById('popupDescription').textContent = job.description;

    // Show loading state for applicants
    document.getElementById('applicantCount').textContent = '...';
    const applicantsGrid = document.getElementById('applicantsGrid');
    applicantsGrid.innerHTML = '<div style="text-align:center; padding: 20px;">Loading applicants...</div>';

    // Show popup immediately
    document.getElementById('jobPopupOverlay').classList.add('show');
    document.getElementById('jobPopup').classList.add('show');

    // Fetch Applicants Logic
    let allApplicants = [];

    // 1. Try Firebase
    if (typeof firebaseJobs !== 'undefined' && firebaseJobs.getApplicationsByJob) {
        try {
            console.log(`[INFO] Fetching applications for job ${jobId} from Firebase...`);
            const result = await firebaseJobs.getApplicationsByJob(String(jobId));
            if (result.success && result.data) {
                console.log(`[SUCCESS] Found ${result.data.length} applicants in Firebase`);
                allApplicants = [...allApplicants, ...result.data.map(app => ({
                    id: app.id,
                    name: app.fullName,
                    role: app.targetRole,
                    avatar: app.photoURL || 'https://i.pravatar.cc/150?u=' + app.id,
                    university: app.university,
                    location: app.mobileNumber || 'Not specified', // Using mobile as generic info
                    phone: app.mobileNumber,
                    linkedin: !!app.portfolio,
                    resume: app.resumeURL, // Pass the URL directly
                    status: app.status || 'new',
                    statusText: app.status || 'Received'
                }))];
            }
        } catch (e) {
            console.error('Error fetching from Firebase:', e);
        }
    }

    // 2. Try Local Storage
    try {
        const localApps = JSON.parse(localStorage.getItem('applications') || '[]');
        const filteredLocal = localApps.filter(app => String(app.jobId) === String(jobId));
        console.log(`[INFO] Found ${filteredLocal.length} applicants in LocalStorage`);

        allApplicants = [...allApplicants, ...filteredLocal.map((app, index) => ({
            id: `local-${app.id || index}`, // Use app.id if available, otherwise index
            name: app.fullName,
            role: app.targetRole,
            avatar: 'https://i.pravatar.cc/150?u=' + (app.id || index), // Placeholder
            university: app.university,
            location: app.mobileNumber,
            phone: app.mobileNumber,
            linkedin: !!app.portfolio,
            resume: app.resumeURL || true, // Local apps imply resume uploaded conceptually, or use URL if present
            status: app.status || 'new',
            statusText: app.status || 'Received'
        }))];
    } catch (e) {
        console.error('Error fetching from LocalStorage:', e);
    }

    // 3. Fallback/Merge Mock Data (only if we didn't find "real" data or you want to mix them)
    // For now, let's keep mock data if we found NOTHING else, to avoid empty states in demo
    if (allApplicants.length === 0) {
        const mockApps = applicantsData[jobId] || [];
        allApplicants = [...mockApps];
    }

    // Render Applicants
    document.getElementById('applicantCount').textContent = allApplicants.length;

    if (allApplicants.length === 0) {
        applicantsGrid.innerHTML = '<div style="text-align:center; padding: 20px; color: #666;">No applicants yet.</div>';
    } else {
        applicantsGrid.innerHTML = allApplicants.map(applicant => `
            <div class="applicant-card">
                <div class="applicant-header">
                    <div class="applicant-info">
                        <div class="applicant-avatar">
                            <img src="${applicant.avatar}" alt="${applicant.name}">
                        </div>
                        <div class="applicant-details">
                            <div class="applicant-name">${applicant.name}</div>
                            <div class="applicant-role">${applicant.role}</div>
                        </div>
                    </div>
                    <span class="applicant-status ${applicant.status}">${applicant.statusText}</span>
                </div>
                
                <div class="applicant-meta">
                    <div class="applicant-meta-item">
                        🎓 ${applicant.university}
                    </div>
                </div>
                <div class="applicant-meta">
                    <div class="applicant-meta-item">
                        📞 ${applicant.phone}
                    </div>
                </div>
                
                <div class="applicant-actions">
                    <button class="action-icon-btn" onclick="chatWithApplicant('${applicant.id}')">
                        💬 Chat
                    </button>
                    ${applicant.resume ? `
                    <button class="action-icon-btn" onclick="window.open('${applicant.resume}', '_blank')">
                        📄 Resume
                    </button>` : ''}
                    <button class="action-icon-btn" onclick="assessApplicant('${applicant.id}')">
                        📝 Assess
                    </button>
                </div>
                
                <div class="applicant-decision-btns">
                    <button class="decision-btn select-btn" onclick="selectApplicant('${applicant.id}')">
                        ✓ Select
                    </button>
                    <button class="decision-btn reject-btn" onclick="rejectApplicant('${applicant.id}')">
                        ✕ Reject
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Close job popup
function closeJobPopup() {
    document.getElementById('jobPopupOverlay').classList.remove('show');
    document.getElementById('jobPopup').classList.remove('show');
    currentJobPopup = null;
}

// Applicant actions
function chatWithApplicant(applicantId) {
    alert(`Opening chat with applicant ${applicantId}`);
}

function scheduleInterview(applicantId) {
    alert(`Scheduling interview for applicant ${applicantId}`);
}

function assessApplicant(applicantId) {
    alert(`Opening assessment for applicant ${applicantId}`);
}

function selectApplicant(applicantId) {
    if (confirm('Are you sure you want to select this applicant?')) {
        alert(`Applicant ${applicantId} selected!`);
    }
}

function rejectApplicant(applicantId) {
    // Store the applicant ID for later use
    window.pendingRejectId = applicantId;

    // Show reject confirmation dialog
    document.getElementById('rejectOverlay').classList.add('show');
    document.getElementById('rejectDialog').classList.add('show');
}

// Close reject dialog
function closeRejectDialog() {
    document.getElementById('rejectOverlay').classList.remove('show');
    document.getElementById('rejectDialog').classList.remove('show');
    window.pendingRejectId = null;
}

// Confirm reject
function confirmReject() {
    const applicantId = window.pendingRejectId;
    if (applicantId) {
        alert(`Applicant ${applicantId} has been rejected.`);
        closeRejectDialog();
        // Here you would update the applicant status in the database
    }
}

// Open discussion panel
function openDiscussion(jobId) {
    const panel = document.getElementById('discussionPanel');
    panel.classList.remove('hidden');

    const mainContent = document.querySelector('.main-content');
    mainContent.classList.remove('full-width');
}

// Close discussion panel
function closeDiscussion() {
    const panel = document.getElementById('discussionPanel');
    panel.classList.add('hidden');

    const mainContent = document.querySelector('.main-content');
    mainContent.classList.add('full-width');
}

// Open chat modal
function openChat(threadId) {
    const thread = discussionThreads.find(t => t.id === threadId);
    if (!thread) return;

    currentChatJob = thread;

    const chatModal = document.getElementById('chatModal');
    const chatTitle = document.getElementById('chatJobTitle');
    const chatMessages = document.getElementById('chatMessages');

    chatTitle.textContent = thread.jobTitle;

    // Load messages
    const messagesHtml = thread.messages.map(msg => `
        <div class="message">
            <div class="message-header">
                <div class="message-avatar">
                    <img src="${msg.avatar}" alt="${msg.sender}">
                </div>
                <div class="message-name">${msg.sender}</div>
            </div>
            <div class="message-content">${msg.content}</div>
            ${msg.action ? `<div class="message-action">${msg.action}</div>` : ''}
        </div>
    `).join('');

    chatMessages.innerHTML = messagesHtml;
    chatModal.classList.add('show');

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Close chat modal
function closeChat() {
    const chatModal = document.getElementById('chatModal');
    chatModal.classList.remove('show');
    currentChatJob = null;
}

// Send message
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();

    if (!message || !currentChatJob) return;

    const chatMessages = document.getElementById('chatMessages');

    const newMessage = {
        sender: 'You',
        avatar: 'https://i.pravatar.cc/32?img=1',
        content: message,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    currentChatJob.messages.push(newMessage);

    const messageHtml = `
        <div class="message">
            <div class="message-header">
                <div class="message-avatar">
                    <img src="${newMessage.avatar}" alt="${newMessage.sender}">
                </div>
                <div class="message-name">${newMessage.sender}</div>
            </div>
            <div class="message-content">${newMessage.content}</div>
        </div>
    `;

    chatMessages.insertAdjacentHTML('beforeend', messageHtml);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    input.value = '';
}

// Handle Enter key in message input
document.getElementById('messageInput')?.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Open create job popup
function openCreateJob() {
    document.getElementById('createJobOverlay').classList.add('show');
    document.getElementById('createJobPopup').classList.add('show');
}

// Close create job popup
function closeCreateJob() {
    document.getElementById('createJobOverlay').classList.remove('show');
    document.getElementById('createJobPopup').classList.remove('show');
    document.getElementById('createJobForm').reset();
}

// Handle create job form submission
async function handleCreateJob(event) {
    event.preventDefault();

    console.log('[INFO] handleCreateJob called');

    try {
        // Get form values first
        const title = document.getElementById('jobTitle')?.value || '';
        const salaryRange = document.getElementById('salaryRange')?.value || '';
        const location = document.getElementById('jobLocation')?.value || '';
        const assessmentLink = document.getElementById('assessmentLink')?.value || '';
        const description = document.getElementById('jobDescription')?.value || '';

        console.log('[INFO] Form values:', { title, salaryRange, location, description });

        // Validate required fields
        if (!title || !location || !description) {
            alert('Please fill in all required fields (Title, Location, Description)');
            return;
        }

        // Create job data object
        const jobData = {
            title: title,
            salaryRange: salaryRange,
            location: location,
            assessmentLink: assessmentLink,
            description: description,
            // Add additional required fields
            company: 'FVC',
            jobType: 'Full-time',
            experience: 'Mid',
            qualifications: ['Bachelors'],
            skills: [],
            requirements: [description],
            responsibilities: [],
            isActive: true,
            applicationsCount: 0
        };

        console.log('[INFO] Job data prepared:', jobData);

        // Check if Firebase is available
        if (typeof firebaseJobs !== 'undefined' && firebaseJobs.addJob) {
            console.log('[FIREBASE] Calling Firebase addJob...');
            const result = await firebaseJobs.addJob(jobData);

            console.log('[RESPONSE] Firebase result:', result);

            if (result.success) {
                alert(`Job "${jobData.title}" created successfully!`);
                closeCreateJob();
                // Reload jobs to show the newly created job
                await loadJobs();
                await loadStats();
            } else {
                alert('Error creating job: ' + result.error);
            }
        } else {
            console.warn('[WARNING] Firebase not available');

            // Save to localStorage for jobs.html visibility
            try {
                const storedJobs = JSON.parse(localStorage.getItem('fvc_jobs_local_storage') || '[]');
                storedJobs.push({
                    _id: 'local-' + Date.now(),
                    ...jobData,
                    isActive: true,
                    createdAt: new Date().toISOString()
                });
                localStorage.setItem('fvc_jobs_local_storage', JSON.stringify(storedJobs));
                console.log('[INFO] Job saved to localStorage');
            } catch (e) {
                console.error('[ERROR] Failed to save to localStorage', e);
            }

            // Fallback for demo
            alert(`Job "${jobData.title}" created successfully! (Firebase not configured)`);
            closeCreateJob();

            // Reload jobs and stats
            await loadJobs();
            await loadStats();
        }
    } catch (error) {
        console.error('[ERROR] Error in handleCreateJob:', error);
        alert('Error creating job: ' + error.message);
    }
}

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

// Add click handler to + button in sidebar to open create job popup
document.addEventListener('DOMContentLoaded', function () {
    const addButton = document.querySelector('.nav-item:last-of-type');
    if (addButton) {
        addButton.addEventListener('click', function (e) {
            e.preventDefault();
            openCreateJob();
        });
    }
});

// Delete current job
async function deleteCurrentJob() {
    if (!currentJobPopup) return;

    // Check if it's a "demo" job (ids 1-4 usually) - optional protection
    // if ([1, 2, 3, 4].includes(currentJobPopup.id)) {
    //    alert("You cannot delete demo jobs.");
    //    return;
    // }

    if (!confirm(`Are you sure you want to delete the job position "${currentJobPopup.title}"? This action cannot be undone.`)) {
        return;
    }

    const jobId = currentJobPopup.id;
    console.log('[DELETE] Attempting to delete job:', jobId);

    try {
        let deleted = false;

        // 1. Try Firebase Deletion
        if (typeof firebaseJobs !== 'undefined' && firebaseJobs.deleteJob) {
            // Only try if it looks like a firebase ID (string, not number 1-4) or if we just try anyway
            // Simple heuristic: if it's not in the static jobsData array, it might be firebase/local
            // But we can just try calling the API.
            try {
                const result = await firebaseJobs.deleteJob(String(jobId));
                if (result.success) {
                    deleted = true;
                    console.log('[DELETE] Deleted from Firebase');
                }
            } catch (e) {
                console.warn('[DELETE] Firebase delete failed (might be local or not found)', e);
            }
        }

        // 2. Try LocalStorage Deletion (always try this to clean up hybrids)
        const storedJobs = JSON.parse(localStorage.getItem('fvc_jobs_local_storage') || '[]');
        const verifyIndex = storedJobs.findIndex(j => String(j._id || j.id) === String(jobId));

        if (verifyIndex !== -1) {
            storedJobs.splice(verifyIndex, 1);
            localStorage.setItem('fvc_jobs_local_storage', JSON.stringify(storedJobs));
            deleted = true;
            console.log('[DELETE] Deleted from LocalStorage');
        }

        // 3. Fallback/Success handling
        if (deleted) {
            alert('Job deleted successfully.');
            closeJobPopup();
            await loadJobs(); // Refresh grid
            await loadStats(); // Refresh stats

            // If the deleted job was active in chat, close it
            if (currentChatJob && String(currentChatJob.id) === String(jobId)) {
                closeChat();
                loadDiscussions(); // Refresh discussion list
            }
        } else {
            // It might be a static mock job
            alert('This is a demo job and cannot be permanently deleted in this preview.');
            closeJobPopup();
        }

    } catch (error) {
        console.error('[DELETE] Error:', error);
        alert('An error occurred while deleting the job.');
    }
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.clear();
        window.location.href = 'hr-login.html';
    }
}
