// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';
const USE_MOCK_DATA = false; // Disable mock data so only real/Firebase jobs show

// Sample mock data for testing without backend
const MOCK_JOBS = [
    {
        _id: 'mock-1',
        title: 'UX Designer, YouTube Paid Digital Goods',
        company: 'YouTube',
        location: 'Mumbai, India',
        jobType: 'Full-time',
        experience: 'Mid',
        description: 'At Google, we follow a simple and well-proven "Focus on the user and all else will follow." Google\'s Interaction Designers take complex tasks and make them intuitive and easy-to-use for billions of people around the globe.',
        requirements: [
            'Bachelor\'s degree or equivalent practical experience',
            '4 years of interaction design experience',
            'Experience with prototyping tools'
        ],
        responsibilities: [
            'Design user interfaces',
            'Collaborate with teams',
            'Create wireframes and prototypes'
        ]
    },
    {
        _id: 'mock-2',
        title: 'AI/ML Engineer',
        company: 'FVC',
        location: 'Bangalore, India',
        jobType: 'Full-time',
        experience: 'Mid',
        description: 'Develop smart models that help automate decisions and unlock new insights. Work on cutting-edge AI/ML projects.',
        requirements: [
            '3+ years of ML engineering experience',
            'Strong Python skills',
            'Experience with TensorFlow or PyTorch'
        ],
        responsibilities: [
            'Design ML models',
            'Optimize performance',
            'Deploy to production'
        ]
    },
    {
        _id: 'mock-3',
        title: 'Product Manager',
        company: 'FVC',
        location: 'Delhi, India',
        jobType: 'Full-time',
        experience: 'Mid',
        description: 'Drive product direction, align teams, and ensure every feature solves a real problem.',
        requirements: [
            '4+ years of product management',
            'Strong analytical skills',
            'Agile experience'
        ],
        responsibilities: [
            'Define product vision',
            'Manage roadmap',
            'Work with cross-functional teams'
        ]
    }
];

// State management
let currentFilters = {
    search: '',
    location: '',
    experience: [],
    jobType: [],
    qualifications: [],
    skills: []
};

let currentPage = 1;
const jobsPerPage = 10;

// Fetch jobs from API or use mock data
async function fetchJobs() {
    console.log('🔍 fetchJobs called, USE_MOCK_DATA:', USE_MOCK_DATA);
    try {
        // Try to fetch from Firebase first
        if (typeof firebaseJobs !== 'undefined' && firebaseJobs.fetchJobs) {
            console.log('📡 Fetching jobs from Firebase...');

            const result = await firebaseJobs.fetchJobs(currentFilters);

            if (result.success && result.data && result.data.length > 0) {
                console.log(`✅ Loaded ${result.data.length} jobs from Firebase`);

                // Combine with Mock Data if enabled
                let allJobs = result.data;
                if (USE_MOCK_DATA) {
                    console.log('➕ Merging with MOCK_JOBS');
                    allJobs = [...result.data, ...MOCK_JOBS];
                }

                displayJobs(allJobs);

                if (result.pagination) {
                    updatePagination(result.pagination);
                }
                return;
            } else {
                console.log('⚠️ No jobs in Firebase, using mock data');
            }
        }

        // Fallback to mock data
        if (USE_MOCK_DATA) {
            console.log('✅ Using MOCK_JOBS, not calling backend API');

            // Get locally saved jobs (from HR dashboard)
            let localJobs = [];
            try {
                localJobs = JSON.parse(localStorage.getItem('fvc_jobs_local_storage') || '[]');
                console.log(`📂 Loaded ${localJobs.length} local jobs`);
            } catch (e) {
                console.error('Error loading local jobs:', e);
            }

            // Merge local jobs with mock jobs (local jobs first)
            displayJobs([...localJobs, ...MOCK_JOBS]);
            return;
        }

        // Build query parameters for backend API
        const params = new URLSearchParams();

        if (currentFilters.search) params.append('search', currentFilters.search);
        if (currentFilters.location) params.append('location', currentFilters.location);

        currentFilters.experience.forEach(exp => params.append('experience', exp));
        currentFilters.jobType.forEach(type => params.append('jobType', type));
        currentFilters.qualifications.forEach(qual => params.append('qualifications', qual));
        currentFilters.skills.forEach(skill => params.append('skills', skill));

        params.append('page', currentPage);
        params.append('limit', jobsPerPage);

        const response = await fetch(`${API_BASE_URL}/jobs?${params}`);

        if (!response.ok) {
            throw new Error('Backend not available');
        }

        const data = await response.json();

        if (data.success) {
            displayJobs(data.data);
            updatePagination(data.pagination);
        } else {
            console.error('Error fetching jobs:', data.error);
            showError('Failed to load jobs. Please try again later.');
            displayJobs([]);
        }
    } catch (error) {
        console.error('Error:', error);
        console.log('Backend not available. No jobs to display.');
        displayJobs([]);
    }
}

