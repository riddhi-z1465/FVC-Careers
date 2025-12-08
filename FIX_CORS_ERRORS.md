# 🔧 Fix Firebase Storage CORS Errors

## 🔴 The Problem

Even with a local server, Firebase Storage is blocking file uploads because:
- Firebase Storage bucket doesn't have CORS configured
- Browser sends a "preflight" request that gets rejected

## ✅ Solution: Configure Firebase Storage CORS

### **Method 1: Using Firebase Console (Easiest)**

1. **Go to Firebase Console:**
   - Visit: https://console.firebase.google.com
   - Select your project: **fvc-careers**

2. **Navigate to Storage:**
   - Click "Storage" in left sidebar
   - Click "Rules" tab

3. **Update Storage Rules:**
   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read, write: if true;  // Allow all for testing
       }
     }
   }
   ```

4. **Click "Publish"**

---

### **Method 2: Using Google Cloud Console**

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com
   - Select project: **fvc-careers**

2. **Navigate to Cloud Storage:**
   - Click menu → "Cloud Storage" → "Buckets"
   - Click on bucket: **fvc-careers.firebasestorage.app** or **fvc-careers.appspot.com**

3. **Configure CORS:**
   - Click "Permissions" tab
   - Click "CORS" section
   - Click "Edit CORS configuration"
   - Paste this:
   ```json
   [
     {
       "origin": ["http://localhost:8000", "http://localhost:3000", "https://fvc-careers.web.app"],
       "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
       "responseHeader": ["Content-Type", "Access-Control-Allow-Origin"],
       "maxAgeSeconds": 3600
     }
   ]
   ```
   - Click "Save"

---

### **Method 3: Using gcloud CLI (Advanced)**

If you have Google Cloud SDK installed:

```bash
# Install if needed
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Initialize
gcloud init

# Set CORS
gsutil cors set cors.json gs://fvc-careers.firebasestorage.app
```

---

## 🎯 Quick Fix (Temporary)

### **Update Storage Rules to Public (For Testing Only)**

1. Go to Firebase Console → Storage → Rules
2. Replace with:
   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read, write;
       }
     }
   }
   ```
3. Publish

⚠️ **Warning:** This makes storage public. Only for testing!

---

## 🔐 Production Rules (After Testing)

Once CORS is working, use these secure rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Resumes folder
    match /resumes/{fileName} {
      allow write: if request.resource.size < 10 * 1024 * 1024  // Max 10MB
                   && request.resource.contentType.matches('application/pdf|application/msword|application/vnd.*');
      allow read;
    }
    
    // Photos folder
    match /photos/{fileName} {
      allow write: if request.resource.size < 5 * 1024 * 1024  // Max 5MB
                   && request.resource.contentType.matches('image/.*');
      allow read;
    }
  }
}
```

---

## ✅ Verify It's Working

After configuring CORS:

1. **Clear browser cache** (Cmd+Shift+R)
2. **Go to:** http://localhost:8000/apply.html?job=mock-1
3. **Fill form and upload resume**
4. **Submit**
5. **Check browser console** - no CORS errors!
6. **Check Firebase Console** → Storage → Files should be uploaded

---

## 🐛 Still Having Issues?

### Check These:

1. **Storage Rules are Published?**
   - Firebase Console → Storage → Rules
   - Make sure you clicked "Publish"

2. **Using correct URL?**
   - ✅ http://localhost:8000/apply.html
   - ❌ file:///Users/.../apply.html

3. **Firebase initialized?**
   - Check browser console for: "✅ Firebase initialized"
   - Check for any Firebase errors

4. **Bucket name correct?**
   - Should be: `fvc-careers.firebasestorage.app`
   - Or: `fvc-careers.appspot.com`

---

## 📞 Need Help?

If errors persist:

1. **Screenshot the error** in browser console
2. **Check Firebase Console** → Storage → Rules
3. **Verify** storage bucket name in firebase-config.js

---

## 🎓 Why This Happens

- **CORS** = Cross-Origin Resource Sharing
- Browsers block requests to different domains for security
- Firebase Storage is a different domain than localhost
- We need to tell Firebase Storage: "Allow requests from localhost"
- This is done through CORS configuration

---

**Follow Method 1 (Firebase Console) - it's the easiest!**
