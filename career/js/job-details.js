// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';
const USE_MOCK_DATA = true; // Using mock data to avoid CORS issues

// Mock jobs data - matches jobs from jobs.js
const MOCK_JOBS = {
    'mock-1': {
        _id: 'mock-1',
        title: 'UX Designer, YouTube Paid Digital Goods',
        company: 'YouTube',
        location: 'Mumbai, India',
        jobType: 'Full-time',
        experience: 'Mid',
        qualifications: ['Bachelors', 'Masters'],
        skills: ['UX Design', 'UI Design', 'Figma', 'Prototyping'],
        description: `At Google, we follow a simple but vital premise: "Focus on the user and all else will follow." Google's Interaction Designers take complex tasks and make them intuitive and easy-to-use for billions of people around the globe. Throughout the design process—from creating user flows and wireframes to building user interface mockups and prototypes—you'll envision how people will experience our products, and bring that vision to life in a way that feels inspired, refined, and even magical.

Google User Experience (UX) is made up of multi-disciplinary teams of UX Designers, Researchers, Writers, Content Strategists, Program Managers, and Engineers. We care deeply about the people who use our products. The UX team plays an integral part in gathering insights about the attitudes, emotions, and behaviors of people who use our products to inspire and inform design. We collaborate closely with each other and with engineering and product management to create industry-leading products that deliver value for the people who use them, and for Google's businesses.

As an Interaction Designer, you'll rely on user-centered design methods to craft industry-leading user experiences—from concept to execution. Like all of our UX jobs, you'll collaborate with your design partners to leverage and evolve the Google design language to build beautiful, innovative, inspired products that people love to use.`,
        requirements: [
            'Bachelor\'s degree or equivalent practical experience',
            '4 years of interaction design experience in product design or UX design',
            'Experience with motion and prototyping tools (e.g., After Effects, Principle, or similar)',
            'Experience implementing visual design systems across multiple platforms',
            'Include a portfolio or website showcasing your work'
        ],
        responsibilities: [
            'Collaborate with product managers, engineers, and cross-functional stakeholders',
            'Communicate the user experience with wireframes, flow diagrams, and mockups',
            'Integrate user feedback and business requirements into ongoing product updates',
            'Advocate for design-centered changes and improvements'
        ],
        benefits: [
            'Competitive salary',
            'Health insurance',
            'Flexible work hours',
            'Learning and development budget'
        ],
        salary: {
            min: 80000,
            max: 120000,
            currency: 'USD'
        }
    },
    'mock-2': {
        _id: 'mock-2',
        title: 'AI/ML Engineer',
        company: 'FVC',
        location: 'Bangalore, India',
        jobType: 'Full-time',
        experience: 'Mid',
        qualifications: ['Bachelors', 'Masters'],
        skills: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning'],
        description: `Join our AI/ML team to develop smart models that help automate decisions and unlock new insights. You'll work on cutting-edge machine learning projects that directly impact millions of users.

We're looking for passionate ML engineers who can design, build, and deploy scalable machine learning systems. You'll collaborate with cross-functional teams to understand business problems and create innovative solutions using state-of-the-art AI/ML techniques.`,
        requirements: [
            '3+ years of ML engineering experience',
            'Strong proficiency in Python and ML frameworks (TensorFlow, PyTorch)',
            'Experience with data processing and model deployment',
            'Understanding of ML algorithms and statistical methods',
            'Bachelor\'s or Master\'s degree in Computer Science or related field'
        ],
        responsibilities: [
            'Design and implement ML models for various use cases',
            'Optimize model performance and scalability',
            'Deploy models to production environments',
            'Collaborate with data scientists and engineers',
            'Monitor and improve model accuracy'
        ],
        benefits: [
            'Competitive salary package',
            'Health and life insurance',
            'Remote work options',
            'Latest GPU infrastructure',
            'Conference and training budget'
        ],
        salary: {
            min: 90000,
            max: 140000,
            currency: 'USD'
        }
    },
    'mock-3': {
        _id: 'mock-3',
        title: 'Product Manager',
        company: 'FVC',
        location: 'Delhi, India',
        jobType: 'Full-time',
        experience: 'Mid',
        qualifications: ['Bachelors', 'MBA preferred'],
        skills: ['Product Strategy', 'Agile', 'Analytics', 'User Research'],
        description: `Drive product direction, align teams, and ensure every feature solves a real problem. As a Product Manager at FVC, you'll own the product roadmap and work closely with engineering, design, and business teams to deliver impactful features.

You'll be responsible for understanding user needs, defining product requirements, and driving execution from concept to launch. The ideal candidate has a passion for technology, strong analytical skills, and excellent communication abilities.`,
        requirements: [
            '4+ years of product management experience',
            'Strong analytical and problem-solving skills',
            'Experience with Agile development methodologies',
            'Proven track record of shipping successful products',
            'Bachelor\'s degree; MBA preferred'
        ],
        responsibilities: [
            'Define product vision and strategy',
            'Manage and prioritize product roadmap',
            'Work with cross-functional teams to deliver features',
            'Conduct user research and gather feedback',
            'Analyze metrics and iterate on product features'
        ],
        benefits: [
            'Competitive compensation',
            'Health insurance',
            'Equity options',
            'Flexible work environment',
            'Professional development opportunities'
        ],
        salary: {
            min: 100000,
            max: 150000,
            currency: 'USD'
        }
    }
};


