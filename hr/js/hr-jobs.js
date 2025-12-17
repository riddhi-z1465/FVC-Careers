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
const discussionThreads = [];

// Sample applicants data
const applicantsData = {};

let currentChatJob = null;
let currentJobPopup = null;

// Load jobs on page load
document.addEventListener('DOMContentLoaded', async function () {
    checkUserRole();
    await loadJobs();
    loadDiscussions();
    loadStats();
});

// Check user role and customize UI
function checkUserRole() {
    const role = sessionStorage.getItem('hrRole') || 'hr'; // Default to hr
    const clearBtn = document.getElementById('clearChatsBtn');
    const userAvatar = document.getElementById('userAvatar');
    // Archive Button in Popup (Note: This might be called before popup exists, so ensure we call checkUserRole when popup opens too, or just hide via CSS default and show here if admin)
    // Actually, popups are dynamic but the button is in static HTML.
    const archiveBtn = document.getElementById('archiveJobBtn');

    // Handle Delete/Archive Button Visibility
    if (clearBtn) {
        clearBtn.style.display = (role === 'admin') ? 'inline-flex' : 'none';
    }

    // Handle Archive Job Button Visibility
    if (archiveBtn) {
        archiveBtn.style.display = (role === 'admin') ? 'inline-flex' : 'none';
    }

    // Handle Admin Logo/Avatar
    const regularContainer = document.getElementById('userAvatarContainer');
    const adminContainer = document.getElementById('adminAvatarContainer');

    if (role === 'admin') {
        if (regularContainer) regularContainer.style.display = 'none';
        if (adminContainer) adminContainer.style.display = 'flex';
    } else {
        if (regularContainer) regularContainer.style.display = 'flex'; // Default to flex if consistent with CSS
        if (adminContainer) adminContainer.style.display = 'none';
    }
}

