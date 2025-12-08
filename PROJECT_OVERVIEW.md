# FVC Careers Website - Complete Project Overview

## 📋 Project Structure

```
FVC/
├── index.html                 # Main careers homepage
├── jobs.html                  # Job search/listings page
├── styles_aligned.css         # Main stylesheet
├── jobs.css                   # Jobs page specific styles
├── js/
│   └── jobs.js               # Frontend API integration
├── images/                    # Image assets
│   ├── hero-image.jpg
│   ├── job-notes.jpg
│   ├── ux-expert.jpg
│   ├── product-manager.jpg
│   ├── office-location.jpg
│   ├── team-meeting.jpg
│   └── life-1.jpg through life-6.jpg
└── backend/                   # Backend API
    ├── server.js             # Express server
    ├── models/               # Database models
    │   ├── Job.js
    │   └── Application.js
    ├── routes/               # API routes
    │   ├── jobs.js
    │   └── applications.js
    ├── uploads/              # File uploads
    │   └── resumes/
    ├── seed.js               # Database seeder
    ├── package.json
    ├── .env.example
    └── README.md
```

## 🎯 Features Implemented

### Frontend

#### 1. **Homepage (index.html)**
- ✅ Responsive navigation bar
- ✅ Hero section with image
- ✅ Job search form
- ✅ Featured job roles section
- ✅ Locations section
- ✅ Team section
- ✅ Life at FVC gallery
- ✅ Comprehensive footer
- ✅ Modern, clean design matching reference

#### 2. **Jobs Page (jobs.html)**
- ✅ Search functionality (role & location)
- ✅ Interactive filter dropdowns:
  - Experience levels
  - Job types
  - Qualifications
  - Skills (with search)
- ✅ Job listing cards
- ✅ Pagination support
- ✅ Job details modal
- ✅ Apply button integration

#### 3. **Design System**
- ✅ Consistent color scheme
- ✅ Typography (Figtree & Manrope fonts)
- ✅ Hover effects and animations
- ✅ Responsive layout
- ✅ Glassmorphism effects
- ✅ Modern UI components

### Backend

#### 1. **API Endpoints**
- ✅ GET /api/jobs - List jobs with filters
- ✅ GET /api/jobs/:id - Get job details
- ✅ POST /api/jobs - Create job
- ✅ PUT /api/jobs/:id - Update job
- ✅ DELETE /api/jobs/:id - Delete job
- ✅ GET /api/jobs/meta/filters - Get filter options
- ✅ POST /api/applications - Submit application
- ✅ GET /api/applications - List applications
- ✅ PUT /api/applications/:id/status - Update status

#### 2. **Features**
- ✅ Advanced search with text indexing
- ✅ Multi-filter support
- ✅ Pagination
- ✅ File upload (resumes)
- ✅ Application tracking
- ✅ Duplicate application prevention
- ✅ MongoDB integration
- ✅ RESTful API design

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (v4.4+)
- Modern web browser

### Quick Start

#### 1. Backend Setup
```bash
cd backend
chmod +x setup.sh
./setup.sh
```

Or manually:
```bash
cd backend
npm install
cp .env.example .env
node seed.js
npm run dev
```

#### 2. Frontend Setup
Simply open `index.html` in your browser or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server -p 8000
```

Visit: `http://localhost:8000`

## 📡 API Integration

### Frontend → Backend Connection

The `js/jobs.js` file handles all API communication:

```javascript
// Fetch jobs with filters
fetchJobs()

// Handle filter changes
handleFilterChange(filterType, value, isChecked)

// Search jobs
handleSearch()

// View job details
viewJobDetails(jobId)

// Clear all filters
clearAllFilters()
```

### Example API Calls

**Search for UX Designer jobs in Mumbai:**
```
GET /api/jobs?search=UX Designer&location=Mumbai
```

**Filter by experience and job type:**
```
GET /api/jobs?experience=Mid&experience=Advanced&jobType=Full-time
```

**Get job details:**
```
GET /api/jobs/507f1f77bcf86cd799439011
```

**Submit application:**
```
POST /api/applications
Content-Type: multipart/form-data

{
  jobId, firstName, lastName, email, phone,
  resume (file), coverLetter, ...
}
```

