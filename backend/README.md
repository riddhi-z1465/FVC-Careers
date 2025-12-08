# FVC Careers Website - Backend Setup

## Overview
This is the backend API for the FVC Careers website, built with Node.js, Express, and MongoDB.

## Features
- ✅ Job listings with advanced search and filtering
- ✅ Job application submission with file upload
- ✅ RESTful API endpoints
- ✅ MongoDB database integration
- ✅ Resume file upload support
- ✅ Application status tracking

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

Edit `.env` and configure:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fvc-careers
```

### 3. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Or manually
mongod --dbpath /path/to/data/directory
```

### 4. Seed the Database
Populate the database with sample jobs:
```bash
node seed.js
```

### 5. Start the Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5000/api`

## API Endpoints

### Jobs

#### GET /api/jobs
Get all jobs with optional filters
```
Query Parameters:
- search: Text search in title, description, skills
- location: Filter by location
- jobType: Filter by job type (can be multiple)
- experience: Filter by experience level (can be multiple)
- qualifications: Filter by qualifications (can be multiple)
- skills: Filter by skills (can be multiple)
- page: Page number (default: 1)
- limit: Items per page (default: 10)

Example:
GET /api/jobs?location=Mumbai&jobType=Full-time&experience=Mid&page=1&limit=10
```

#### GET /api/jobs/:id
Get single job by ID
```
Example:
GET /api/jobs/507f1f77bcf86cd799439011
```

#### POST /api/jobs
Create a new job (admin only)
```json
{
  "title": "UX Designer",
  "company": "FVC",
  "location": "Mumbai, India",
  "jobType": "Full-time",
  "experience": "Mid",
  "qualifications": ["Bachelors", "Masters"],
  "skills": ["UX Design", "Figma"],
  "description": "Job description here...",
  "department": "Design"
}
```

#### GET /api/jobs/meta/filters
Get available filter options
```
Returns:
- locations
- departments
- skills
- jobTypes
- experienceLevels
- qualifications
```

### Applications

#### POST /api/applications
Submit a job application
```
Form Data:
- jobId: Job ID
- firstName: Applicant first name
- lastName: Applicant last name
- email: Email address
- phone: Phone number
- location: Location
- resume: Resume file (PDF/DOC)
- coverLetter: Cover letter text
- portfolio: Portfolio URL (optional)
- linkedin: LinkedIn URL (optional)
- experienceYears: Years of experience
- currentRole: Current job title
- currentCompany: Current company
- degree: Education degree
- institution: Education institution
- graduationYear: Graduation year
```

#### GET /api/applications
Get all applications (admin only)
```
Query Parameters:
- jobId: Filter by job ID
- status: Filter by status
- page: Page number
- limit: Items per page
```

#### GET /api/applications/:id
Get single application by ID

#### PUT /api/applications/:id/status
Update application status
```json
{
  "status": "Under Review",
  "note": "Scheduled for interview"
}
```

## Database Schema

### Job Model
```javascript
{
  title: String,
  company: String,
  location: String,
  jobType: String, // Full-time, Part-time, Intern, Temporary
  experience: String, // Intern, Early, Mid, Advanced, Director+
  qualifications: [String],
  skills: [String],
  description: String,
  responsibilities: [String],
  requirements: [String],
  benefits: [String],
  salary: { min, max, currency },
  department: String,
  isActive: Boolean,
  postedDate: Date,
  applicationDeadline: Date,
  applicationsCount: Number
}
```

### Application Model
```javascript
{
  jobId: ObjectId,
  applicant: {
    firstName, lastName, email, phone, location
  },
  resume: { filename, path, uploadDate },
  coverLetter: String,
  portfolio: String,
  linkedin: String,
  experience: { years, currentRole, currentCompany },
  education: { degree, institution, graduationYear },
  status: String, // Submitted, Under Review, Interview Scheduled, Rejected, Accepted
  notes: [{ content, addedBy, addedAt }],
  appliedDate: Date
}
```

## Frontend Integration

Add this to your HTML:
```html
<script src="js/jobs.js"></script>
```

The frontend will automatically:
- Fetch jobs from the API
- Handle search and filtering
- Display job listings
- Show job details
- Submit applications

## File Upload

Resumes are stored in `uploads/resumes/` directory.
Supported formats: PDF, DOC, DOCX
Maximum file size: 5MB

## Error Handling

All API responses follow this format:
```json
{
  "success": true/false,
  "data": {...},
  "error": "Error message if any",
  "message": "Success message if any"
}
```

## Development

### Running Tests
```bash
npm test
```

### Code Structure
```
backend/
├── models/          # Database models
├── routes/          # API routes
├── uploads/         # Uploaded files
├── server.js        # Main server file
├── seed.js          # Database seeder
└── package.json     # Dependencies
```

## Production Deployment

1. Set environment variables in production
2. Use a process manager (PM2):
```bash
npm install -g pm2
pm2 start server.js --name fvc-api
```

3. Set up reverse proxy (nginx)
4. Enable HTTPS
5. Set up MongoDB Atlas for cloud database

## Security Considerations

- Add authentication middleware for admin routes
- Implement rate limiting
- Validate and sanitize all inputs
- Use HTTPS in production
- Implement CORS properly
- Add file upload validation
- Use environment variables for sensitive data

## Support

For issues or questions, contact: support@fvc.com

## License

Copyright © 2025 FVC MEA DMCC. All rights reserved.