// Load and update statistics
// Load and update statistics
// Load and update statistics
async function loadStats() {
    try {
        let allJobs = [];
        let usedFirebase = false;

        // 1. Fetch jobs from Firebase (if available)
        if (typeof firebaseJobs !== 'undefined' && firebaseJobs.fetchJobs) {
            try {
                const jobsResult = await firebaseJobs.fetchJobs();
                if (jobsResult.success && jobsResult.data) {
                    usedFirebase = true;
                    // Normalize firebase data
                    allJobs = jobsResult.data.map(j => ({
                        id: j.id,
                        title: j.title,
                        isActive: j.isActive !== false, // Default to true if undefined
                        applicationsCount: j.applicationsCount || 0
                    }));
                }
            } catch (e) {
                console.warn('[STATS] Firebase fetch failed, falling back to mock data');
            }
        }

        // 2. Fetch/Merge Mock Data if Firebase not fully authoritative or used
        if (!usedFirebase) {
            // Static Mock Data
            const staticJobs = jobsData.map(j => ({
                id: j.id,
                title: j.title,
                isActive: true,
                applicationsCount: j.applicants || 0
            }));

            // LocalStorage Data
            let localJobs = [];
            try {
                const stored = JSON.parse(localStorage.getItem('fvc_jobs_local_storage') || '[]');
                localJobs = stored.map(j => ({
                    id: j.id || j._id,
                    title: j.title,
                    isActive: j.isActive !== false,
                    applicationsCount: j.applicationsCount || 0
                }));
            } catch (e) {
                console.error('[STATS] Error reading local storage:', e);
            }

            allJobs = [...staticJobs, ...localJobs];
        }

        // 3. Apply Local Archive Map Override
        // This ensures that if we archived it locally (optimistic UI), it counts as archived
        const archivedMap = JSON.parse(localStorage.getItem('fvc_archived_jobs') || '{}');

        // Filter unique by ID (in case of overlap)
        const uniqueJobsMap = new Map();
        allJobs.forEach(j => uniqueJobsMap.set(String(j.id), j));
        const uniqueJobs = Array.from(uniqueJobsMap.values());

        let activeJobsCount = 0;
        let pastJobsCount = 0;
        let totalApplicantsCount = 0;

        uniqueJobs.forEach(job => {
            const isArchivedLocally = !!archivedMap[job.id] || !!archivedMap[String(job.id)];

            // Determine effective status: stored isActive AND not locally archived
            const isEffectiveActive = job.isActive && !isArchivedLocally;

            if (isEffectiveActive) {
                activeJobsCount++;
            } else {
                pastJobsCount++;
            }

            totalApplicantsCount += (job.applicationsCount || 0);
        });

        // 4. Pending Reviews (Firebase Only feature mostly, fallback to mock)
        let pendingReviewsCount = 0;
        if (usedFirebase && typeof firebaseJobs !== 'undefined' && firebaseJobs.fetchAllApplications) {
            try {
                const applicationsResult = await firebaseJobs.fetchAllApplications();
                if (applicationsResult.success && applicationsResult.data) {
                    pendingReviewsCount = applicationsResult.data.filter(app =>
                        app.status === 'pending' || app.status === 'under_review'
                    ).length;
                }
            } catch (e) { }
        } else {
            pendingReviewsCount = 5; // Default mock
        }

        // 5. Update Stats Cards (DOM)
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };

        setVal('activeJobsCount', activeJobsCount);
        setVal('totalApplicantsCount', totalApplicantsCount);
        setVal('pendingReviewsCount', pendingReviewsCount);
        setVal('pastJobsCount', pastJobsCount);

        // 6. Update Tab Counts (Bonus: Real-time update on tabs)
        // Find buttons by text content or date-filter
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(btn => {
            const filter = btn.dataset.filter;
            if (filter === 'all') {
                btn.textContent = `All (${activeJobsCount + pastJobsCount})`;
            } else if (filter === 'active') {
                btn.textContent = `Active (${activeJobsCount})`;
            } else if (filter === 'past') {
                btn.textContent = `Past (${pastJobsCount})`;
            }
        });

        console.log('[STATS] Updated:', { active: activeJobsCount, past: pastJobsCount, applicants: totalApplicantsCount });

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
                    return {
                        id: job.id,
                        title: job.title || 'Untitled Job',
                        type: job.salaryRange || 'Not specified',
                        location: job.location || 'Not specified',
                        applicants: job.applicationsCount || 0,
                        description: job.description || 'No description available',
                        avatars: realAvatars.length > 0 ? realAvatars : getMockAvatars(job.applicationsCount || 0),
                        discussions: 0
                    };
                });
            } else {
                console.log('[INFO] No jobs in Firebase, using mock data');
                jobs = jobsData.map(j => ({ ...j, avatars: getMockAvatars(j.applicants), isActive: true })); // Convert existing mock data structure
            }
        } else {
            console.log('[INFO] Firebase not available, using mock data');
            // Convert existing mock data structure strictly for the fallback path
            jobs = jobsData.map(j => ({ ...j, avatars: getMockAvatars(j.applicants), isActive: true }));
        }
    } catch (error) {
        console.error('[ERROR] Error fetching jobs:', error);
        console.log('[INFO] Falling back to mock data');
        jobs = jobsData.map(j => ({ ...j, avatars: getMockAvatars(j.applicants), isActive: true }));
    }

    // Merge shared localStorage jobs (from both hr-jobs and jobs.js context)
    // Only if we are falling back to mock jobs (checking if jobs === jobsData is unsafe if we modified it, so just check if we have any jobs or if we want to enforce local ones)
    // We'll enforce local ones always if they exist, assuming they are "new" jobs not present in static data.

    if (jobs === jobsData || jobs.length === 0) { // Simple check: if using mock data
        try {
            const stored = JSON.parse(localStorage.getItem('fvc_jobs_local_storage') || '[]');
            if (stored.length > 0) {
                const storedMapped = stored.map((s, index) => {
                    const realAvatars = getJobAvatars(s.id);
                    return {
                        id: s.id || `local-${index}`,
                        title: s.title,
                        type: s.salaryRange,
                        location: s.location,
                        applicants: s.applicationsCount || 0,
                        description: s.description,
                        avatars: realAvatars.length > 0 ? realAvatars : getMockAvatars(s.applicationsCount || 0),
                        discussions: 0,
                        isActive: s.isActive !== false
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


    // Filter jobs based on currentJobFilter and archived status
    // Filter jobs based on currentJobFilter and archived status
    const archivedMap = JSON.parse(localStorage.getItem('fvc_archived_jobs') || '{}');

    // First, map effective active status
    const allJobsWithStatus = jobs.map(job => {
        const isArchivedLocally = !!archivedMap[job.id];
        // Effective Active = (Source is Active) AND (Not Archived Locally)
        // Default to active if source doesn't verify
        const sourceActive = job.isActive !== false;
        return {
            ...job,
            isEffectiveActive: sourceActive && !isArchivedLocally,
            isPast: !sourceActive || isArchivedLocally
        };
    });

    // Calculate Dynamic Stats based on CURRENTLY filtered view intent
    let viewActiveCount = 0;
    let viewPastCount = 0;
    let viewApplicantsCount = 0;

    // Filter Logic
    jobs = allJobsWithStatus.filter(job => {
        let matches = true;
        if (currentJobFilter === 'active') {
            matches = job.isEffectiveActive;
        } else if (currentJobFilter === 'past') {
            matches = job.isPast;
        }

        // If this job matches the view, contribute to stats
        if (matches) {
            if (job.isEffectiveActive) viewActiveCount++;
            if (job.isPast) viewPastCount++;
            viewApplicantsCount += (job.applicants || 0);
        }

        return matches;
    });

    // Update Stats Cards with Dynamic View Data
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setVal('activeJobsCount', viewActiveCount);
    setVal('pastJobsCount', viewPastCount);
    setVal('totalApplicantsCount', viewApplicantsCount);

    // Save to global state for popups
    window.currentRenderedJobs = jobs;

    const html = jobs.map(job => {
        const isPast = job.isPast;
        return `
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
                        <div class="job-status-container">
                            <div class="job-status-dot ${isPast ? 'past' : 'active'}"></div>
                            <span class="job-status-text ${isPast ? 'past' : 'active'}">${isPast ? 'Past Job' : 'Active'}</span>
                        </div>
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
                    <button class="action-icon-btn" onclick="openDiscussion('${job.id}')" title="Discussions">
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
    `}).join('');

    jobsGrid.innerHTML = html || '<p style="text-align: center; padding: 40px; color: #676767;">No jobs available. Create your first job!</p>';

    // successful load, update discussions to match
    loadDiscussions();
}

// Current View State
let currentDiscussionTab = 'internal';

function setDiscussionTab(tab) {
    currentDiscussionTab = tab;

    // Update active tab styling
    document.querySelectorAll('.discussion-tab').forEach(btn => {
        if (btn.dataset.tab === tab) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    loadDiscussions();
}

// Load discussions
async function loadDiscussions() {
    const discussionList = document.getElementById('discussionList');
    if (!discussionList) return;

    if (currentDiscussionTab === 'internal') {
        const jobsToUse = window.currentRenderedJobs || jobsData;

        // Clear and rebuild internal threads
        discussionThreads.length = 0;

        jobsToUse.forEach(job => {
            const messages = getInternalChat(job.id);
            discussionThreads.push({
                id: job.id,
                jobTitle: job.title,
                count: Math.floor(Math.random() * 5) + 1, // Mock online count
                messages: messages.length > 0 ? messages : [
                    {

                    }
                ]
            });
        });

        if (discussionThreads.length === 0) {
            discussionList.innerHTML = '<div style="padding: 20px; text-align: center; color: #888;">No active discussions.</div>';
        } else {
            const html = discussionThreads.map(thread => `
                <div class="discussion-item ${thread.id === 1 ? 'active' : ''}" onclick="openChat('${thread.id}')">
                    <div class="discussion-title">${thread.jobTitle}</div>
                    <div class="discussion-count">+ ${thread.count} Online</div>
                </div>
            `).join('');
            discussionList.innerHTML = html;
        }
    } else {
        // Candidates View
        discussionList.innerHTML = '<div style="padding: 20px; text-align: center; color: #888;">Loading candidates...</div>';

        let allCandidates = [];
        const seenIds = new Set();

        // 1. Firebase
        if (typeof firebaseJobs !== 'undefined' && firebaseJobs.fetchAllApplications) {
            try {
                const result = await firebaseJobs.fetchAllApplications();
                if (result.success && result.data) {
                    result.data.forEach(app => {
                        if (!seenIds.has(app.id)) {
                            seenIds.add(app.id);
                            allCandidates.push({
                                id: app.id,
                                name: app.fullName || app.name,
                                role: app.targetRole || 'Applicant',
                                avatar: app.photoURL,
                                university: app.university
                            });
                        }
                    });
                }
            } catch (e) {
                console.warn('Error fetching firebase candidates:', e);
            }
        }

        // 2. LocalStorage
        try {
            const localApps = JSON.parse(localStorage.getItem('applications') || '[]');
            localApps.forEach(app => {
                // Determine ID (handle the `local-` prefixing if not present or inconsistent)
                const id = app.id ? (String(app.id).startsWith('local-') ? app.id : `local-${app.id}`) : `local-${Math.random().toString(36).substr(2, 9)}`;

                // Avoid dupes if mixed sources (though local IDs usually distinct)
                // Use a simpler check: if we haven't seen this specific ID string
                if (!seenIds.has(id)) {
                    seenIds.add(id);
                    allCandidates.push({
                        id: id,
                        name: app.fullName || app.name,
                        role: app.targetRole || 'Applicant',
                        avatar: app.photoURL || null,
                        university: app.university,
                        isLocal: true
                    });
                }
            });
        } catch (e) {
            console.error('Error loading local applicants for discussion:', e);
        }

        // 3. Mock Data (fallback if completely empty?)
        if (allCandidates.length === 0) {
            Object.values(applicantsData).forEach(list => {
                list.forEach(c => {
                    if (!seenIds.has(c.id)) {
                        seenIds.add(c.id);
                        allCandidates.push(c);
                    }
                });
            });
        }

        if (allCandidates.length === 0) {
            discussionList.innerHTML = '<div style="padding: 20px; text-align: center; color: #888;">No candidates found.</div>';
            return;
        }

        const html = allCandidates.map(candidate => `
            <div class="discussion-item candidate-layout" onclick="chatWithApplicant('${candidate.id}')">
                <div class="candidate-header-row">
                    <div class="avatar-small">
                         ${candidate.avatar ?
                `<img src="${candidate.avatar}" alt="${candidate.name}">` :
                `<div style="width:100%; height:100%; background:#eee; display:flex; align-items:center; justify-content:center; font-weight:700; color:#555; font-size:12px;">
                                ${candidate.name ? candidate.name.charAt(0).toUpperCase() : '?'}
                             </div>`
            }
                    </div>
                    <div class="candidate-name-title">${candidate.name}</div>
                </div>
                <div class="candidate-footer-row">
                    <span class="job-role-text">${candidate.role || 'Applicant'}</span>
                </div>
            </div>
        `).join('');

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

    // Capture for status updates
    window.currentRenderedApplicants = allApplicants;

    // Render Applicants
    document.getElementById('applicantCount').textContent = allApplicants.length;

    if (allApplicants.length === 0) {
        applicantsGrid.innerHTML = '<div style="text-align:center; padding: 20px; color: #666;">No applicants yet.</div>';
    } else {
        applicantsGrid.innerHTML = allApplicants.map(applicant => `
            <div class="applicant-card">
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
                        <span class="applicant-status-badge ${applicant.status}">${applicant.statusText}</span>
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

// Close job popup
function closeJobPopup() {
    document.getElementById('jobPopupOverlay').classList.remove('show');
    document.getElementById('jobPopup').classList.remove('show');
    currentJobPopup = null;
}

// Applicant actions
function chatWithApplicant(applicantId) {
    // 1. Close job popup if open
    closeJobPopup();

    // 2. Open Discussion Panel and ensure Candidates tab is active
    // We manually open checking logic to avoid openDiscussion's default internal tab behavior if we want cleaner flow, 
    // or just call it and override. Overriding is safer to ensure panel opens.
    const panel = document.getElementById('discussionPanel');
    panel.classList.add('show');
    document.querySelector('.main-content').classList.remove('full-width');

    setDiscussionTab('candidates');

    // 3. Find Name/Avatar
    let name = 'Candidate';
    let avatar = null;

    // Try finding in rendered applicants (popup context)
    if (window.currentRenderedApplicants) {
        const found = window.currentRenderedApplicants.find(a => a.id === applicantId);
        if (found) {
            name = found.name;
            avatar = found.avatar;
        }
    }

    // 4. Load Chat
    const messages = getCandidateChat(applicantId);

    // 5. Set Current Chat Context
    currentChatJob = {
        id: applicantId,
        jobTitle: name, // Header uses this property
        avatar: avatar,
        messages: messages,
        isCandidate: true
    };

    // 6. Open Modal
    const chatModal = document.getElementById('chatModal');
    const chatTitle = document.getElementById('chatJobTitle');
    const chatMessages = document.getElementById('chatMessages');

    chatTitle.textContent = name;

    // Render messages
    const html = messages.map(msg => {
        // Avatar Handling
        let avatarHtml = '';
        if (msg.avatar && msg.avatar.includes('http')) {
            avatarHtml = `<img src="${msg.avatar}" alt="${msg.sender}">`;
        } else {
            const letter = msg.sender ? msg.sender.charAt(0).toUpperCase() : '?';
            avatarHtml = `<div style="width:100%; height:100%; font-weight:700; color:#555; display:flex; align-items:center; justify-content:center;">${letter}</div>`;
        }

        return `
        <div class="message">
            <div class="message-header">
                <div class="message-avatar">
                   ${avatarHtml}
                </div>
                <div class="message-name">${msg.sender}</div>
            </div>
            <div class="message-content">${msg.content}</div>
        </div>
    `}).join('');

    chatMessages.innerHTML = html;
    chatModal.classList.add('show');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

let currentInterviewApplicantId = null;

function scheduleInterview(applicantId) {
    currentInterviewApplicantId = applicantId;

    // Find applicant data to show name
    // We need to look in the rendered list or fetch again.
    // For simplicity, let's look in all gathered applicants if possible, or just use ID/Generic
    // Ideally we should have passed the name too, but let's try to find it in the DOM or global store

    // Attempt to find name from the card in the DOM
    // This is a bit hacky but works without state management
    const card = document.querySelector(`.action-btn.interview-btn[onclick="scheduleInterview('${applicantId}')"]`).closest('.applicant-card');
    const name = card ? card.querySelector('.applicant-name').textContent : 'Candidate';

    document.getElementById('interviewApplicantName').textContent = name;

    // Add show class
    document.getElementById('interviewOverlay').classList.add('show');
    document.getElementById('interviewPopup').classList.add('show');
}

function closeInterviewPopup() {
    document.getElementById('interviewOverlay').classList.remove('show');
    document.getElementById('interviewPopup').classList.remove('show');
    document.getElementById('interviewForm').reset();
    currentInterviewApplicantId = null;
}

function handleSendInterview(event) {
    event.preventDefault();

    const date = document.getElementById('interviewDate').value;
    const time = document.getElementById('interviewTime').value;
    const link = document.getElementById('interviewLink').value;
    const message = document.getElementById('interviewMessage').value;

    if (!date || !time || !link) {
        alert("Please fill in all required fields.");
        return;
    }

    // Create interview message
    const interviewMessage = {
        sender: 'You',
        avatar: 'https://ui-avatars.com/api/?name=You&background=e11d48&color=fff',
        content: `
            <div class="interview-msg">
                <div class="msg-header-row">
                     <span class="icon">📅</span>
                     <span class="msg-title">Interview Scheduled</span>
                </div>
                <div class="msg-row"><strong>Date:</strong> ${date}</div>
                <div class="msg-row"><strong>Time:</strong> ${time}</div>
                <div class="msg-row"><strong>Link:</strong> <a href="${link}" target="_blank">Join Meeting</a></div>
                ${message ? `<div class="msg-note">"${message}"</div>` : ''}
            </div>
        `,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'interview'
    };

    // Save to chat history
    if (typeof currentInterviewApplicantId !== 'undefined' && currentInterviewApplicantId) {
        const chatHistory = getCandidateChat(currentInterviewApplicantId);
        chatHistory.push(interviewMessage);
        saveCandidateChat(currentInterviewApplicantId, chatHistory);

        // If chat is open for this user, refresh it
        if (currentChatJob && currentChatJob.id === currentInterviewApplicantId) {
            chatWithApplicant(currentInterviewApplicantId);
        }
    }

    // In a real app, send to backend
    console.log(`[INTERVIEW] Scheduling for ${currentInterviewApplicantId}`, { date, time, link, message });

    alert(`Interview invitation sent successfully!`);
    closeInterviewPopup();
}

let currentAssessmentApplicantId = null;

function assessApplicant(applicantId) {
    currentAssessmentApplicantId = applicantId;

    // Find name (similar hack to scheduleInterview)
    const card = document.querySelector(`.action-btn.assess-btn[onclick="assessApplicant('${applicantId}')"]`).closest('.applicant-card');
    const name = card ? card.querySelector('.applicant-name').textContent : 'Candidate';

    document.getElementById('assessmentApplicantName').textContent = name;

    // Show popup
    document.getElementById('assessmentOverlay').classList.add('show');
    document.getElementById('assessmentPopup').classList.add('show');
}

function closeAssessmentPopup() {
    document.getElementById('assessmentOverlay').classList.remove('show');
    document.getElementById('assessmentPopup').classList.remove('show');
    document.getElementById('assessmentForm').reset();
    currentAssessmentApplicantId = null;
}

function handleSendAssessment(event) {
    event.preventDefault();

    const link = document.getElementById('assessmentLinkInput').value;
    const message = document.getElementById('assessmentMessage').value;

    if (!link) {
        alert("Please provide the assessment link.");
        return;
    }

    // Create assessment message
    const assessmentMessage = {
        sender: 'You',
        avatar: 'https://ui-avatars.com/api/?name=You&background=e11d48&color=fff',
        content: `
            <div class="assessment-msg">
                <div class="msg-header-row">
                     <span class="icon">📋</span>
                     <span class="msg-title">Assessment Task</span>
                </div>
                <div class="msg-row">Please complete the following assessment:</div>
                <div class="msg-row"><strong>Link:</strong> <a href="${link}" target="_blank">Start Assessment</a></div>
                ${message ? `<div class="msg-note">"${message}"</div>` : ''}
            </div>
        `,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'assessment'
    };

    // Save to chat history
    if (typeof currentAssessmentApplicantId !== 'undefined' && currentAssessmentApplicantId) {
        const chatHistory = getCandidateChat(currentAssessmentApplicantId);
        chatHistory.push(assessmentMessage);
        saveCandidateChat(currentAssessmentApplicantId, chatHistory);

        // If chat is open, refresh it
        if (currentChatJob && currentChatJob.id === currentAssessmentApplicantId) {
            chatWithApplicant(currentAssessmentApplicantId);
        }
    }

    // In a real app, send to backend
    console.log(`[ASSESSMENT] Sending to ${currentAssessmentApplicantId}`, { link, message });

    alert(`Assessment Sent!`);
    closeAssessmentPopup();
}

function selectApplicant(applicantId) {
    // 1. Find the applicant
    const applicant = window.currentRenderedApplicants ? window.currentRenderedApplicants.find(a => a.id === applicantId) : null;

    if (!applicant) {
        console.error('Applicant not found in rendered list:', applicantId);
        return;
    }

    // 2. Check for existing status (Rule: Only admin can change status multiple times)
    const isAdmin = sessionStorage.getItem('hrRole') === 'admin';
    const currentStatus = (applicant.status || 'new').toLowerCase();

    if (!isAdmin && (currentStatus === 'selected' || currentStatus === 'rejected')) {
        alert('Only admin can change status multiple times.');
        return;
    }

    if (confirm(`Are you sure you want to select ${applicant.name}?`)) {
        updateApplicantStatus(applicant, 'selected');
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
        // 1. Find the applicant
        const applicant = window.currentRenderedApplicants ? window.currentRenderedApplicants.find(a => a.id === applicantId) : null;

        if (!applicant) {
            console.error('Applicant not found:', applicantId);
            closeRejectDialog();
            return;
        }

        // 2. Check for existing status
        const isAdmin = sessionStorage.getItem('hrRole') === 'admin';
        const currentStatus = (applicant.status || 'new').toLowerCase();

        if (!isAdmin && (currentStatus === 'selected' || currentStatus === 'rejected')) {
            alert('Only admin can change status multiple times.');
            closeRejectDialog();
            return;
        }

        // 3. Update status
        updateApplicantStatus(applicant, 'rejected');
        closeRejectDialog();
    }
}

// Update applicant status helper
async function updateApplicantStatus(applicant, newStatus) {
    const isFirebase = typeof firebaseJobs !== 'undefined' && firebaseJobs.updateApplicationStatus;
    const applicantId = applicant.id;

    // Status Text Map
    const statusTextMap = {
        'selected': 'Selected',
        'rejected': 'Rejected',
        'new': 'Received',
        'interview': 'Interview',
        'reviewed': 'Reviewed'
    };

    const statusText = statusTextMap[newStatus] || newStatus;

    try {
        let success = false;

        // 1. Try Firebase Update
        if (isFirebase && !applicantId.startsWith('local-')) {
            const result = await firebaseJobs.updateApplicationStatus(applicantId, newStatus);
            if (result.success) success = true;
        }

        // 2. Try LocalStorage Update (always do this for local apps or fallback)
        // If it's a local app, it definitely exists here. If it's a hybrid, we still might want to track it locally if firebase failed or isn't used.
        const allLocalApps = JSON.parse(localStorage.getItem('applications') || '[]');

        // Find by ID. 
        // Note: 'applicant.id' might be 'local-123' but stored ID might be '123' if we stripped it, OR logic in openJobPopup added 'local-'.
        // In openJobPopup (line 577): id: `local-${app.id || index}`
        // So we need to match carefully.

        const localIndex = allLocalApps.findIndex((a, idx) => {
            const generatedId = `local-${a.id || idx}`;
            return generatedId === applicantId || a.id === applicantId;
        });

        if (localIndex !== -1) {
            allLocalApps[localIndex].status = newStatus;
            localStorage.setItem('applications', JSON.stringify(allLocalApps));
            success = true;
            console.log('[UPDATE] Updated status in LocalStorage');
        }

        if (success) {
            // Update UI/DOM immediately
            // Find the badge
            // We can search by structure or ID if we had one. Since we don't have unique ID on card, we rely on the button click context or re-render.
            // Re-rendering the list is safest to show correct state.

            // Update the object in memory
            applicant.status = newStatus;
            applicant.statusText = statusText;

            alert(`Applicant marked as ${statusText}.`);

            // Refresh the popup content
            // We can just call openJobPopup again with the current job ID to re-fetch and re-render
            if (currentJobPopup) {
                openJobPopup(currentJobPopup.id);
            }
        } else {
            // Mock only (no persistence found)
            alert(`[Mock] Applicant marked as ${statusText}. (Persistence not available for this data type)`);
            // Update memory
            applicant.status = newStatus;
            // Re-render
            if (currentJobPopup) {
                openJobPopup(currentJobPopup.id);
            }
        }

    } catch (error) {
        console.error('Error updating status:', error);
        alert('Failed to update status.');
    }
}

// Open discussion panel
// Open discussion panel
function openDiscussion(jobId) {
    const panel = document.getElementById('discussionPanel');
    panel.classList.add('show');

    const mainContent = document.querySelector('.main-content');
    mainContent.classList.remove('full-width');

    // Switch to Internal tab by default when opening panel via this button
    setDiscussionTab('internal');

    // If a specific job ID was clicked, open that chat immediately
    if (jobId && jobId !== 'undefined' && jobId !== 'null') {
        openChat(jobId);
    }
}

// Close discussion panel
function closeDiscussion() {
    const panel = document.getElementById('discussionPanel');
    panel.classList.remove('show');

    const mainContent = document.querySelector('.main-content');
    mainContent.classList.add('full-width');
}

// Open chat modal
function openChat(threadId) {
    // Ensure threadId comparison handles both string and number
    const thread = discussionThreads.find(t => String(t.id) === String(threadId));
    if (!thread) return;

    currentChatJob = thread;

    const chatModal = document.getElementById('chatModal');
    const chatTitle = document.getElementById('chatJobTitle');
    const chatMessages = document.getElementById('chatMessages');

    chatTitle.textContent = thread.jobTitle;

    const currentUser = getCurrentUserIdentity();

    // Load messages
    const validMessages = thread.messages.filter(msg => msg && msg.sender && msg.content && msg.sender !== 'System' && msg.content !== 'undefined');
    const messagesHtml = validMessages.map(msg => {
        let displayName = msg.sender || 'Unknown';
        let isMe = false;

        if (msg.username && currentUser.username && msg.username === currentUser.username) {
            displayName = `You (${capitalize(msg.role || currentUser.role)})`;
            isMe = true;
        } else if (msg.sender === 'You') {
            displayName = 'You';
        } else if (msg.role && msg.sender) {
            displayName = `${msg.sender} (${capitalize(msg.role)})`;
        }

        return `
        <div class="message ${isMe ? 'own-message' : ''}">
            <div class="message-header">
                <div class="message-avatar">
                    ${msg.avatar ? `<img src="${msg.avatar}" alt="${displayName}">` :
                `<div style="width:100%; height:100%; background:#eee; display:flex; align-items:center; justify-content:center; font-weight:700; color:#555;">${displayName.charAt(0)}</div>`}
                </div>
                <div class="message-name">${displayName}</div>
            </div>
            <div class="message-content">${msg.content}</div>
            ${msg.action ? `<div class="message-action">${msg.action}</div>` : ''}
        </div>
    `}).join('');

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

    const currentUser = getCurrentUserIdentity();
    const roleLabel = currentUser.role ? ` (${capitalize(currentUser.role)})` : '';
    const senderDisplay = currentUser.displayName || 'You';

    const newMessage = {
        sender: senderDisplay,
        username: currentUser.username,
        role: currentUser.role,
        avatar: currentUser.avatar || 'https://i.pravatar.cc/32?img=1',
        content: message,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    currentChatJob.messages.push(newMessage);

    // Save internal chat if applicable
    if (currentDiscussionTab === 'internal' && !currentChatJob.isCandidate) {
        saveInternalChat(currentChatJob.id, currentChatJob.messages);
    } else if (currentChatJob.isCandidate) {
        saveCandidateChat(currentChatJob.id, currentChatJob.messages);
    }

    const messageHtml = `
        <div class="message own-message">
            <div class="message-header">
                <div class="message-avatar">
                    <img src="${newMessage.avatar}" alt="You">
                </div>
                <div class="message-name">You${roleLabel}</div>
            </div>
            <div class="message-content">${newMessage.content}</div>
        </div>
    `;

    chatMessages.insertAdjacentHTML('beforeend', messageHtml);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    input.value = '';
}

// Helper to save internal chat
function saveInternalChat(jobId, messages) {
    const key = `fvc_internal_chat_${jobId}`;
    localStorage.setItem(key, JSON.stringify(messages));
}

// Helper to save candidate chat
function saveCandidateChat(applicantId, messages) {
    const key = `fvc_candidate_chat_${applicantId}`;
    localStorage.setItem(key, JSON.stringify(messages));
}

// Helper to get internal chat
function getInternalChat(jobId) {
    const key = `fvc_internal_chat_${jobId}`;
    try {
        return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (e) {
        return [];
    }
}

// Helper to get candidate chat
function getCandidateChat(applicantId) {
    const key = `fvc_candidate_chat_${applicantId}`;
    try {
        return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (e) {
        return [];
    }
}


// Helper: Get Current User Identity
function getCurrentUserIdentity() {
    const username = sessionStorage.getItem('hrUsername') || 'guest';
    const role = sessionStorage.getItem('hrRole') || 'hr';
    let avatar = null;
    let displayName = username;

    try {
        const teamMembers = JSON.parse(localStorage.getItem('fvc_team_members') || '[]');
        const member = teamMembers.find(m => m.username === username);
        if (member) {
            avatar = member.photo;
            displayName = member.name;
        } else {
            displayName = capitalize(username.replace('_', ' '));
        }
    } catch (e) { }

    if (!avatar) {
        const headerAvatar = document.getElementById('userAvatar');
        if (headerAvatar) avatar = headerAvatar.src;
    }

    return { username, role, displayName, avatar };
}

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
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

let currentJobFilter = 'all';

// Update checkUserRole to handle Archive Button
// We need to modify the original function or overwrite it if it's cleaner. 
// But since we can't overwrite easily without finding it, let's just use this space to fix the previous error first.


function setJobFilter(filter) {
    currentJobFilter = filter;

    // Update tabs UI
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Convert text temporarily for visual feedback if needed? No, just reload
    loadJobs();
}

// Archive current job (instead of delete)
async function archiveCurrentJob() {
    if (!currentJobPopup) return;

    if (!confirm(`Are you sure you want to archive the job position "${currentJobPopup.title}"? It will be moved to Past Jobs.`)) {
        return;
    }

    const jobId = currentJobPopup.id;
    console.log('[ARCHIVE] Attempting to archive job:', jobId);

    try {
        let archived = false;

        // 1. Try Firebase Archive (Update status)
        if (typeof firebaseJobs !== 'undefined' && firebaseJobs.archiveJob) {
            try {
                const result = await firebaseJobs.archiveJob(String(jobId));
                if (result.success) {
                    archived = true;
                    console.log('[ARCHIVE] Archived in Firebase');
                }
            } catch (e) {
                console.warn('[ARCHIVE] Firebase archive failed', e);
            }
        }

        // If firebaseJobs.archiveJob doesn't exist (likely), manually update status if updateJob exists.
        // Actually, for simplicity/mock:

        // 2. Local Mock Archive (LocalStorage)
        // We will store "archived_jobs" IDs in a separate list or update the local object
        // Let's use a "archived_statuses" map in local storage for simplicity to persist across reloading mock data

        const archivedMap = JSON.parse(localStorage.getItem('fvc_archived_jobs') || '{}');
        archivedMap[jobId] = true;
        localStorage.setItem('fvc_archived_jobs', JSON.stringify(archivedMap));

        archived = true;

        // 3. Fallback/Success handling
        if (archived) {
            alert('Job archived successfully.');
            closeJobPopup();
            await loadJobs(); // Refresh grid
            await loadStats(); // Refresh stats
        }

    } catch (error) {
        console.error('[ARCHIVE] Error:', error);
        alert('An error occurred while archiving the job.');
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