// Get job ID from URL
function getJobIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Fetch job details from API
async function fetchJobDetails(jobId) {
    try {
        // 1. Check Mock Data first
        if (MOCK_JOBS[jobId]) {
            console.log('✅ Found job in Mock Data:', jobId);
            displayJobDetails(MOCK_JOBS[jobId]);
            loadApplicantsForJob(jobId);
            return;
        }

        // 1.5 Check Local Storage (user created jobs)
        try {
            const localJobs = JSON.parse(localStorage.getItem('fvc_jobs_local_storage') || '[]');
            // HR jobs use 'id', Mock jobs use '_id'. We check both.
            const localJob = localJobs.find(j =>
                String(j._id) === String(jobId) || String(j.id) === String(jobId)
            );

            if (localJob) {
                console.log('✅ Found job in LocalStorage:', jobId);

                // Normalizing HR job data format to match expected format
                const normalizedJob = {
                    ...localJob,
                    _id: localJob._id || localJob.id,
                    jobType: localJob.jobType || localJob.type, // HR dashboard uses 'type'
                    description: localJob.description || 'No description available',
                    company: localJob.company || 'FVC', // Default to FVC if missing
                    location: localJob.location || 'Remote',
                    // Default values for missing fields to avoid errors
                    requirements: localJob.requirements || ['No specific requirements listed.'],
                    responsibilities: localJob.responsibilities || ['No specific responsibilities listed.'],
                    qualifications: localJob.qualifications || [],
                    benefits: localJob.benefits || [],
                    salary: localJob.salary || (localJob.type && !isNaN(localJob.type) ? {
                        min: parseInt(localJob.type), max: parseInt(localJob.type), currency: 'INR'
                    } : null)
                };

                displayJobDetails(normalizedJob);
                loadApplicantsForJob(jobId);
                return;
            }
        } catch (e) {
            console.error('Error checking LocalStorage:', e);
        }

        // 2. Try fetching from Firebase
        if (typeof firebaseJobs !== 'undefined' && firebaseJobs.getJobById) {
            console.log('📡 Fetching job from Firebase:', jobId);
            const result = await firebaseJobs.getJobById(jobId);

            if (result.success && result.data) {
                console.log('✅ Found job in Firebase');
                displayJobDetails(result.data);
                loadApplicantsForJob(jobId);
                return;
            }
        }

        // 3. Fallback logic
        console.warn('⚠️ Job not found in Mock or Firebase');

        const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`);

        if (!response.ok) {
            throw new Error('Backend not available');
        }

        const data = await response.json();

        if (data.success) {
            displayJobDetails(data.data);
            loadApplicantsForJob(jobId);
        } else {
            showError('Job not found. Showing sample data.');
            displayJobDetails(MOCK_JOBS['mock-1']);
            loadApplicantsForJob(jobId);
        }
    } catch (error) {
        console.error('Error fetching job details:', error);
        console.log('Backend not available. Using sample data.');
        displayJobDetails(MOCK_JOBS['mock-1']);
        loadApplicantsForJob(jobId);
    }
}

// Display job details on the page
function displayJobDetails(job) {
    // Update page title
    document.title = `${job.title} - FVC Careers`;

    // Update job header
    const titleEl = document.getElementById('jobTitle');
    const companyEl = document.getElementById('jobCompany');
    const locationEl = document.getElementById('jobLocation');
    const typeEl = document.getElementById('jobType');

    if (titleEl) titleEl.textContent = job.title;
    if (companyEl) companyEl.textContent = job.company;
    if (locationEl) locationEl.textContent = job.location;
    if (typeEl) typeEl.textContent = job.jobType;

    // Update job description
    if (job.description) {
        const descriptionDiv = document.getElementById('jobDescription');
        if (descriptionDiv) {
            const paragraphs = job.description.split('\n\n');
            descriptionDiv.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
        }
    }

    // Update minimum qualifications (requirements)
    const minQualList = document.getElementById('minQualifications');
    if (minQualList) {
        if (job.requirements && job.requirements.length > 0) {
            minQualList.innerHTML = job.requirements.map(req => `<li>${req}</li>`).join('');
        } else {
            minQualList.innerHTML = '<li>No specific requirements listed.</li>';
        }
    }

    // Update preferred qualifications
    const prefQualList = document.getElementById('prefQualifications');
    if (prefQualList) {
        if (job.qualifications && job.qualifications.length > 0) {
            const qualText = job.qualifications.map(q => {
                switch (q) {
                    case 'Bachelors': return "Bachelor's degree in Design, Human-Computer Interaction, Computer Science, a related field, or equivalent practical experience.";
                    case 'Masters': return "Master's degree in relevant field.";
                    case 'Ph.D.': return "Ph.D. in relevant field.";
                    case 'Associate': return "Associate degree or equivalent.";
                    case 'Ongoing Study': return "Currently pursuing degree in relevant field.";
                    default: return q;
                }
            });
            prefQualList.innerHTML = qualText.map(q => `<li>${q}</li>`).join('');
        } else {
            prefQualList.innerHTML = '<li>No preferred qualifications listed.</li>';
        }
    }

    // Update responsibilities
    const respList = document.getElementById('jobResponsibilities');
    if (respList) {
        if (job.responsibilities && job.responsibilities.length > 0) {
            respList.innerHTML = job.responsibilities.map(resp => `<li>${resp}</li>`).join('');
        } else {
            respList.innerHTML = '<li>No specific responsibilities listed.</li>';
        }
    }

    // Update benefits (if available)
    if (job.benefits && job.benefits.length > 0) {
        const benefitsSection = document.getElementById('benefitsSection');
        const benefitsList = document.getElementById('jobBenefits');
        if (benefitsSection && benefitsList) {
            benefitsSection.style.display = 'block';
            benefitsList.innerHTML = job.benefits.map(benefit => `<li>${benefit}</li>`).join('');
        }
    }

    // Update salary (if available)
    if (job.salary && job.salary.min && job.salary.max) {
        const salarySection = document.getElementById('salarySection');
        const salaryText = document.getElementById('jobSalary');
        if (salarySection && salaryText) {
            salarySection.style.display = 'block';
            salaryText.textContent = `${job.salary.currency} ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} per year`;
        }
    }

    // Store job ID for application
    sessionStorage.setItem('currentJobId', job._id || job.id);
    sessionStorage.setItem('currentJobTitle', job.title);
}

// Load applicants for this job and render profile cards
async function loadApplicantsForJob(jobId) {
    const listEl = document.getElementById('applicantsList');
    const countEl = document.getElementById('applicantsCount');
    const inlineListEl = document.getElementById('applicantsInlineList');

    if (!listEl || !inlineListEl) return;

    listEl.innerHTML = '<p class="muted">Loading applicants...</p>';
    inlineListEl.innerHTML = '<span class="muted">Loading...</span>';

    try {
        if (typeof firebaseJobs !== 'undefined' && firebaseJobs.getApplicationsByJob) {
            const res = await firebaseJobs.getApplicationsByJob(jobId);

            if (res.success && Array.isArray(res.data) && res.data.length > 0) {
                renderApplicants(res.data, listEl, countEl, inlineListEl);
                return;
            }
        }

        listEl.innerHTML = '<p class="muted">Applicants will appear once submissions are received.</p>';
        inlineListEl.innerHTML = '<span class="muted">No applicants yet.</span>';
    } catch (err) {
        console.error('Error loading applicants:', err);
        listEl.innerHTML = '<p class="muted">Unable to load applicants right now.</p>';
        inlineListEl.innerHTML = '<span class="muted">Unable to load applicants.</span>';
    }
}

function renderApplicants(applicants, listEl, countEl, inlineListEl) {
    if (countEl) countEl.textContent = applicants.length.toString();

    const cards = applicants.map(app => {
        const avatar = app.photoURL
            ? `<div class="avatar"><img src="${app.photoURL}" alt="${app.fullName || 'Applicant'}"></div>`
            : `<div class="avatar placeholder">${(app.fullName || 'A').charAt(0).toUpperCase()}</div>`;

        return `
            <div class="applicant-card">
                ${avatar}
            </div>
        `;
    }).join('');

    listEl.innerHTML = cards;
    inlineListEl.innerHTML = cards;
}

function formatDate(value) {
    if (!value) return '—';
    const date = value.toDate ? value.toDate() : new Date(value);
    if (isNaN(date)) return '—';
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

// Show application form
function showApplicationForm() {
    const jobId = sessionStorage.getItem('currentJobId');
    const jobTitle = sessionStorage.getItem('currentJobTitle');

    if (jobId) {
        // Redirect to application page
        window.location.href = `apply.html?job=${jobId}`;
    } else {
        showError('Job information not available');
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);

    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    console.log('Job details page loaded');

    const jobId = getJobIdFromURL();

    if (jobId) {
        console.log('Loading job:', jobId);
        fetchJobDetails(jobId);
    } else {
        showError('No job ID provided. Showing sample job.');
        displayJobDetails(MOCK_JOBS['mock-1']);
    }
});
