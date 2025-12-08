# Firebase Setup Guide for FVC Careers

## 🔥 Firebase Integration Complete!

Your FVC Careers website is now ready to use Firebase instead of MongoDB/Express backend.

---

## 📋 **What's Been Set Up:**

### **Files Created:**
1. ✅ `js/firebase-config.js` - Firebase initialization
2. ✅ `js/firebase-jobs.js` - Firestore database operations
3. ✅ `js/firebase-seed.js` - Sample data seeder
4. ✅ Updated `jobs.html` - Added Firebase SDK scripts

### **Features:**
- ✅ Firestore database for jobs & applications
- ✅ Firebase Storage for resume uploads
- ✅ Real-time data synchronization
- ✅ Client-side filtering and search
- ✅ File upload handling
- ✅ Application tracking

---

## 🚀 **Setup Steps:**

### **Step 1: Create Firebase Project**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `fvc-careers`
4. Disable Google Analytics (optional)
5. Click "Create project"

### **Step 2: Enable Firestore Database**

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click "Create database"
3. Choose **Start in test mode** (for development)
4. Select your region (e.g., `asia-south1` for India)
5. Click "Enable"

### **Step 3: Enable Firebase Storage**

1. Go to **Build** → **Storage**
2. Click "Get started"
3. Choose **Start in test mode**
4. Click "Done"

### **Step 4: Get Firebase Config**

1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps"
3. Click the **Web** icon (`</>`)
4. Register app name: `FVC Careers Web`
5. Copy the `firebaseConfig` object

### **Step 5: Update Firebase Config**

Open `js/firebase-config.js` and replace with your config:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "fvc-careers.firebaseapp.com",
    projectId: "fvc-careers",
    storageBucket: "fvc-careers.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456"
};
```

### **Step 6: Seed the Database**

1. Open `jobs.html` in your browser
2. Open browser console (F12)
3. Run: `seedFirebase()`
4. You should see: `✅ Successfully seeded 6 jobs to Firebase!`

---

## 📊 **Firestore Database Structure:**

### **Collections:**

#### **jobs** Collection:
```javascript
{
  id: "auto-generated-id",
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
  applicationsCount: 0,
  postedDate: Timestamp,
  createdAt: Timestamp
}
```

#### **applications** Collection:
```javascript
{
  id: "auto-generated-id",
  jobId: "job-document-id",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "+1234567890",
  location: "Mumbai, India",
  resumeURL: "https://storage.googleapis.com/...",
  portfolio: "https://...",
  linkedin: "https://...",
  degree: "Bachelors",
  institution: "MIT",
  graduationYear: "2020",
  experienceYears: 3,
  currentRole: "UX Designer",
  currentCompany: "ABC Corp",
  status: "Submitted",
  appliedDate: Timestamp,
  createdAt: Timestamp
}
```

---

## 🔧 **Firebase Security Rules:**

### **Firestore Rules** (for production):

Go to **Firestore Database** → **Rules** and update:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Jobs collection - read by anyone, write by admin only
    match /jobs/{jobId} {
      allow read: if true;
      allow write: if false; // Change to admin auth check
    }
    
    // Applications collection - write by anyone, read by admin only
    match /applications/{applicationId} {
      allow create: if true;
      allow read, update, delete: if false; // Change to admin auth check
    }
  }
}
```

### **Storage Rules**:

Go to **Storage** → **Rules** and update:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /resumes/{fileName} {
      allow read: if false; // Only admin can read
      allow write: if request.resource.size < 10 * 1024 * 1024 // 10MB limit
                   && request.resource.contentType.matches('application/pdf|application/msword|application/vnd.*');
    }
  }
}
```

---

## 💻 **How to Use:**

### **Fetch Jobs:**
```javascript
const result = await firebaseJobs.fetchJobs({
    search: 'UX Designer',
    location: 'Mumbai',
    jobType: ['Full-time'],
    experience: ['Mid']
});

