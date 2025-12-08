# Quick Fix Guide - Job Details Not Showing

## Issue
When clicking "Learn More" on a job, the job details page doesn't show.

## Solutions

### Option 1: Use Mock Data (No Backend Required) ✅ EASIEST

The pages now work WITHOUT the backend! They use sample data automatically.

**Steps:**
1. Simply open `jobs.html` in your browser
2. Click "Learn More" on any job
3. You'll see the job details page with sample data

**No setup required!**

---

### Option 2: Start the Backend (Full Functionality)

If you want to use the real backend with database:

**Step 1: Install MongoDB**
```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Check if MongoDB is running
mongosh
```

**Step 2: Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
node seed.js
npm run dev
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

**Step 3: Open the Website**
```bash
# From the FVC directory
open jobs.html
```

Now the pages will fetch real data from the database!

---

## How to Switch Between Mock and Real Data

Edit `js/jobs.js` and `js/job-details.js`:

**For Mock Data (no backend):**
```javascript
const USE_MOCK_DATA = false; // Leave as false - it auto-detects
```

**For Real Backend:**
Just start the backend server - it will automatically use real data!

---

## Testing the Flow

### Without Backend:
1. Open `jobs.html`
2. See 3 sample jobs
3. Click "Learn More"
4. See full job details
5. Click "Apply Now" (shows alert for now)

### With Backend:
1. Start backend: `cd backend && npm run dev`
2. Open `jobs.html`
3. See 6 jobs from database
4. Click "Learn More"
5. See full job details from API
6. Use filters and search

---

## Troubleshooting

### "Cannot see jobs"
- Check browser console (F12)
- Should see: "Backend not available. Using sample data."
- Jobs should still appear

### "Learn More doesn't work"
- Check browser console for errors
- Make sure `js/jobs.js` and `js/job-details.js` are loaded
- Try opening `job-details.html?id=mock-1` directly

### "Backend not connecting"
```bash
# Check if MongoDB is running
brew services list | grep mongodb

# Check if backend is running
curl http://localhost:5000/api/health

# Restart backend
cd backend
npm run dev
```

---

## File Structure

```
FVC/
├── jobs.html              # Job listings page
├── job-details.html       # Job details page (NEW!)
├── js/
│   ├── jobs.js           # Jobs page logic (with mock data)
│   └── job-details.js    # Job details logic (with mock data)
├── job-details.css        # Job details styling
└── backend/               # Optional backend
    └── ...
```

---

## Current Status

✅ Jobs page works WITHOUT backend (shows 3 sample jobs)
✅ Job details page works WITHOUT backend
✅ "Learn More" button works
✅ Filters work (with mock data)
✅ Search works (with mock data)
✅ Backend integration ready (when you start the server)

---

## Next Steps

1. **Test without backend**: Just open `jobs.html` - it should work!
2. **Start backend** (optional): Follow Option 2 above
3. **Create application page**: `apply.html` (coming next if needed)

---

## Quick Test

Open your browser console (F12) and run:
```javascript
// Check if jobs are loaded
console.log('Jobs loaded:', document.querySelectorAll('.job-listing-card').length);

// Test job details link
viewJobDetails('mock-1');
```

You should see the job details page!
