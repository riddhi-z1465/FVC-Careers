// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAZPg4l05BlRArCGmyKUgr1Io4WL7oX8OM",
    authDomain: "fvc-careers.firebaseapp.com",
    projectId: "fvc-careers",
    storageBucket: "fvc-careers.firebasestorage.app",
    messagingSenderId: "855969007876",
    appId: "1:855969007876:web:a2df4e1d65be3bb7a16851",
    measurementId: "G-2R3RB7PQNF"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Initialize Storage (NOT USED - avoiding CORS issues)
const storage = firebase.storage();

// Export for use in other files
window.firebaseDB = db;
window.db = db;  // Also export as db for easier access
window.firebaseStorage = storage;
window.firebase = firebase;

console.log('✅ Firebase initialized with project: fvc-careers');
