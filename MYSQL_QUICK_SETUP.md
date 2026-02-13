# Quick MySQL Setup Checklist

## 📋 Complete Setup in 10 Minutes

### ✅ Step 1: Install MySQL (5 mins)
- [ ] Download MySQL from: https://dev.mysql.com/downloads/mysql/
- [ ] Run installer and follow setup
- [ ] Set password: **admin** (or note what you set)
- [ ] Keep default port: **3306**
- [ ] Finish installation

### ✅ Step 2: Verify Installation (1 min)
```bash
mysql --version
```
Should show version number like: `mysql Ver 8.0.xx`

### ✅ Step 3: Create Database (2 mins)

**COPY AND PASTE this in Command/Terminal:**

```bash
mysql -u root -p -e "CREATE DATABASE admin_dashboard_db; SHOW DATABASES;"
```

When asked for password, type: `admin`

You should see `admin_dashboard_db` in the list.

### ✅ Step 4: Create .env File (1 min)

**Location:** `admin-dashboard-api/.env`

**Copy this content:**
```
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=admin
DB_NAME=admin_dashboard_db
PORT=3000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRATION=24h
CORS_ORIGIN=http://localhost:4200
```

### ✅ Step 5: Start Backend (1 min)
```bash
cd admin-dashboard-api
npm install
npm run start:dev
```

You should see:
```
✅ Application is running on: http://localhost:3000
```

---

## 🚨 Common Issues & Quick Fixes

### "MySQL is not installed or not in PATH"
```bash
# Windows: Download and Install from
https://dev.mysql.com/downloads/mysql/

# Mac: 
brew install mysql
brew services start mysql

# Linux:
sudo apt-get install mysql-server
sudo systemctl start mysql
```

### "Access denied for user 'root'@'localhost'"
```bash
# Check your password is 'admin' in the command
# Or verify it matches what you set during installation
```

### "Can't connect to MySQL server on 'localhost' (10061)"
```bash
# MySQL is not running. Start it:
# Windows: Services → MySQL → Start
# Mac: brew services start mysql
# Linux: sudo systemctl start mysql
```

### Database already exists error
```bash
# Drop and recreate:
mysql -u root -p -e "DROP DATABASE admin_dashboard_db; CREATE DATABASE admin_dashboard_db;"
```

---

## 📊 Test Your Setup

After everything is installed and running:

```bash
# Test MySQL connection
mysql -u root -p -e "SELECT 1;"

# Check database
mysql -u root -p -e "SHOW DATABASES;"

# View backend logs (should see database connected)
npm run start:dev
```

---

## 🎯 What's Next?

1. Complete this checklist
2. Run the 5 commands above
3. Backend will start automatically
4. Open Terminal 2 and run:
```bash
cd admin-dashborad-ui
npm start
```
5. Visit http://localhost:4200
6. Login with: admin / admin123

---

## 💾 Save Your Credentials

**Important:** Write down what you used:
```
MySQL Host: localhost
MySQL Port: 3306
MySQL Username: root
MySQL Password: ___________
MySQL Database: admin_dashboard_db
```

**Backend Port:** 3000
**Frontend Port:** 4200

---

✅ **This is the only setup needed for database!**