## 🎨 Design Highlights

### Color Palette
- Primary: `#F45B69` (Coral Red)
- Background: `#F4F4FA` (Light Gray)
- Text: `#2d3436` (Dark Gray)
- Accent: `#FFC5C5` (Light Pink)

### Typography
- Headings: Manrope (200, 700)
- Body: Figtree (400, 500, 600)

### Components
- Rounded corners (8px - 40px)
- Subtle shadows
- Smooth transitions (0.3s)
- Hover effects
- Interactive dropdowns

## 📊 Database Schema

### Jobs Collection
```javascript
{
  _id: ObjectId,
  title: "UX Designer",
  company: "FVC",
  location: "Mumbai, India",
  jobType: "Full-time",
  experience: "Mid",
  qualifications: ["Bachelors", "Masters"],
  skills: ["UX Design", "Figma"],
  description: "...",
  responsibilities: [...],
  requirements: [...],
  benefits: [...],
  salary: { min: 80000, max: 120000, currency: "USD" },
  department: "Design",
  isActive: true,
  postedDate: Date,
  applicationsCount: 0
}
```

### Applications Collection
```javascript
{
  _id: ObjectId,
  jobId: ObjectId,
  applicant: {
    firstName, lastName, email, phone, location
  },
  resume: { filename, path },
  coverLetter: "...",
  portfolio: "...",
  linkedin: "...",
  experience: { years, currentRole, currentCompany },
  education: { degree, institution, graduationYear },
  status: "Submitted",
  appliedDate: Date
}
```

## 🔧 Configuration

### Environment Variables (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fvc-careers
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-password
```

### Frontend API URL
Update in `js/jobs.js`:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

## 🧪 Testing

### Test API Health
```bash
curl http://localhost:5000/api/health
```

### Test Job Listing
```bash
curl http://localhost:5000/api/jobs
```

### Test Filters
```bash
curl "http://localhost:5000/api/jobs?location=Mumbai&jobType=Full-time"
```

## 📱 Responsive Design

The website is fully responsive:
- **Desktop**: Full layout with all features
- **Tablet**: Adapted grid layouts
- **Mobile**: Stacked layouts, mobile-friendly navigation

Breakpoints:
- Desktop: 1024px+
- Tablet: 768px - 1023px
- Mobile: < 768px

## 🔐 Security Considerations

### Current Implementation
- CORS enabled
- File upload validation
- Input sanitization
- Error handling

### Production Recommendations
- Add authentication (JWT)
- Implement rate limiting
- Use HTTPS
- Validate all inputs
- Sanitize user data
- Add CSRF protection
- Use environment variables
- Implement logging

## 🚢 Deployment

### Backend (Node.js)
- **Heroku**: `git push heroku main`
- **DigitalOcean**: Use PM2 + nginx
- **AWS**: Elastic Beanstalk or EC2
- **Vercel**: Serverless functions

### Frontend
- **Netlify**: Drag & drop
- **Vercel**: Git integration
- **GitHub Pages**: Static hosting
- **AWS S3**: Static website hosting

### Database
- **MongoDB Atlas**: Cloud database
- **mLab**: Managed MongoDB
- **Self-hosted**: VPS with MongoDB

## 📈 Future Enhancements

### Planned Features
- [ ] User authentication (candidates & admins)
- [ ] Email notifications
- [ ] Application status tracking for candidates
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] Interview scheduling
- [ ] Candidate profile management
- [ ] Job recommendations
- [ ] Social media integration
- [ ] Multi-language support

### Technical Improvements
- [ ] Add unit tests
- [ ] Implement caching (Redis)
- [ ] Add API documentation (Swagger)
- [ ] Implement search optimization
- [ ] Add real-time notifications (WebSockets)
- [ ] Implement CI/CD pipeline
- [ ] Add monitoring (Sentry, LogRocket)

## 📞 Support

For questions or issues:
- Email: support@fvc.com
- Documentation: See README files
- API Docs: http://localhost:5000/api/docs (coming soon)

## 📄 License

Copyright © 2025 FVC MEA DMCC. All rights reserved.

---

**Built with ❤️ for FVC Careers**
