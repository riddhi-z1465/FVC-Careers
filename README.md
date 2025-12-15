# FVC Careers Portal

A modern, full-stack featured careers and HR management platform built for FVC (Future Vision Company). This application facilitates the end-to-end recruitment process, from job posting to applicant tracking and assessment.

## Features

### 🎨 Candidate Experience
*   **Premium Design**: Modern, glassmorphism-inspired UI with smooth animations and responsive layout.
*   **Job Search**: Interactive search form with filters for role and location.
*   **Job Listings**: Dynamic job board fueled by Firebase/LocalStorage data.
*   **Application System**: Easy-to-use application form with file upload support for resumes and photos.
*   **Visual Feedback**: Real-time feedback for file uploads and form submission.

### 👩‍💼 HR Management Portal
*   **Dashboard**: Comprehensive overview of active jobs, applicant stats, and pending reviews.
*   **Job Management**: 
    *   Create, Edit, and **Delete** job postings.
    *   Toggle job visibility (active/past).
*   **Applicant Tracking System (ATS)**:
    *   View all applicants for a specific job.
    *   Status tracking (Received, Reviewing, Interview, Selected, Rejected).
    *   **Resume Viewing**: Direct links to uploaded resumes.
*   **Communication**:
    *   Built-in chat interface to communicate with candidates.
    *   "Discussion" panel to see online candidates and active threads.

### 🛠 Technical Architecture
*   **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+).
*   **Backend / Database**: 
    *   **Firebase Firestore**: For real-time data persistence (Jobs, Applications, Messages).
    *   **Firebase Storage**: For secure file hosting (Resumes, Profile Photos).
    *   **LocalStorage Fallback**: Robust offline-first design that switches to browser storage if Firebase is unavailable.
*   **Authentication**: Session-based HR login system.

## Deployment Links
* Candidate Carrers portal: https://fvc-careers.vercel.app/index.html
* HR portal: https://fvc-careers.vercel.app/hr/hr-login.html


## Project Structure

```
FVC/
├── index.html                 # Landing page for candidates
├── career/                    # Candidate-facing pages
│   ├── jobs.html              # Job listings page
│   ├── apply.html             # Job application form
│   ├── job-details.html       # Individual job view
│   ├── jobs.css
│   ├── apply.css
│   ├── job-details.css
│   └── js/
│       ├── jobs.js
│       ├── apply.js
│       └── job-details.js
├── hr/                        # HR portal
│   ├── hr-login.html          # HR authentication page
│   ├── hr-jobs.html           # Main HR Dashboard
│   ├── hr-portal.css
│   ├── hr-jobs.css
│   └── js/
│       ├── hr-login.js
│       └── hr-jobs.js
├── js/                        # Shared services
│   ├── firebase-config.js     # Firebase initialization
│   ├── firebase-jobs.js       # Data service layer
│   └── firebase-seed.js       # Sample seeding util
├── styles_aligned.css         # Main design system
├── navbar_complex.css
└── images/                    # Assets
```

## Setup & Running

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/riddhi-z1465/FVC-Careers.git
    cd FVC-Careers
    ```

2.  **Open the project**:
    You can simply open `index.html` in your browser. For the best experience (and to avoid CORS issues with file uploads), use a local development server.

    Using VS Code Live Server:
    *   Right-click `index.html`
    *   Select "Open with Live Server"

3.  **Firebase Configuration**:
    *   The project expects a `js/firebase-config.js` file.
    *   If missing, create one with your Firebase project credentials:
        ```javascript
        const firebaseConfig = {
            apiKey: "YOUR_API_KEY",
            authDomain: "YOUR_PROJECT.firebaseapp.com",
            projectId: "YOUR_PROJECT_ID",
            storageBucket: "YOUR_PROJECT.appspot.com",
            messagingSenderId: "...",
            appId: "..."
        };
        firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();
        const storage = firebase.storage();
        ```

## HR Access
*   Access the HR portal at `/hr/hr-login.html`.
*   Standard credentials (configurable in `hr-login.js`).

## Recent Updates
*   **Frontend**: Fixed styling inconsistencies and refined the search form design.
*   **Search**: Implemented a pill-shaped, centered search bar with visual enhancements.
*   **Functionality**: Fixed "Delete Job" and "Manage Job" buttons in HR dashboard.
*   **Data**: Enhanced data persistence logic to seamlessly handle hybrid cloud/local states.

---
**Status**: Production Ready 🚀
**Version**: 2.0.0
