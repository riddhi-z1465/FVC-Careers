// HR Dashboard Logic

// Check authentication
if (sessionStorage.getItem('hrLoggedIn') !== 'true') {
    window.location.href = 'hr-login.html';
}

// Load user info
document.addEventListener('DOMContentLoaded', function () {
    const username = sessionStorage.getItem('hrUsername') || 'HR Admin';
    const role = sessionStorage.getItem('hrRole') || 'hr';

    document.getElementById('userName').textContent = username;
    document.getElementById('userRole').textContent = role === 'hr' ? 'HR Employer' : 'Administrator';

    // Load data
    loadApplications();
    loadJobs();
});

// Logout function
function logout() {
    sessionStorage.clear();
    window.location.href = 'hr-login.html';
}

// Sample applications data
const sampleApplications = [
    {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        position: 'UX Designer',
        appliedDate: '2025-12-07',
        status: 'new'
    },
    {
        id: 2,
        name: 'Michael Chen',
        email: 'michael.c@email.com',
        position: 'Frontend Developer',
        appliedDate: '2025-12-06',
        status: 'review'
    },
    {
        id: 3,
        name: 'Emily Rodriguez',
        email: 'emily.r@email.com',
        position: 'Product Manager',
        appliedDate: '2025-12-05',
        status: 'shortlisted'
    },
    {
        id: 4,
        name: 'David Kim',
        email: 'david.k@email.com',
        position: 'AI/ML Engineer',
        appliedDate: '2025-12-04',
        status: 'new'
    },
    {
        id: 5,
        name: 'Jessica Taylor',
        email: 'jessica.t@email.com',
        position: 'UX Designer',
        appliedDate: '2025-12-03',
        status: 'review'
    }
];

// Sample jobs data
const sampleJobs = [
    {
        id: 1,
        title: 'UX Designer',
        company: 'FVC',
        location: 'Mumbai, India',
        applications: 12,
        views: 245
    },
    {
        id: 2,
        title: 'Frontend Developer',
        company: 'FVC',
        location: 'Bangalore, India',
        applications: 8,
        views: 189
    },
    {
        id: 3,
        title: 'Product Manager',
        company: 'FVC',
        location: 'Delhi, India',
        applications: 15,
        views: 312
    },
    {
        id: 4,
        title: 'AI/ML Engineer',
        company: 'FVC',
        location: 'Hyderabad, India',
        applications: 6,
        views: 156
    },
    {
        id: 5,
        title: 'Backend Developer',
        company: 'FVC',
        location: 'Pune, India',
        applications: 10,
        views: 198
    },
    {
        id: 6,
        title: 'DevOps Engineer',
        company: 'FVC',
        location: 'Chennai, India',
        applications: 7,
        views: 134
    }
];

// Load applications
function loadApplications() {
    const tableBody = document.getElementById('applicationsTable');

    const html = sampleApplications.map(app => `
        <tr>
            <td>
                <div class="candidate-info">
                    <div class="candidate-avatar">${app.name.charAt(0)}</div>
                    <div>
                        <div class="candidate-name">${app.name}</div>
                        <div class="candidate-email">${app.email}</div>
                    </div>
                </div>
            </td>
            <td>${app.position}</td>
            <td>${formatDate(app.appliedDate)}</td>
            <td>
                <span class="status-badge ${app.status}">
                    ${getStatusText(app.status)}
                </span>
            </td>
            <td>
                <div class="action-btns">
                    <button class="action-btn" onclick="viewApplication(${app.id})">View</button>
                    <button class="action-btn" onclick="updateStatus(${app.id})">Update</button>
                </div>
            </td>
        </tr>
    `).join('');

    tableBody.innerHTML = html;
}

// Load jobs
function loadJobs() {
    const jobsGrid = document.getElementById('jobsGrid');

    const html = sampleJobs.map(job => `
        <div class="job-card">
            <div class="job-card-header">
                <div class="job-title">${job.title}</div>
                <div class="job-company">${job.company} • ${job.location}</div>
            </div>
            <div class="job-stats">
                <div class="job-stat">
                    <strong>${job.applications}</strong> Applications
                </div>
                <div class="job-stat">
                    <strong>${job.views}</strong> Views
                </div>
            </div>
        </div>
    `).join('');

    jobsGrid.innerHTML = html;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Get status text
function getStatusText(status) {
    const statusMap = {
        'new': 'New',
        'review': 'Under Review',
        'shortlisted': 'Shortlisted',
        'rejected': 'Rejected',
        'accepted': 'Accepted'
    };
    return statusMap[status] || status;
}

// View application
function viewApplication(id) {
    const app = sampleApplications.find(a => a.id === id);
    if (app) {
        alert(`Viewing application from ${app.name}\n\nPosition: ${app.position}\nEmail: ${app.email}\nStatus: ${getStatusText(app.status)}`);
    }
}

// Update status
function updateStatus(id) {
    const app = sampleApplications.find(a => a.id === id);
    if (app) {
        const newStatus = prompt(`Update status for ${app.name}:\n\n1. New\n2. Under Review\n3. Shortlisted\n4. Rejected\n5. Accepted\n\nEnter number (1-5):`);

        const statusMap = {
            '1': 'new',
            '2': 'review',
            '3': 'shortlisted',
            '4': 'rejected',
            '5': 'accepted'
        };

        if (statusMap[newStatus]) {
            app.status = statusMap[newStatus];
            loadApplications();
            alert('Status updated successfully!');
        }
    }
}
