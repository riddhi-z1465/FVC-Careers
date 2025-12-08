# 🔥 Firebase Firestore Security Rules

## The Problem
Your application can't submit because **Firestore security rules are blocking writes**.

---

## ✅ Quick Fix

### **Go to Firebase Console:**

1. **Open:** https://console.firebase.google.com
2. **Select project:** `fvc-careers`
3. **Click:** "Firestore Database" in left sidebar
4. **Click:** "Rules" tab

### **Replace the rules with this:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Applications collection - allow anyone to write
    match /applications/{document} {
      allow read, write: if true;
    }
    
    // Jobs collection - allow read to all, write to authenticated only
    match /jobs/{document} {
      allow read: if true;
      allow write: if true;  // Change to auth check in production
    }
    
    // All other collections - deny by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### **Click "Publish"**

---

## 🎯 Test Again

After updating rules:

1. **Go to:** http://localhost:8000/apply.html?job=mock-1
2. **Fill the form**
3. **Click "Save Profile"**
4. **Should see:** "Application submitted successfully!"
5. **Check Firestore** → applications collection → New document! ✅

---

## 🔐 Production Rules (Use Later)

Once testing works, use these secure rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /applications/{document} {
      allow read: if request.auth != null;  // Only authenticated users
      allow create: if true;  // Anyone can apply
      allow update, delete: if request.auth != null;
    }
    
    match /jobs/{document} {
      allow read: if true;  // Public can view jobs
      allow write: if request.auth != null;  // Only authenticated can create/edit
    }
  }
}
```

---

## ⚠️ Why This is Happening

Default Firestore rules:
```javascript
allow read, write: if false;  // Blocks everything!
```

We need to change to:
```javascript
allow read, write: if true;  // Allows everything (testing only)
```

---

**Update the Firestore rules now and try submitting again!** 🚀