console.log(result.data); // Array of jobs
```

### **Get Single Job:**
```javascript
const result = await firebaseJobs.getJobById('job-id-here');
console.log(result.data); // Job object
```

### **Submit Application:**
```javascript
const applicationData = {
    jobId: 'job-id',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    location: 'Mumbai',
    portfolio: 'https://...',
    degree: 'Bachelors',
    institution: 'MIT',
    graduationYear: '2020',
    experienceYears: 3,
    currentRole: 'UX Designer',
    currentCompany: 'ABC Corp'
};

const resumeFile = document.getElementById('resume').files[0];

const result = await firebaseJobs.submitApplication(applicationData, resumeFile);
console.log(result.message); // "Application submitted successfully"
```

---

## 🎯 **Testing:**

### **1. Test Firebase Connection:**
```javascript
// Open browser console on jobs.html
console.log(db); // Should show Firestore instance
console.log(storage); // Should show Storage instance
```

### **2. Seed Database:**
```javascript
await seedFirebase();
// Should see: ✅ Successfully seeded 6 jobs to Firebase!
```

### **3. Fetch Jobs:**
```javascript
const jobs = await firebaseJobs.fetchJobs({});
console.log(jobs.data); // Should show 6 jobs
```

### **4. Test Filters:**
```javascript
const filteredJobs = await firebaseJobs.fetchJobs({
    location: 'Mumbai, India',
    jobType: ['Full-time']
});
console.log(filteredJobs.data); // Should show filtered results
```

---

## 📱 **Complete User Flow:**

```
1. User opens jobs.html
   ↓
2. Firebase loads jobs from Firestore
   ↓
3. User applies filters
   ↓
4. Jobs filtered in real-time
   ↓
5. User clicks "Learn More"
   ↓
6. Job details loaded from Firestore
   ↓
7. User clicks "Apply Now"
   ↓
8. Application form opened
   ↓
9. User fills form and uploads resume
   ↓
10. Resume uploaded to Firebase Storage
    ↓
11. Application saved to Firestore
    ↓
12. Success message shown
```

---

## 🔄 **Migration from MongoDB:**

### **What Changed:**
- ❌ No more Express backend needed
- ❌ No more MongoDB setup
- ✅ Direct browser → Firebase connection
- ✅ Real-time updates
- ✅ Automatic scaling
- ✅ Built-in file storage

### **Benefits:**
- 🚀 Faster development
- 💰 No server costs (free tier)
- 🔒 Built-in security
- 📊 Real-time analytics
- 🌍 Global CDN
- 🔄 Automatic backups

---

## 🐛 **Troubleshooting:**

### **"Firebase is not defined"**
- Make sure Firebase SDK scripts are loaded
- Check browser console for script errors
- Verify Firebase CDN URLs are accessible

### **"Permission denied"**
- Update Firestore security rules
- Make sure you're in test mode for development

### **"Jobs not loading"**
- Run `seedFirebase()` in console
- Check Firestore console for data
- Verify Firebase config is correct

### **"Resume upload failed"**
- Check file size (< 10MB)
- Verify file type (PDF, DOC, DOCX)
- Update Storage security rules

---

## 📚 **Resources:**

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Storage Guide](https://firebase.google.com/docs/storage)
- [Security Rules](https://firebase.google.com/docs/rules)

---

## ✅ **Next Steps:**

1. **Create Firebase project** (5 minutes)
2. **Enable Firestore & Storage** (2 minutes)
3. **Copy Firebase config** (1 minute)
4. **Update firebase-config.js** (1 minute)
5. **Seed database** (30 seconds)
6. **Test the website** (enjoy!)

---

## 🎉 **You're All Set!**

Your FVC Careers website now uses Firebase for:
- ✅ Job listings storage
- ✅ Application management
- ✅ Resume file uploads
- ✅ Real-time updates

No backend server needed! 🚀