// Display jobs in the UI
function displayJobs(jobs) {
    const container = document.querySelector('.job-listings .container');

    if (!container) {
        console.error('Job listings container not found');
        return;
    }

    if (jobs.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <h3>No jobs found</h3>
                <p>Try adjusting your filters or search criteria</p>
            </div>
        `;
        return;
    }

    container.innerHTML = jobs.map(job => `
        <div class="job-listing-card" data-job-id="${job._id || job.id}">
            <div class="job-header">
                <h2 class="job-title">${job.title}</h2>
                <div class="job-meta">
                    <span class="meta-item">
                        <span class="icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="22.01"></line><line x1="15" y1="22" x2="15" y2="22.01"></line><line x1="9" y1="18" x2="9" y2="18.01"></line><line x1="15" y1="18" x2="15" y2="18.01"></line><line x1="9" y1="14" x2="9" y2="14.01"></line><line x1="15" y1="14" x2="15" y2="14.01"></line><line x1="9" y1="10" x2="9" y2="10.01"></line><line x1="15" y1="10" x2="15" y2="10.01"></line><line x1="9" y1="6" x2="9" y2="6.01"></line><line x1="15" y1="6" x2="15" y2="6.01"></line></svg>
                        </span> ${job.company || 'FVC'}
                    </span>
                    <span class="meta-item">
                        <span class="icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        </span> ${job.location || 'Remote'}
                    </span>
                    <span class="meta-item">
                        <span class="icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                        </span> ${job.jobType || job.type || 'Full-time'}
                    </span>
                </div>
            </div>
            <div class="job-content">
                <h3>About</h3>
                <p>${job.description ? (job.description.substring(0, 300) + (job.description.length > 300 ? '...' : '')) : 'No description available'}</p>
            </div>
            <button class="learn-more-btn" onclick="viewJobDetails('${job._id || job.id}')">Learn More</button>
        </div>
    `).join('');
}

// Update pagination
function updatePagination(pagination) {
    console.log('Pagination:', pagination);
}

// Handle filter changes
function handleFilterChange(filterType, value, isChecked) {
    if (isChecked) {
        if (!currentFilters[filterType].includes(value)) {
            currentFilters[filterType].push(value);
        }
    } else {
        currentFilters[filterType] = currentFilters[filterType].filter(v => v !== value);
    }

    currentPage = 1;
    fetchJobs();
}

// Handle search
function handleSearch() {
    const searchInput = document.querySelector('.search-input');
    const locationInput = document.querySelectorAll('.search-input')[1];

    if (searchInput) currentFilters.search = searchInput.value;
    if (locationInput) currentFilters.location = locationInput.value;

    currentPage = 1;
    fetchJobs();
}

// Clear all filters
function clearAllFilters() {
    currentFilters = {
        search: '',
        location: '',
        experience: [],
        jobType: [],
        qualifications: [],
        skills: []
    };

    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });

    document.querySelectorAll('.search-input').forEach(input => {
        input.value = '';
    });

    const skillTags = document.querySelector('.selected-skills');
    if (skillTags) {
        skillTags.innerHTML = '';
    }

    currentPage = 1;
    fetchJobs();
}

// View job details
function viewJobDetails(jobId) {
    console.log('Viewing job details for:', jobId);
    window.location.href = `job-details.html?id=${jobId}`;
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

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function () {
    console.log('Jobs page loaded');

    // Fetch initial jobs
    fetchJobs();

    // Add event listeners to search inputs
    const searchInputs = document.querySelectorAll('.search-input');
    searchInputs.forEach(input => {
        input.addEventListener('keyup', function (e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    });

    // Add event listeners to filter checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const filterType = this.name;
            const value = this.id;
            handleFilterChange(filterType, value, this.checked);
        });
    });
});

// Toggle dropdown visibility
// Toggle dropdown visibility
function toggleDropdown(filterId, event) {
    // Prevent event from bubbling to document click handler
    if (event) {
        event.stopPropagation();
    }

    console.log('[DEBUG] Toggling dropdown:', filterId);
    const dropdown = document.getElementById(filterId);
    const allDropdowns = document.querySelectorAll('.dropdown-content');

    if (!dropdown) {
        console.error('Dropdown not found:', filterId);
        return;
    }

    // Close all other dropdowns
    allDropdowns.forEach(d => {
        if (d.id !== filterId) {
            d.classList.remove('show');
        }
    });

    // Toggle current dropdown
    dropdown.classList.toggle('show');
    console.log('[DEBUG] Dropdown class list:', dropdown.classList);
}

// Clear all filters
function clearFilters() {
    // Uncheck all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Reset active filters
    activeFilters = {
        experience: [],
        skills: [],
        qualifications: [],
        jobType: []
    };

    // Reload jobs
    loadJobs();

    // Close all dropdowns
    document.querySelectorAll('.dropdown-content').forEach(dropdown => {
        dropdown.classList.remove('show');
    });
}

// Close dropdowns when clicking outside
document.addEventListener('click', function (event) {
    if (!event.target.matches('.filter-btn') && !event.target.closest('.filter-dropdown')) {
        document.querySelectorAll('.dropdown-content').forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    }
});
