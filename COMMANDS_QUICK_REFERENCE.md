# 🎯 QUICK COMMAND REFERENCE

## Copy & Paste These Commands

### 1️⃣ CREATE MYSQL DATABASE
```bash
mysql -u root -p -e "CREATE DATABASE admin_dashboard_db;"
```
**When asked for password, type:** `admin`

---

### 2️⃣ BACKEND SETUP (Terminal 1)
```bash
cd "c:\Users\VIKAS NAGAR\Downloads\admin dashboard\admin-dashboard-api"
npm install
npm run start:dev
```

**Expected to see:**
```
✅ Application is running on: http://localhost:3000
```

---

### 3️⃣ FRONTEND SETUP (Terminal 2 - NEW Terminal!)
```bash
cd "c:\Users\VIKAS NAGAR\Downloads\admin dashboard\admin-dashborad-ui"
npm install
npm start
```

**Expected to see:**
```
✔ Compiled successfully.

Application is running at: http://localhost:4200
```

---

## 🔄 System Check

Run these to verify everything is set up:

```bash
# Check Node.js
node --version

# Check npm
npm --version

# Check MySQL
mysql --version

# Check MySQL service is running
mysql -u root -p -e "SELECT 1;" 

# Check database exists
mysql -u root -p -e "SHOW DATABASES;"
```

---

## 🌐 Access Points

Once running, access these URLs:

| Service | URL | Status |
|---------|-----|--------|
| Frontend | http://localhost:4200 | ✅ Login page |
| Backend API | http://localhost:3000 | ✅ Health check |
| API Docs | http://localhost:3000/api | ✅ OpenAPI |
| API Health | http://localhost:3000/health | ✅ Status |

---

## 📊 Check Backend Status

To verify backend is working:

```bash
# Open browser or use curl:
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Admin Dashboard API is running",
  "timestamp": "2026-02-13T..."
}
```

---

## 🔐 Login Info

**After Frontend Loads:**
- **URL:** http://localhost:4200
- **Username:** admin
- **Password:** admin123

---

## 🛑 STOP Everything

Press `Ctrl+C` in both terminal windows to stop servers.

---

## 📝 Configuration Files

**Database Config:**
```
Location: admin-dashboard-api/.env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=admin
DB_NAME=admin_dashboard_db
```

**Frontend API URL:**
```
Location: admin-dashborad-ui/environment.ts
apiUrl: 'http://localhost:3000/api'
```

---

## 🐛 Connection Test

If you need to test the database connection:

```bash
# Test MySQL
mysql -u root -p admin_dashboard_db

# Once connected, type:
SHOW TABLES;
EXIT;
```

---

## ⚡ Quick Manual Setup

**One comprehensive command to verify everything:**

```bash
# Check all tools are installed
node -v && npm -v && mysql -v && echo "✅ All tools installed!"

# Create database
mysql -u root -p -e "CREATE DATABASE admin_dashboard_db; SHOW DATABASES | grep admin;"

# Backend ready (don't run, just show it's ready)
cd admin-dashboard-api && echo "✅ Backend ready at admin-dashboard-api"

# Frontend ready
cd admin-dashborad-ui && echo "✅ Frontend ready at admin-dashborad-ui"
```

---

## 🚀 Ultra-Quick Start (If Everything is Installed)

```bash
# Terminal 1
cd admin-dashboard-api && npm run start:dev

# Terminal 2 (new terminal)
cd admin-dashborad-ui && npm start

# Open browser
http://localhost:4200
```

---

## 📋 Pre-Flight Checklist

Before running commands above, confirm:

- [ ] MySQL installed (mysql --version works)
- [ ] Node.js v16+ installed (node -v)
- [ ] npm installed (npm -v)
- [ ] In correct directory (see path below)
- [ ] .env file exists in admin-dashboard-api

**Current Path:** `c:\Users\VIKAS NAGAR\Downloads\admin dashboard`

---

## 🎯 Expected Final State

After all commands complete:

```
Browser: http://localhost:4200 → Login Page ✅
Terminal 1: Backend running on 3000 ✅
Terminal 2: Frontend running on 4200 ✅
Database: MySQL connected and synced ✅
```

---

## 💾 Save This Somewhere

Keep these commands handy:
- Backend start: `npm run start:dev` (in admin-dashboard-api)
- Frontend start: `npm start` (in admin-dashborad-ui)
- Database: `mysql -u root -p admin_dashboard_db`

---

**You're ready to go! Run the commands above and you'll have everything running!** 🎉
