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
        avatars: [
            'https://i.pravatar.cc/32?img=12',
            'https://i.pravatar.cc/32?img=11',
            'https://i.pravatar.cc/32?img=5',
            'https://i.pravatar.cc/32?img=3',
            'https://i.pravatar.cc/32?img=9'
        ],
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
            linkedin: 'https://www.linkedin.com/in/riddhi-zunjarrao-03916931a/',
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
            avatar: null, // Testing initials fallback
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
            linkedin: 'https://www.linkedin.com/in/riddhi-zunjarrao-03916931a/',
            resume: true,
            status: 'submitted',
            statusText: 'Assessment Submitted'
        }
    ]
};

let currentChatJob = null;
let currentJobPopup = null;


// Load jobs on page load
// Load jobs on page load
document.addEventListener('DOMContentLoaded', async function () {
    await loadJobs(); // Wait for jobs to populate first (so titles resolve correctly)

    // Restore active tab from session or default to 'internal'
    const savedTab = sessionStorage.getItem('hrDiscussionTab') || 'internal';
    setDiscussionTab(savedTab);

    loadStats();
});

function setDiscussionTab(tab) {
    currentDiscussionTab = tab;
    sessionStorage.setItem('hrDiscussionTab', tab); // Persist state

    // Update Tab UI
    document.querySelectorAll('.discussion-tab').forEach(t => {
        if (t.dataset.tab === tab) t.classList.add('active');
        else t.classList.remove('active');
    });

    loadDiscussions();
}

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
            console.log('[STATS] Using mock/local data');

            // Re-calculate based on what loadJobs() actually loaded
            // We can re-use the logic or just count the static items correctly

            // 1. Calculate Active Jobs
            // Static jobs (jobsData) are all active by default in this demo + local jobs
            let localJobs = [];
            try {
                localJobs = JSON.parse(localStorage.getItem('fvc_jobs_local_storage') || '[]');
            } catch (e) { }

            activeJobsCount = jobsData.length + localJobs.length;

            // 2. Calculate Total Applicants
            // We must use the REAL count (applicantsData length), not the stale 'applicants' property in jobsData
            let staticApplicantsSum = 0;
            // Iterate directly over applicantsData for known job IDs (1, 2, 3, 4 are the static job IDs)
            // Note: jobsData has IDs 1 (HR Intern), 2 (QA Assistant), 3 (QA Intern), 4 (Vibe coding)
            // applicantsData uses keys that match these IDs.
            // Current keys in applicantsData: '3' (QA Intern) -> 6 applicants.
            // Wait, looking at applicantsData structure above line 118:
            // Key '3' has an array of 6 objects.
            // Do we have applicants for other jobs? Currently applicantsData only has key '3'.
            // Therefore, Total Applicants should strictly be the sum of lengths of all arrays in applicantsData.

            Object.values(applicantsData).forEach(list => {
                if (Array.isArray(list)) {
                    staticApplicantsSum += list.length;
                }
            });

            // Add applicants from local jobs
            let localApplicantsSum = 0;
            localJobs.forEach(job => {
                // Local jobs might have avatars array directly or just a count
                // For now, assume count is in applicationsCount or avatars length
                if (job.avatars && Array.isArray(job.avatars)) {
                    localApplicantsSum += job.avatars.length;
                } else {
                    localApplicantsSum += (job.applicationsCount || 0);
                }
            });

            totalApplicantsCount = staticApplicantsSum + localApplicantsSum;

            // 3. Pending Reviews & Past Jobs
            // "Pending Reviews" usually means status is not 'rejected' or 'hired'. 
            // We can iterate applicantsData to find this relative to our mock data.
            let pendingSum = 0;
            // Iterate over all arrays in applicantsData
            Object.values(applicantsData).forEach(apps => {
                apps.forEach(app => {
                    // Pending usually means not rejected or hired yet.
                    if (app.status !== 'rejected' && app.status !== 'hired') {
                        pendingSum++;
                    }
                });
            });

            pendingReviewsCount = pendingSum;
            pastJobsCount = 0; // We don't have a "past jobs" array in mock data currently
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

    // 1. Fetch all applications first to get avatars for the cards
    let allApplications = [];
    try {
        if (typeof firebaseJobs !== 'undefined' && firebaseJobs.fetchAllApplications) {
            const appsResult = await firebaseJobs.fetchAllApplications();
            if (appsResult.success && appsResult.data) {
                allApplications = appsResult.data;
            }
        }
    } catch (e) {
        console.warn('Error fetching firebase applications for avatars:', e);
    }

    // Merge with local storage applications
    try {
        const localApps = JSON.parse(localStorage.getItem('applications') || '[]');
        if (localApps.length > 0) {
            allApplications = [...allApplications, ...localApps];
        }
    } catch (e) {
        console.warn('Error fetching local applications for avatars:', e);
    }

    // Merge static applicantsData for consistent display
    try {
        if (typeof applicantsData !== 'undefined') {
            Object.keys(applicantsData).forEach(jobId => {
                const staticApps = applicantsData[jobId];
                if (Array.isArray(staticApps)) {
                    const mappedApps = staticApps.map(app => ({
                        jobId: jobId,
                        fullName: app.name,
                        photoURL: app.avatar,
                        // Add other fields if necessary for uniqueness matching
                        id: `static_${app.id}`
                    }));
                    // Avoid duplicates if they already exist in allApplications (simple check)
                    // Currently just creating a merged list. Real-app would be smarter.
                    allApplications = [...allApplications, ...mappedApps];
                }
            });
        }
    } catch (e) {
        console.warn('Error merging static applicants:', e);
    }

    // Helper to get real avatars for a job
    const getJobAvatars = (jobId) => {
        const jobApps = allApplications.filter(app => String(app.jobId) === String(jobId));
        return jobApps.slice(0, 4).map(app => {
            if (app.photoURL && app.photoURL.length > 0) {
                return { type: 'image', value: app.photoURL };
            } else {
                const name = app.fullName || app.name || '?';
                return { type: 'initials', value: name.charAt(0).toUpperCase() };
            }
        });
    };

    // Helper to generate mock avatars (fallback) - keep these as images for demo data consistency
    const getMockAvatars = (count) => {
        if (!count) return [];
        return Array.from({ length: Math.min(count, 4) }, (_, i) =>
            ({ type: 'image', value: `https://i.pravatar.cc/32?img=${Math.floor(Math.random() * 70)}` })
        );
    };

    try {
        // Try to fetch jobs from Firebase
        if (typeof firebaseJobs !== 'undefined' && firebaseJobs.fetchJobs) {
            console.log('[INFO] Fetching jobs from Firebase...');
            const result = await firebaseJobs.fetchJobs();

            if (result.success && result.data && result.data.length > 0) {
                console.log(`[SUCCESS] Loaded ${result.data.length} jobs from Firebase`);
                jobs = result.data.map(job => {
                    const realAvatars = getJobAvatars(job.id);
                    // Use actual count of known applicants if available locally/cached, otherwise fallback to job property
                    const actualCount = realAvatars.length > 0 ? realAvatars.length : (job.applicationsCount || 0);
                    return {
                        id: job.id,
                        title: job.title || 'Untitled Job',
                        type: job.salaryRange || 'Not specified',
                        location: job.location || 'Not specified',
                        applicants: actualCount,
                        description: job.description || 'No description available',
                        avatars: realAvatars.length > 0 ? realAvatars : getMockAvatars(actualCount),
                        discussions: 0
                    };
                });
            } else {
                console.log('[INFO] No jobs in Firebase, using mock data');
                jobs = jobsData.map(j => {
                    const realAvatars = getJobAvatars(j.id);
                    // STRICT MODE: Only show real data. No dummy profiles.
                    const count = realAvatars.length;
                    return {
                        ...j,
                        applicants: count,
                        avatars: realAvatars
                    };
                });
            }
        } else {
            console.log('[INFO] Firebase not available, using mock data');
            jobs = jobsData.map(j => {
                const realAvatars = getJobAvatars(j.id);
                const count = realAvatars.length;
                return {
                    ...j, // keeps id, title, description, etc.
                    applicants: count,
                    avatars: realAvatars
                };
            });
        }
    } catch (error) {
        console.error('[ERROR] Error fetching jobs:', error);
        console.log('[INFO] Falling back to mock data');
        jobs = jobsData.map(j => {
            const realAvatars = getJobAvatars(j.id);
            const count = realAvatars.length;
            return {
                ...j,
                applicants: count,
                avatars: realAvatars
            };
        });
    }

    // Merge shared localStorage jobs (from both hr-jobs and jobs.js context)
    // Only if we are falling back to mock jobs (checking if jobs === jobsData is unsafe if we modified it, so just check if we have any jobs or if we want to enforce local ones)
    // We'll enforce local ones always if they exist, assuming they are "new" jobs not present in static data.

    if (jobs === jobsData || jobs.length === 0 || !typeof firebaseJobs) {
        try {
            const stored = JSON.parse(localStorage.getItem('fvc_jobs_local_storage') || '[]');
            if (stored.length > 0) {
                const storedMapped = stored.map((s, index) => {
                    const realAvatars = getJobAvatars(s.id);
                    const count = realAvatars.length > 0 ? realAvatars.length : (s.applicationsCount || 0);
                    return {
                        id: s.id || `local-${index}`,
                        title: s.title,
                        type: s.salaryRange,
                        location: s.location,
                        applicants: count,
                        description: s.description,
                        avatars: realAvatars.length > 0 ? realAvatars : getMockAvatars(s.applicationsCount || 0),
                        discussions: 0
                    };
                });
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
                <div class="footer-left-group">
                    <button class="action-icon-btn" onclick="openChat('internal_${job.id}')" title="Internal Team Chat">
                         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                             <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"></path>
                         </svg>
                    </button>
                    ${job.avatars && job.avatars.length > 0 ? `
                        <div class="avatar-group" onclick="openJobPopup('${job.id}')" style="cursor: pointer;" title="View Applicants">
                            ${job.avatars.map(avatar => `
                                <div class="avatar" style="background-color: ${avatar.type === 'image' ? '#eee' : '#FFE5E8'}; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; color: ${avatar.type === 'image' ? '#555' : '#D63031'};">
                                    ${avatar.type === 'image'
            ? `<img src="${avatar.value}" alt="Applicant">`
            : `${avatar.value}`}
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
                <button class="manage-btn" onclick="openJobPopup('${job.id}')">Manage</button>
            </div>
        </div>
    `).join('');

    jobsGrid.innerHTML = html || '<p style="text-align: center; padding: 40px; color: #676767;">No jobs available. Create your first job!</p>';
}

// Helper to get job title
function getJobTitle(jobId) {
    if (window.currentRenderedJobs) {
        const j = window.currentRenderedJobs.find(x => String(x.id) === String(jobId));
        if (j) return j.title;
    }
    const k = jobsData.find(x => String(x.id) === String(jobId));
    if (k) return k.title;
    return 'Unknown Job';
}

let currentDiscussionTab = 'internal';



function clearLocalChats() {
    if (confirm('Are you sure you want to clear all local chat history? This cannot be undone.')) {
        const keys = Object.keys(localStorage);
        const toRemove = keys.filter(k => k.startsWith('local_chat_'));
        toRemove.forEach(k => localStorage.removeItem(k));
        loadDiscussions();
    }
}

// Load discussions (Active Chats)
async function loadDiscussions() {
    const discussionList = document.getElementById('discussionList');
    if (!discussionList) return;

    discussionList.innerHTML = '<div style="padding: 20px; text-align: center; color: #888;">Loading...</div>';

    if (currentDiscussionTab === 'internal') {
        // INTERNAL TEAM CHATS (Mocked based on Active Jobs)
        let jobs = window.currentRenderedJobs || jobsData; // Use currently loaded jobs

        if (jobs.length === 0) {
            discussionList.innerHTML = '<p style="padding:20px; text-align:center; color:#888;">No active jobs for internal discussion.</p>';
            return;
        }

        const html = jobs.map(job => {
            // Get actual avatars for this job
            let avatarsHtml = '';

            // Re-use logic to get real avatars
            // We need to access getJobAvatars logic or similar. 
            // Since getJobAvatars is scoped inside loadJobs, we might need to rely on the job.avatars property if populated
            // OR re-implement simple logic.

            if (job.applicants > 0 && job.avatars && job.avatars.length > 0) {
                avatarsHtml = job.avatars.slice(0, 2).map(avatar => `
                    <div class="avatar">
                        ${avatar.type === 'image'
                        ? `<img src="${avatar.value}" alt="User">`
                        : `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#eee; color:#555; font-weight:bold; font-size:12px;">${avatar.value}</div>`
                    }
                    </div>
                 `).join('');
            } else {
                // Fallback if no applicants - show nothing or a generic "Team" icon?
                // User request: "correct applicant number as there are no applicant then alos profile is seen"
                // Meaning: Don't show applicant profiles if there are 0 applicants.
                // We'll show a generic team icon or just keep it minimal.
                // Let's show a single generic placeholder for "Internal Team" itself if no applicants.
                avatarsHtml = `
                    <div class="avatar" style="background:#f0f0f0; display:flex; align-items:center; justify-content:center;">
                        <span style="color:#aaa; font-weight:bold; font-size:10px;">IT</span>
                    </div>
                 `;
            }

            return `
            <div class="discussion-item" onclick="openChat('internal_${job.id}')">
                <div>
                    <div class="discussion-title">${job.title}</div>
                    <div class="discussion-subtitle">Internal Team</div>
                </div>
                <div class="discussion-avatars">
                    ${avatarsHtml}
                </div>
            </div>
            `;
        }).join('');

        discussionList.innerHTML = html;

    } else {
        // CANDIDATES CHATS (Real Logic)
        let allChats = [];

        // 0. Fetch Applications from Firebase (for avatars/details)
        if (typeof firebaseJobs !== 'undefined' && firebaseJobs.fetchAllApplications) {
            try {
                // Check if we need to fetch or if recently fetched? 
                // For now, fetch to be safe and fresh.
                const appsResult = await firebaseJobs.fetchAllApplications();
                if (appsResult.success) {
                    window.firebaseApplicationsCache = appsResult.data;
                }
            } catch (e) { console.warn('Error fetching firebase apps for discussions', e); }
        }

        // 1. Fetch from Firebase Check Messages
        if (typeof firebaseJobs !== 'undefined' && firebaseJobs.fetchAllChats) {
            try {
                const result = await firebaseJobs.fetchAllChats();
                if (result.success) {
                    allChats = result.data.map(c => ({
                        id: c.id,
                        jobId: c.jobId,
                        applicantName: c.applicantName,
                        lastMessage: c.messages && c.messages.length ? c.messages[c.messages.length - 1].content : 'New conversation',
                        timestamp: c.lastUpdated,
                        source: 'firebase'
                    }));
                }
            } catch (e) {
                console.warn('Error fetching chats:', e);
            }
        }

        // 2. Fetch from Local Storage
        try {
            const keys = Object.keys(localStorage);
            for (const key of keys) {
                if (key.startsWith('local_chat_')) {
                    // Skip metadata keys
                    if (key.startsWith('local_chat_meta_')) continue;

                    // Check for metadata
                    let meta = {};
                    try {
                        meta = JSON.parse(localStorage.getItem(`local_chat_meta_${key}`) || '{}');
                    } catch (e) { }

                    // SKIP Internal Chats in this list (they are in the other tab)
                    if (key.includes('internal') || key.includes('static') || meta.isInternal) {
                        continue;
                    }

                    const msgs = JSON.parse(localStorage.getItem(key) || '[]');
                    if (msgs.length > 0) {
                        const lastMsg = msgs[msgs.length - 1];
                        allChats.push({
                            id: key,
                            jobId: meta.jobId || 'Unknown',
                            applicantName: meta.applicantName || (msgs.find(m => m.sender !== 'HR')?.sender || 'Applicant'),
                            lastMessage: lastMsg.content,
                            timestamp: lastMsg.timestamp,
                            source: 'local',
                            avatar: meta.avatarValue // Optional avatar from meta
                        });
                    }
                }
            }
        } catch (e) {
            console.warn('Error reading local chats:', e);
        }

        // Filter out chats that don't map to a known active job (e.g. "past" or "stale" chats)
        allChats = allChats.filter(chat => {
            const resolvedTitle = getJobTitle(chat.jobId);
            // If we found a real title in active jobs list, keep it
            if (resolvedTitle !== 'Unknown Job') return true;

            // If the chat has a specific stored title that ISN'T the generic fallback, keep it
            if (chat.jobTitle && chat.jobTitle !== 'Job Application') return true;

            // Otherwise, it's a "Job Application" / Unknown / Past job -> Remove it
            return false;
        });

        // Check if no chats found
        if (allChats.length === 0) {
            discussionList.innerHTML = '<p style="padding:20px; text-align:center; color:#888;">No candidate conversations yet.</p>';
            return;
        }

        // Render Candidate Chats
        const html = allChats.map(chat => {
            const jobTitle = getJobTitle(chat.jobId) !== 'Unknown Job' ? getJobTitle(chat.jobId) : (chat.jobTitle || 'Job Application');

            // Dynamic Lookup for Real Applicant Profile
            let realAvatarUrl = chat.avatar;
            let detailText = "1 year experience"; // Default fallback

            // Search in Applications (Firebase + Local Storage)
            try {
                let foundApp;

                // 1. Try Firebase Applications (if we fetched them earlier or fetch now)
                if (typeof firebaseJobs !== 'undefined' && window.firebaseApplicationsCache) {
                    // Check cache first
                    if (chat.jobId && chat.jobId !== 'Unknown') {
                        foundApp = window.firebaseApplicationsCache.find(a =>
                            (a.fullName === chat.applicantName || a.name === chat.applicantName) &&
                            String(a.jobId) === String(chat.jobId)
                        );
                    }
                    if (!foundApp) {
                        foundApp = window.firebaseApplicationsCache.find(a => (a.fullName === chat.applicantName || a.name === chat.applicantName));
                    }
                }

                // 2. Try Local Storage 'applications' if not found in Firebase cache
                if (!foundApp) {
                    const storedApps = JSON.parse(localStorage.getItem('applications') || '[]');
                    if (chat.jobId && chat.jobId !== 'Unknown' && chat.jobId !== 'Unknown Job') {
                        foundApp = storedApps.find(a =>
                            (a.fullName === chat.applicantName || a.name === chat.applicantName) &&
                            String(a.jobId) === String(chat.jobId)
                        );
                    }
                    if (!foundApp) {
                        foundApp = storedApps.find(a => (a.fullName === chat.applicantName || a.name === chat.applicantName));
                    }
                }

                if (foundApp) {
                    // Always prefer the photo from the application if it exists
                    if (foundApp.photoURL) realAvatarUrl = foundApp.photoURL;

                    if (foundApp.jobRole) detailText = foundApp.jobRole;
                    else if (foundApp.yearsOfExperience) detailText = `${foundApp.yearsOfExperience} years experience`;
                    else if (foundApp.email) detailText = foundApp.email;
                }
            } catch (e) {
                console.warn('Error lookup applications for chat', e);
            }

            // Search in applicantsData (Static fallback)
            if (typeof applicantsData !== 'undefined') {
                // 1. Try specific job ID first (Most accurate)
                if (chat.jobId && applicantsData[chat.jobId]) {
                    const found = applicantsData[chat.jobId].find(a => a.name === chat.applicantName);
                    if (found) {
                        if (!realAvatarUrl && found.avatar) realAvatarUrl = found.avatar;
                        // Improve detail text
                        if (detailText === "1 year experience") {
                            if (found.location && found.location !== '------') detailText = found.location;
                            else if (found.university && found.university !== '------') detailText = found.university;
                        }
                    }
                }

                // 2. Fallback to searching all jobs if not found in specific job (or avatar still missing)
                if (!realAvatarUrl || detailText === "1 year experience") {
                    for (const [jId, apps] of Object.entries(applicantsData)) {
                        // Skip if we already checked this jobId above
                        if (String(jId) === String(chat.jobId)) continue;

                        const found = apps.find(a => a.name === chat.applicantName);
                        if (found) {
                            if (!realAvatarUrl && found.avatar) realAvatarUrl = found.avatar;
                            if (detailText === "1 year experience") {
                                if (found.location && found.location !== '------') detailText = found.location;
                                else if (found.university && found.university !== '------') detailText = found.university;
                            }
                            // Don't break immediately, keep creating best match, or break if satisfied?
                            if (realAvatarUrl && detailText !== "1 year experience") break;
                        }
                    }
                }
            }

            // Determine avatar
            let avatarHtml = '';
            if (realAvatarUrl) {
                avatarHtml = `<img src="${realAvatarUrl}" alt="${chat.applicantName}">`;
            } else {
                const initials = chat.applicantName.charAt(0).toUpperCase();
                avatarHtml = `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#eee; color:#555; font-weight:bold;">${initials}</div>`;
            }

            return `
            <div class="discussion-item candidate-layout" onclick="openChat('${chat.id}')">
                <div class="candidate-header-row">
                    <div class="avatar-small">
                        ${avatarHtml}
                    </div>
                    <div class="candidate-name-title">${chat.applicantName}</div>
                </div>
                <div class="candidate-divider-line"></div>
                <div class="candidate-footer-row">
                    <span class="job-role-text">${jobTitle}</span>
                    <span class="separator-dot">|</span>
                    <span class="experience-text">${detailText}</span>
                </div>
            </div>
            `;
        }).join('');

        discussionList.innerHTML = html;
    }
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
                    avatar: app.photoURL && app.photoURL.length > 0 ? app.photoURL : null,
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
            avatar: null, // Local apps don't have photo uploads fully wired to persistent URLs without Firebase Storage, so default to null (initials) to avoid broken images or random faces
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

    // Filter out soft-deleted mocks
    try {
        const deletedMocks = JSON.parse(sessionStorage.getItem('deletedMockIds') || '[]');
        if (deletedMocks.length > 0) {
            allApplicants = allApplicants.filter(app => !deletedMocks.includes(String(app.id)));
        }
    } catch (e) {
        console.warn('Error filtering deleted mocks:', e);
    }

    // Cache applicants for later updates (select/reject etc.)
    window.currentApplicants = allApplicants;
    window.currentApplicantsJobId = jobId;

    // Render Applicants
    document.getElementById('applicantCount').textContent = allApplicants.length;

    if (allApplicants.length === 0) {
        applicantsGrid.innerHTML = '<div style="text-align:center; padding: 20px; color: #666;">No applicants yet.</div>';
    } else {
        applicantsGrid.innerHTML = allApplicants.map(applicant => `
            <div class="applicant-card" data-applicant-id="${applicant.id}" data-job-id="${jobId}">
                <!-- Top Row: Profile + Status -->
                <div class="applicant-top-row">
                    <div class="applicant-profile">
                        <div class="applicant-avatar" style="background-color: ${applicant.avatar ? 'transparent' : '#FFE5E8'}; display: flex; align-items: center; justify-content: center;">
                            ${applicant.avatar ?
                `<img src="${applicant.avatar}" alt="${applicant.name}">` :
                `<span style="font-size: 18px; font-weight: 700; color: #D63031;">${applicant.name ? applicant.name.charAt(0).toUpperCase() : '?'}</span>`
            }
                        </div>
                        <div class="applicant-identity">
                            <div class="applicant-name">${applicant.name}</div>
                            <div class="applicant-role">${applicant.role}</div>
                        </div>
                    </div>
                    <div class="applicant-status-container">
                        <span class="applicant-status-badge ${applicant.status}" data-applicant-status="${applicant.status}">${applicant.statusText}</span>
                        <a href="#" class="view-submission-link">View Submission</a>
                    </div>
                </div>

                <!-- Education Row -->
                <div class="applicant-info-row education-row">
                    <div class="info-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 10v6M2 10l10-5 10 5-10 5-10 5z"></path>
                            <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                        </svg>
                    </div>
                    <div class="education-details">
                        <div class="uni-name">${applicant.university}</div>
                        <div class="degree-year">${applicant.location}</div>
                    </div>
                </div>

                <!-- Contact Row -->
                <div class="applicant-info-row contact-row">
                    <div class="contact-item">
                        <span class="icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.12 2h3a2 2 0 012 1.72 12.05 12.05 0 00.57 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.03 12.03 0 002.81.57A2 2 0 0122 16.92z"></path>
                            </svg>
                        </span>
                        ${applicant.phone}
                    </div>
                    <div class="contact-item clickable" onclick="window.open('${(typeof applicant.linkedin === 'string' && applicant.linkedin.length > 5) ? applicant.linkedin : 'https://www.linkedin.com/search/results/all/?keywords=' + encodeURIComponent(applicant.name)}', '_blank')">
                        <span class="icon">
                             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"></path>
                                <rect x="2" y="9" width="4" height="12"></rect>
                                <circle cx="4" cy="4" r="2"></circle>
                            </svg>
                        </span>
                        LinkedIn
                    </div>
                    ${applicant.resume ? `
                    <div class="contact-item clickable" onclick="window.open('${applicant.resume}', '_blank')">
                        <span class="icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                        </span>
                        View Resume
                    </div>` : ''}
                </div>

                <!-- Action Buttons Row -->
                <div class="applicant-actions-row">
                    <button class="action-btn chat-btn" onclick="chatWithApplicant('${applicant.id}')">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px;">
                            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"></path>
                        </svg>
                        Chat
                    </button>
                    <button class="action-btn interview-btn" onclick="scheduleInterview('${applicant.id}')">
                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px;">
                            <polygon points="23 7 16 12 23 17 23 7"></polygon>
                            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                        </svg>
                        Interview
                    </button>
                    <button class="action-btn assess-btn" onclick="assessApplicant('${applicant.id}')">
                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px;">
                            <path d="M9 11l3 3L22 4"></path>
                            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                        </svg>
                        Assess
                    </button>
                </div>

                <!-- Decision Buttons Row -->
                <div class="applicant-decision-row">
                    <button class="decision-btn select-btn" onclick="selectApplicant('${applicant.id}')">
                        Select
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left: 6px;">
                             <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                             <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    </button>
                    <button class="decision-btn reject-btn" onclick="rejectApplicant('${applicant.id}')">
                        Reject
                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left: 6px;">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Close chat modal
function closeChat() {
    const chatModal = document.getElementById('chatModal');
    if (chatModal) {
        chatModal.classList.remove('show');
    }
    currentChatJob = null;

    // Stop listening
    if (currentChatUnsubscribe) {
        if (typeof currentChatUnsubscribe === 'function') currentChatUnsubscribe();
        currentChatUnsubscribe = null;
    }
}
window.closeChat = closeChat; // Explicitly expose to window for onclick handlers

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

async function selectApplicant(applicantId) {
    if (!applicantId) return;
    const confirmed = confirm('Are you sure you want to select this applicant?');
    if (!confirmed) return;

    await updateApplicantStatus(applicantId, 'selected', 'Selected');
    alert(`Applicant ${applicantId} selected!`);
}

function rejectApplicant(applicantId) {
    // Store the applicant ID for later use
    window.pendingRejectId = applicantId;

    // Show reject confirmation dialog
    document.getElementById('rejectOverlay').classList.add('show');
    document.getElementById('rejectDialog').classList.add('show');
}

function closeRejectDialog() {
    document.getElementById('rejectOverlay').classList.remove('show');
    document.getElementById('rejectDialog').classList.remove('show');
    window.pendingRejectId = null;
}

async function confirmReject() {
    if (!window.pendingRejectId) {
        closeRejectDialog();
        return;
    }
    await updateApplicantStatus(window.pendingRejectId, 'rejected', 'Rejected');
    closeRejectDialog();
    alert(`Applicant ${window.pendingRejectId} rejected.`);
}

async function updateApplicantStatus(applicantId, status, statusText) {
    try {
        // Update cached data for current popup
        if (Array.isArray(window.currentApplicants)) {
            const target = window.currentApplicants.find(a => String(a.id) === String(applicantId));
            if (target) {
                target.status = status;
                target.statusText = statusText;
            }
        }

        // Update DOM badge
        const card = document.querySelector(`.applicant-card[data-applicant-id="${applicantId}"]`);
        if (card) {
            const badge = card.querySelector('.applicant-status-badge');
            if (badge) {
                badge.textContent = statusText;
                badge.className = `applicant-status-badge ${status}`;
                badge.setAttribute('data-applicant-status', status);
            }
        }

        // Persist to localStorage applications (if present)
        try {
            const apps = JSON.parse(localStorage.getItem('applications') || '[]');
            const idx = apps.findIndex(app => String(app.id || app.applicationId || app.appId) === String(applicantId));
            if (idx !== -1) {
                apps[idx].status = status;
                apps[idx].statusText = statusText;
                localStorage.setItem('applications', JSON.stringify(apps));
            }
        } catch (e) {
            console.warn('Could not update local applications storage', e);
        }

        // Persist to Firebase if available
        if (typeof firebaseJobs !== 'undefined' && firebaseJobs.updateApplicationStatus) {
            try {
                await firebaseJobs.updateApplicationStatus(applicantId, status, statusText);
            } catch (e) {
                console.warn('Firebase status update failed', e);
            }
        }
    } catch (error) {
        console.error('Error updating applicant status:', error);
    }
}

// Helper to get job title
function getJobTitle(jobId, chatId) {
    // 1. Try Metadata (Most reliable for local chats)
    if (chatId) {
        try {
            const meta = JSON.parse(localStorage.getItem(`local_chat_meta_${chatId}`) || 'null');
            if (meta && meta.jobTitle) return meta.jobTitle;
        } catch (e) { }
    }

    // 2. Try Current Rendered Jobs
    if (window.currentRenderedJobs) {
        const j = window.currentRenderedJobs.find(x => String(x.id) === String(jobId));
        if (j) return j.title;
    }

    // 3. Try Static Data
    const k = jobsData.find(x => String(x.id) === String(jobId));
    if (k) return k.title;

    // 4. Try Local Storage Jobs
    try {
        const localJobs = JSON.parse(localStorage.getItem('fvc_jobs_local_storage') || '[]');
        const l = localJobs.find(x => String(x.id || x._id) === String(jobId));
        if (l) return l.title;
    } catch (e) { }

    return 'Unknown Job';
}



// Open chat modal (from Discussion List)
function openChat(threadId) {
    // 1. Check if we have an "upgraded" version of this static thread in local storage
    // This happens if a user sent a message to a static thread (ID 1, 2, etc.)
    const potentialLocalId = `local_chat_static_${threadId}`;
    if (localStorage.getItem(potentialLocalId)) {
        // Switch to the local version which has the history + new messages
        threadId = potentialLocalId;
    }

    // Find in candidate list first (static data) - if we haven't switched to local
    let thread = discussionThreads.find(t => String(t.id) === String(threadId));

    // If getting from local storage explicitly
    if (!thread && String(threadId).startsWith('local_chat_')) {
        // Create a temporary thread object wrapper so we can open the modal
        // The actual messages will be loaded by startChatListen
        const metaKey = `local_chat_meta_${threadId}`;
        let meta = { jobTitle: 'Chat', applicantName: 'Applicant' };
        try {
            const rawMeta = localStorage.getItem(metaKey);
            if (rawMeta) meta = JSON.parse(rawMeta);
            // Fallback: try to find original static thread info if it was an upgrade
            if (threadId.startsWith('local_chat_static_')) {
                const originalId = threadId.replace('local_chat_static_', '');
                const orig = discussionThreads.find(t => String(t.id) === String(originalId));
                if (orig) {
                    meta.jobTitle = orig.jobTitle;
                    meta.applicantName = 'Applicant'; // or specific name if available
                }
            }
        } catch (e) { }

        thread = {
            id: threadId,
            jobTitle: meta.jobTitle,
            applicantName: meta.applicantName,
            messages: []
        };
    }

    // If still not found, maybe it's internal/new logic
    if (!thread && String(threadId).startsWith('internal_')) {
        const jobId = threadId.replace('internal_', '');

        // 1. Try to find a matching STATIC mock thread first
        const staticMatch = discussionThreads.find(t => String(t.jobId) === String(jobId));

        if (staticMatch) {
            // Found a mock thread for this job!
            // Check if it was already upgraded to local storage
            const upgradedId = `local_chat_static_${staticMatch.id}`;
            if (localStorage.getItem(upgradedId)) {
                thread = {
                    id: upgradedId,
                    jobTitle: staticMatch.jobTitle,
                    applicantName: staticMatch.applicantName || 'Internal Team',
                    isInternal: true
                };
            } else {
                thread = {
                    ...staticMatch,
                    applicantName: staticMatch.applicantName || 'Internal Team',
                    isInternal: true
                };
            }
        } else {
            // 2. No mock found, create fresh local chat
            thread = {
                id: `local_chat_internal_${jobId}`,
                jobId,
                jobTitle: getJobTitle(jobId),
                applicantName: 'Internal Team',
                isInternal: true
            };

            // ensure meta for title persistence
            try {
                localStorage.setItem(`local_chat_meta_local_chat_internal_${jobId}`, JSON.stringify({
                    jobId,
                    jobTitle: thread.jobTitle,
                    applicantName: thread.applicantName
                }));
            } catch (e) { }

            // bootstrap storage with empty array if missing
            if (!localStorage.getItem(thread.id)) {
                localStorage.setItem(thread.id, JSON.stringify([]));
            }
        }
    }

    if (!thread) return;

    currentChatJob = thread;

    const chatModal = document.getElementById('chatModal');
    const chatTitle = document.getElementById('chatJobTitle');
    const chatMessages = document.getElementById('chatMessages');

    chatTitle.textContent = `${thread.jobTitle} - ${thread.applicantName}`;
    chatMessages.innerHTML = ''; // Clear previous content immediately. loading state handled by render function or empty state.
    chatModal.classList.add('show');

    // Start Listening
    const listenId = thread.isInternal ? thread.id : thread.id;
    startChatListen(listenId);
}

// Helper to start listening (Unified)
function startChatListen(chatId) {
    console.log('[CHAT] startChatListen called for:', chatId);

    // Reset any previous listeners
    if (currentChatUnsubscribe) {
        if (typeof currentChatUnsubscribe === 'function') currentChatUnsubscribe();
        currentChatUnsubscribe = null;
    }

    // 1. Handle Local Chat or Static Mock Chat
    // First, check if it's a static mock thread ID (e.g., numeric ID from jobsData/discussionThreads)
    const staticThread = discussionThreads.find(t => String(t.id) === String(chatId));

    if (staticThread) {
        console.log('[CHAT] Mode: Static Mock Data');
        renderHRChatMessages(staticThread.messages || []);
        return;
    }

    if (String(chatId).startsWith('local_chat_')) {
        console.log('[CHAT] Mode: Local Storage');

        const loadLocal = () => {
            try {
                const raw = localStorage.getItem(chatId);
                console.log('[CHAT] Raw data:', raw);

                if (raw === null) {
                    // Chat doesn't exist yet but it's a valid local ID we just generated?
                    // Just show empty state, it's fine.
                    console.warn('[CHAT] No local data found for this ID');
                    renderHRChatMessages([]);
                    return;
                }

                const msgs = JSON.parse(raw);
                renderHRChatMessages(msgs);
            } catch (e) {
                console.error('[CHAT] Error parsing local chat:', e);
                renderHRChatMessages([]); // Show empty state on error
            }
        };

        // Initial load
        loadLocal();

        // Listen for updates
        const handler = (e) => {
            if (e.key === chatId) {
                console.log('[CHAT] Storage update received');
                loadLocal();
            }
        };
        window.addEventListener('storage', handler);
        currentChatUnsubscribe = () => window.removeEventListener('storage', handler);
        return;
    }

    // 2. Handle Firebase Chat
    if (typeof firebaseJobs !== 'undefined' && firebaseJobs.listenToChat) {
        console.log('[CHAT] Mode: Firebase');
        currentChatUnsubscribe = firebaseJobs.listenToChat(chatId, (messages) => {
            renderHRChatMessages(messages);
        });
    } else {
        console.error('[CHAT] Firebase not available and not a local chat');
        renderHRChatMessages([]); // Clear loading state
    }
}

// Start chat from Applicant List
function startChatWithApplicant(jobId, applicantId) {
    if (!jobId || !applicantId) return;
    const applicant = (chatApplicantsCache || []).find(a => String(a.id) === String(applicantId));

    // Determine Chat ID
    // 1. Check if local chat exists
    const localId = `local_chat_${jobId}_${applicantId}`;
    let chatId = `${jobId}_${applicantId}`; // Default Firebase ID

    if (localStorage.getItem(localId)) {
        chatId = localId;
    }

    currentChatJob = {
        id: chatId,
        jobTitle: `${chatApplicantsJobTitle || getJobTitle(jobId)}`,
        applicantName: applicant ? applicant.name : 'Applicant',
        messages: []
    };

    const chatModal = document.getElementById('chatModal');
    const chatTitle = document.getElementById('chatJobTitle');
    const chatMessages = document.getElementById('chatMessages');

    if (chatTitle) chatTitle.textContent = `${currentChatJob.jobTitle} - ${currentChatJob.applicantName}`;
    if (chatMessages) chatMessages.innerHTML = '<p style="color:#676767;text-align:center;">Loading conversation...</p>';
    if (chatModal) chatModal.classList.add('show');

    closeChatApplicants();
    startChatListen(chatId);
}

function renderHRChatMessages(messages) {
    console.log('[CHAT] Rendering messages:', messages ? messages.length : 'null');
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) {
        console.error('[CHAT] chatMessages element not found!');
        return;
    }

    if (!messages || messages.length === 0) {
        chatMessages.innerHTML = `
            <div class="chat-empty-state">
                <div class="empty-icon">💬</div>
                <p>Start the conversation</p>
                <span class="empty-subtext">Send a message to explore this candidate.</span>
            </div>
        `;
        return;
    }

    try {
        chatMessages.innerHTML = messages.map(msg => {
            const isMe = msg.sender === 'HR';

            // Format time if needed, though design image doesn't emphasize it inside the bubble much
            // let timeStr = '';
            // try { timeStr = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); } catch (e) { }

            if (isMe) {
                // SENT MESSAGE (Admin)
                return `
                    <div class="message message-sent">
                        <div class="sender-label">Admin</div>
                        <div class="message-bubble">
                            <div class="message-text">${msg.content || ''}</div>
                        </div>
                    </div>
                `;
            } else {
                // RECEIVED MESSAGE (Candidate/Other)
                // Assuming msg.role or similar exists, or default to sender name
                const senderName = msg.sender || 'Applicant';
                const senderRole = msg.role || 'Candidate'; // We might need to fetch this or store it better
                const avatarUrl = msg.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(senderName)}`;

                return `
                    <div class="message message-received">
                        <div class="message-bubble">
                            <div class="message-header-inside">
                                <div class="message-avatar-small">
                                    <img src="${avatarUrl}" alt="${senderName}">
                                </div>
                                <span class="message-sender-name">${senderName} | ${senderRole}</span>
                            </div>
                            <div class="message-separator"></div>
                            <div class="message-text">${msg.content || ''}</div>
                        </div>
                    </div>
                `;
            }
        }).join('');

        chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (err) {
        console.error('[CHAT] Render error:', err);
        chatMessages.innerHTML = '<p style="color:red;text-align:center;">Error loading messages.</p>';
    }
}

