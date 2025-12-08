// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';
const USE_MOCK_DATA = false; // Set to true if backend is not running

// Mock job data
const MOCK_JOB = {
    _id: 'mock-1',
    title: 'UX Designer, YouTube Paid Digital Goods',
    company: 'YouTube',
    location: 'Mumbai, India',
    jobType: 'Full-time',
    experience: 'Mid',
    qualifications: ['Bachelors', 'Masters'],
    skills: ['UX Design', 'UI Design', 'Figma'],
    description: `At Google, we follow a simple but vital premise: "Focus on the user and all else will follow." Google's Interaction Designers take complex tasks and make them intuitive and easy-to-use for billions of people around the globe. Throughout the design process—from creating user flows and wireframes to building user interface mockups and prototypes—you'll envision how people will experience our products, and bring that vision to life in a way that feels inspired, refined, and even magical.

Google User Experience (UX) is made up of multi-disciplinary teams of UX Designers, Researchers, Writers, Content Strategists, Program Managers, and Engineers. We care deeply about the people who use our products. The UX team plays an integral part in gathering insights about the attitudes, emotions, and behaviors of people who use our products to inspire and inform design. We collaborate closely with each other and with engineering and product management to create industry-leading products that deliver value for the people who use them, and for Google's businesses.

As an Interaction Designer, you'll rely on user-centered design methods to craft industry-leading user experiences—from concept to execution. Like all of our UX jobs, you'll collaborate with your design partners to leverage and evolve the Google design language to build beautiful, innovative, inspired products that people love to use.`,
    requirements: [
        'Bachelor\'s degree or equivalent practical experience.',
        '4 years of interaction design experience in product design or UX design.',
        'Experience with motion and prototyping tools (e.g., After Effects, Principle, or similar).',
        'Experience implementing visual design systems across multiple platforms and surfaces.',
        'Include a portfolio, website, or any other relevant link to your work in your resume (providing a viewable link or access instructions).'
    ],
    responsibilities: [
        'Collaborate with product managers, engineers, and cross-functional stakeholders to understand requirements, and provide creative, thoughtful solutions.',
        'Communicate the user experience at various stages of the design process with wireframes, flow diagrams, storyboards, mockups, or high-fidelity prototypes.',
        'Integrate user feedback and business requirements into ongoing product experience updates.',
        'Advocate for the prioritization of design-centered changes, refinements, and improvements.'
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
};

// Get job ID from URL
function getJobIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Fetch job details from API
async function fetchJobDetails(jobId) {
    try {
        if (USE_MOCK_DATA || jobId.startsWith('mock-')) {
            console.log('Using mock data for job:', jobId);
            displayJobDetails(MOCK_JOB);
            return;
        }

        const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`);

        if (!response.ok) {
            throw new Error('Backend not available');
        }

        const data = await response.json();

        if (data.success) {
            displayJobDetails(data.data);
        } else {
            showError('Job not found. Showing sample data.');
            displayJobDetails(MOCK_JOB);
        }
    } catch (error) {
        console.error('Error fetching job details:', error);
        console.log('Backend not available. Using sample data.');
        displayJobDetails(MOCK_JOB);
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
    if (job.requirements && job.requirements.length > 0) {
        const minQualList = document.getElementById('minQualifications');
        if (minQualList) {
            minQualList.innerHTML = job.requirements.map(req => `<li>${req}</li>`).join('');
        }
    }

    // Update preferred qualifications
    if (job.qualifications && job.qualifications.length > 0) {
        const prefQualList = document.getElementById('prefQualifications');
        if (prefQualList) {
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
        }
    }

    // Update responsibilities
    if (job.responsibilities && job.responsibilities.length > 0) {
        const respList = document.getElementById('jobResponsibilities');
        if (respList) {
            respList.innerHTML = job.responsibilities.map(resp => `<li>${resp}</li>`).join('');
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
    sessionStorage.setItem('currentJobId', job._id);
    sessionStorage.setItem('currentJobTitle', job.title);
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
        displayJobDetails(MOCK_JOB);
    }
});
