# 🚀 How to Fix CORS Errors & Run FVC Careers

## ❌ The Problem

You're seeing CORS errors because:
- Opening HTML files directly (`file://` protocol) doesn't work with Firebase
- Firebase Storage requires files to be served from a web server
- Browser security blocks cross-origin requests from `file://`

## ✅ The Solution: Use a Local Web Server

### **Option 1: Using Our Python Server (Easiest)**

1. **Open Terminal** in this folder
2. **Run the server:**
   ```bash
   python3 server.py
   ```
3. **Browser will auto-open** at `http://localhost:8000`
4. **That's it!** CORS errors are gone! 🎉

### **Option files will now work with Firebase!**

---

## 🌐 Access URLs

Once server is running, use these URLs:

- **Main Site:** http://localhost:8000/index.html
- **Jobs Page:** http://localhost:8000/jobs.html
- **Apply Form:** http://localhost:8000/apply.html
- **HR Login:** http://localhost:8000/hr-login.html
- **HR Dashboard:** http://localhost:8000/hr-dashboard.html

---

## 📝 Important Notes

### **Always Use http://localhost:8000**
- ✅ **DO:** `http://localhost:8000/apply.html`
- ❌ **DON'T:** Double-click HTML files (causes CORS errors)

### **Firebase Will Work**
- ✅ File uploads to Firebase Storage
- ✅ Data saves to Firestore
- ✅ No CORS errors
- ✅ All features functional

---

## 🛑 Stop the Server

Press `Ctrl+C` in the terminal where the server is running

---

## 🔧 Alternative: Using npm/npx

If you prefer, you can also use:

```bash
# Install http-server globally
npm install -g http-server

# Run server
http-server -p 8000 -c-1
```

Or use npx (no installation):
```bash
npx http-server -p 8000 -c-1
```

---

## 📱 Testing on Mobile

To test on your phone (same WiFi network):

1. Find your computer's IP address:
   ```bash
   ifconfig | grep "inet "
   ```

2. Use that IP on your phone:
   ```
   http://YOUR_IP:8000/index.html
   ```

---

## ✅ Verification

After starting the server, you should see:
- ✅ No CORS errors in console
- ✅ Forms submit successfully
- ✅ Files upload to Firebase Storage
- ✅ Data saves to Firestore

---

## 💡 Pro Tip

Add this to your `~/.zshrc` for quick access:
```bash
alias fvc-serve="cd ~/Desktop/FVC && python3 server.py"
```

Then just run `fvc-serve` from anywhere!

---

**Need help?** Check the browser console (F12) for any errors.