// Send message
async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();

    if (!message || !currentChatJob) return;

    // Handle Local or Static
    // If it's a static thread (numeric ID) and we are sending a message, we must "upgrade" it to a local storage chat to persist the new message
    if (!String(currentChatJob.id).startsWith('local_chat_') && !isNaN(currentChatJob.id)) {
        // It's a static thread. Let's convert it to local storage.
        const newId = `local_chat_static_${currentChatJob.id}`;

        // Get existing static messages
        const existingMsgs = currentChatJob.messages || [];

        // Create new message
        const newMsg = {
            sender: 'HR',
            content: message,
            timestamp: new Date().toISOString(),
            avatar: 'https://ui-avatars.com/api/?name=HR'
        };

        // Save combined history to local storage
        const fullHistory = [...existingMsgs, newMsg];
        localStorage.setItem(newId, JSON.stringify(fullHistory));

        // Update current chat ref to point to new local ID so future messages go there
        currentChatJob = { ...currentChatJob, id: newId, messages: fullHistory };

        // Render
        renderHRChatMessages(fullHistory);
        input.value = '';
        return;
    }

    if (String(currentChatJob.id).startsWith('local_chat_')) {
        const msgs = JSON.parse(localStorage.getItem(currentChatJob.id) || '[]');
        msgs.push({
            sender: 'HR',
            content: message,
            timestamp: new Date().toISOString(),
            avatar: 'https://ui-avatars.com/api/?name=HR'
        });
        localStorage.setItem(currentChatJob.id, JSON.stringify(msgs));

        // Manual render for self
        renderHRChatMessages(msgs);
        input.value = '';
        return;
    }

    // Send to Firebase
    if (typeof firebaseJobs !== 'undefined' && firebaseJobs.sendMessage) {
        await firebaseJobs.sendMessage(currentChatJob.id, 'HR', message, 'https://ui-avatars.com/api/?name=HR');
        input.value = '';
    } else {
        console.warn('Firebase chat not available');
        alert('Chat unavailable');
    }
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
// Logout function
function logout() {
    console.log('[LOGOUT] Logging out...');
    sessionStorage.removeItem('hrLoggedIn');
    sessionStorage.clear();
    window.location.replace('hr-login.html');
}

// Mobile sidebar + panels
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar-collapsed');
    const overlay = document.querySelector('.sidebar-overlay');
    if (!sidebar || !overlay) return;

    const isOpen = sidebar.classList.toggle('sidebar-open');
    overlay.classList.toggle('show', isOpen);
    document.body.classList.toggle('no-scroll', isOpen);
}

function closeSidebar() {
    const sidebar = document.querySelector('.sidebar-collapsed');
    const overlay = document.querySelector('.sidebar-overlay');
    if (!sidebar || !overlay) return;
    sidebar.classList.remove('sidebar-open');
    overlay.classList.remove('show');
    document.body.classList.remove('no-scroll');
}

function openDiscussion() {
    const panel = document.getElementById('discussionPanel');
    if (panel) {
        panel.classList.add('show');
        document.body.classList.add('no-scroll');
    }
}

function closeDiscussion() {
    const panel = document.getElementById('discussionPanel');
    if (panel) {
        panel.classList.remove('show');
        document.body.classList.remove('no-scroll');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Close sidebar when overlay is tapped
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }

    // Close sidebar on nav click (mobile)
    document.querySelectorAll('.sidebar-menu .menu-item').forEach(item => {
        item.addEventListener('click', closeSidebar);
    });
});


