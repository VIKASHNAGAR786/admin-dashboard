# Quick Start Guide - After Error Fixes

## 🎯 Current Status

✅ **Frontend:** Compiling successfully
⏳ **Backend:** Ready to setup
✅ **Configuration:** Fixed and verified

---

## 🚀 Get Started in 5 Minutes

### Option 1: Run Everything (Windows)
```bash
# From root directory
start-dev.bat
```

### Option 2: Run Everything (Mac/Linux)
```bash
# From root directory
chmod +x start-dev.sh
./start-dev.sh
```

### Option 3: Manual Setup

**Terminal 1 - Start Backend:**
```bash
cd admin-dashboard-api
npm install
npm run start:dev
```

**Terminal 2 - Start Frontend:**
```bash
cd admin-dashborad-ui
npm start
```

---

## ⚙️ Backend Configuration (REQUIRED BEFORE RUNNING)

### Step 1: Create .env file
```bash
cd admin-dashboard-api
cp .env.example .env
```

### Step 2: Edit .env with your settings
```
# Database Configuration (Required)
DATABASE_TYPE=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=admin_dashboard
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/admin_dashboard

# JWT Configuration (Change in production!)
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=24h

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:4200
```

### Step 3: Setup Database
If using PostgreSQL:
```bash
# Create database
createdb admin_dashboard

# Run migrations (if TypeORM is set up)
npm run migration:run
```

---

## 🌐 Access the Application

Once both servers are running:
- **Frontend:** http://localhost:4200
- **Backend API:** http://localhost:3000/api
- **API Docs:** http://localhost:3000/api/docs (if Swagger enabled)

---

## 🔐 Default Login Credentials

Check your backend authentication configuration for default credentials:
```
Username: admin
Password: admin123
```

(Update these in your backend configuration)

---

## ✅ Verification Checklist

Before considering the setup complete:

- [ ] Backend is running on port 3000
- [ ] Frontend is running on port 4200
- [ ] Frontend builds without errors
- [ ] Backend builds without errors
- [ ] Can access http://localhost:4200 in browser
- [ ] Can see login page
- [ ] Database is configured and running
- [ ] Can login successfully
- [ ] Can see dashboard after login
- [ ] API calls work in Network tab

---

## 🐛 Troubleshooting

### Port 4200 already in use?
```bash
# Use a different port
ng serve --port 4300
```

### Database connection error?
- Verify database is running
- Check DATABASE_URL in .env
- Verify credentials in .env

### API requests failing?
- Check backend is running on 3000
- Check CORS_ORIGIN in backend .env
- Check browser Network tab for details

### Module not found errors?
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Important Files

- **Frontend Config:** `admin-dashborad-ui/environment.ts`
- **Backend Config:** `admin-dashboard-api/.env`
- **API Routes:** `admin-dashboard-api/src/*/controllers/`
- **Services:** `admin-dashborad-ui/services/`

---

## 🔗 Related Documentation

- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - Detailed integration guide
- [INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md) - Integration overview
- [ERROR_RESOLUTION_REPORT.md](./ERROR_RESOLUTION_REPORT.md) - Error fixes summary
- [API_DOCUMENTATION.md](./admin-dashboard-api/API_DOCUMENTATION.md) - Backend API docs

---

## 💡 Tips

1. **Run scripts in specific order:** Backend first, then frontend
2. **Check browser console:** For frontend errors
3. **Check terminal:** For backend errors
4. **Use Network tab:** To debug API calls
5. **Keep .env secure:** Never commit to git

---

**Ready to develop! Start with Option 1 or 2 above.** 🚀
