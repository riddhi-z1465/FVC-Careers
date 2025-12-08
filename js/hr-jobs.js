// HR Jobs Management Logic

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
});

// Load jobs into grid
function loadJobs() {
    const jobsGrid = document.getElementById('jobsGrid');

    const html = jobsData.map(job => `
        <div class="job-card">
            <div class="job-card-header">
                <div>
                    <div class="job-title">${job.title}</div>
                    <div class="job-badges">
                        <span class="job-badge stipend">
                            ₹ ${job.type}
                        </span>
                        <span class="job-badge remote">
                            📍 ${job.location}
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
                    ${job.avatars.length > 0 ? `
                        <div class="avatar-group">
                            ${job.avatars.map(avatar => `
                                <div class="avatar">
                                    <img src="${avatar}" alt="Applicant">
                                </div>
                            `).join('')}
                        </div>
                        <button class="manage-btn" onclick="openDiscussion(${job.id})">
                            💬 ${job.discussions || 0}
                        </button>
                    ` : `
                        <button class="manage-btn" onclick="openJobPopup(${job.id})">Manage</button>
                    `}
                </div>
            </div>
        </div>
    `).join('');

    jobsGrid.innerHTML = html;
}

// Load discussions
function loadDiscussions() {
    const discussionList = document.getElementById('discussionList');

    const html = discussionThreads.map(thread => `
        <div class="discussion-item ${thread.id === 1 ? 'active' : ''}" onclick="openChat(${thread.id})">
            <div class="discussion-title">${thread.jobTitle}</div>
            <div class="discussion-count">+ ${thread.count} Online</div>
        </div>
    `).join('');

    discussionList.innerHTML = html;
}

// Open job popup
function openJobPopup(jobId) {
    const job = jobsData.find(j => j.id === jobId);
    if (!job) return;

    currentJobPopup = job;

    // Update popup content
    document.getElementById('popupJobTitle').textContent = job.title;
    document.getElementById('popupSalary').textContent = `₹ ${job.type}`;
    document.getElementById('popupLocation').textContent = `📍 ${job.location}`;
    document.getElementById('popupDescription').textContent = job.description;

    // Load applicants
    const applicants = applicantsData[jobId] || [];
    document.getElementById('applicantCount').textContent = applicants.length;

    const applicantsGrid = document.getElementById('applicantsGrid');
    applicantsGrid.innerHTML = applicants.map(applicant => `
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
                    📍 ${applicant.location}
                </div>
            </div>
            <div class="applicant-meta">
                <div class="applicant-meta-item">
                    📞 ${applicant.phone}
                </div>
            </div>
            
            <div class="applicant-actions">
                <button class="action-icon-btn" onclick="chatWithApplicant(${applicant.id})">
                    💬 Chat
                </button>
                <button class="action-icon-btn" onclick="scheduleInterview(${applicant.id})">
                    📅 Interview
                </button>
                <button class="action-icon-btn" onclick="assessApplicant(${applicant.id})">
                    📝 Assess
                </button>
            </div>
            
            <div class="applicant-decision-btns">
                <button class="decision-btn select-btn" onclick="selectApplicant(${applicant.id})">
                    ✓ Select
                </button>
                <button class="decision-btn reject-btn" onclick="rejectApplicant(${applicant.id})">
                    ✕ Reject
                </button>
            </div>
        </div>
    `).join('');

    // Show popup
    document.getElementById('jobPopupOverlay').classList.add('show');
    document.getElementById('jobPopup').classList.add('show');
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
function handleCreateJob(event) {
    event.preventDefault();

    const formData = {
        title: document.getElementById('jobTitle').value,
        salaryRange: document.getElementById('salaryRange').value,
        location: document.getElementById('jobLocation').value,
        assessmentLink: document.getElementById('assessmentLink').value,
        description: document.getElementById('jobDescription').value
    };

    console.log('Creating new job:', formData);
    alert(`Job "${formData.title}" created successfully!`);

    // Here you would send the data to your backend
    // await createJobInDatabase(formData);

    closeCreateJob();
    // Reload jobs
    loadJobs();
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

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.clear();
        window.location.href = 'hr-login.html';
    }
}
