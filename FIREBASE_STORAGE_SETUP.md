# Firebase Storage Setup for FVC Careers

## Overview
Firebase Storage is now enabled for storing:
- **Resumes** (PDF, DOC, DOCX files)
- **Profile Photos** (JPG, PNG files)

## Storage Structure
```
fvc-careers.firebasestorage.app/
├── resumes/
│   └── {timestamp}_{filename}
└── photos/
    └── {timestamp}_{filename}
```

## Security Rules
You need to configure Firebase Storage Rules in the Firebase Console:

### Steps to Configure:
1. Go to [Firebase Console](https://console.firebase.google.com/project/fvc-careers/storage)
2. Click on "Rules" tab
3. Update the rules to allow uploads:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow resume uploads
    match /resumes/{fileName} {
      allow read: if true;  // Anyone can read resumes
      allow write: if request.resource.size < 10 * 1024 * 1024  // Max 10MB
                   && request.resource.contentType.matches('application/pdf|application/msword|application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    }
    
    // Allow photo uploads
    match /photos/{fileName} {
      allow read: if true;  // Anyone can read photos
      allow write: if request.resource.size < 5 * 1024 * 1024  // Max 5MB
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

## File Upload Limits
- **Resumes**: Max 10MB, PDF/DOC/DOCX only
- **Photos**: Max 5MB, Images only (JPG, PNG, etc.)

## Code Implementation

### Upload Function
The `submitApplication()` function in `firebase-jobs.js` handles file uploads:

```javascript
// Upload resume
if (resumeFile) {
    const storageRef = storage.ref();
    const resumePath = `resumes/${Date.now()}_${resumeFile.name}`;
    const resumeRef = storageRef.child(resumePath);
    await resumeRef.put(resumeFile);
    resumeURL = await resumeRef.getDownloadURL();
}

// Upload photo
if (photoFile) {
    const storageRef = storage.ref();
    const photoPath = `photos/${Date.now()}_${photoFile.name}`;
    const photoRef = storageRef.child(photoPath);
    await photoRef.put(photoFile);
    photoURL = await photoRef.getDownloadURL();
}
```

### File URLs
After upload, the download URLs are stored in Firestore:
- `resumeURL`: Direct link to the resume file
- `photoURL`: Direct link to the profile photo

## Testing
1. Navigate to the application form
2. Upload a resume and/or photo
3. Submit the application
4. Check Firebase Console > Storage to see uploaded files
5. Check Firestore > applications collection to see the URLs

## CORS Configuration
If you encounter CORS errors when accessing files:

1. Install Google Cloud SDK
2. Create a `cors.json` file:
```json
[
  {
    "origin": ["*"],
    "method": ["GET"],
    "maxAgeSeconds": 3600
  }
]
```

3. Run:
```bash
gsutil cors set cors.json gs://fvc-careers.firebasestorage.app
```

## Troubleshooting

### Storage Not Initialized
- Ensure `firebase-storage-compat.js` is loaded in HTML
- Check browser console for initialization errors
- Verify Firebase config includes `storageBucket`

### Upload Fails
- Check Firebase Storage Rules
- Verify file size limits
- Check file type restrictions
- Ensure user has internet connection

### CORS Errors
- Apply CORS configuration (see above)
- Check browser console for specific CORS errors
- Ensure Storage Rules allow read access
