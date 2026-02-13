# MySQL Database Setup Guide

## 📋 Database Configuration Summary

Your backend is configured to use **MySQL** with these default settings:

| Setting | Default | Environment Variable |
|---------|---------|---------------------|
| Database Type | MySQL | N/A |
| Host | localhost | `DB_HOST` |
| Port | 3306 | `DB_PORT` |
| Username | root | `DB_USERNAME` |
| Password | admin | `DB_PASSWORD` |
| Database Name | admin_dashboard_db | `DB_NAME` |

---

## 🔧 Step 1: Install MySQL

### Windows
**Option A: Using MySQL Installer (Easiest)**
1. Download: https://dev.mysql.com/downloads/mysql/
2. Run the installer
3. Choose "Server only" or "Full"
4. Follow setup wizard
5. Keep default port: 3306
6. Set password: `admin` (to match default config)

**Option B: Using Chocolatey**
```powershell
choco install mysql
```

**Option C: Using Windows Subsystem for Linux (WSL)**
```bash
sudo apt-get update
sudo apt-get install mysql-server
sudo mysql_secure_installation
```

### Mac
**Using Homebrew**
```bash
brew install mysql
brew services start mysql
mysql_secure_installation
```

**Download:**
https://dev.mysql.com/downloads/mysql/ (macOS DMG Archive)

### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install mysql-server
sudo mysql_secure_installation
sudo systemctl start mysql
```

---

## ✅ Step 2: Verify MySQL Installation

### Check MySQL Version
```bash
mysql --version
```

Expected output: `mysql  Ver 8.0.xx ...` or similar

### Test MySQL Connection
```bash
mysql -u root -p
```

When prompted for password, enter: `admin` (or whatever you set)

If successful, you'll see:
```
mysql>
```

Type `exit;` to quit.

---

## 🗄️ Step 3: Create Database

### Option A: Using MySQL Command Line
```bash
mysql -u root -p
```

Enter password: `admin`

Then run these commands:
```sql
CREATE DATABASE admin_dashboard_db;
CREATE USER 'root'@'localhost' IDENTIFIED BY 'admin';
GRANT ALL PRIVILEGES ON admin_dashboard_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
SHOW DATABASES;
EXIT;
```

### Option B: Using MySQL Workbench (GUI)
1. Open MySQL Workbench
2. Create new connection with:
   - Hostname: localhost
   - Port: 3306
   - Username: root
   - Password: admin
3. Click "Test Connection"
4. In the query editor, run:
```sql
CREATE DATABASE admin_dashboard_db;
```

### Option C: Verify Database Created
```bash
mysql -u root -p -e "SHOW DATABASES;"
```

You should see `admin_dashboard_db` in the list.

---

## 🔐 Step 4: Configure Environment File

### Create .env file in backend directory

```bash
cd admin-dashboard-api
```

Create a file named `.env`:

```bash
touch .env  # On Mac/Linux
# OR
New-Item -Path .env  # On Windows PowerShell
```

### Edit .env with these values

Open `.env` in your editor and add:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=admin
DB_NAME=admin_dashboard_db

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRATION=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:4200
```

### Example .env File Structure
```
# ========================================
# Database Configuration
# ========================================
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=admin
DB_NAME=admin_dashboard_db

# ========================================
# Server Configuration
# ========================================
PORT=3000
NODE_ENV=development

# ========================================
# JWT Configuration
# ========================================
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRATION=24h

# ========================================
# CORS Configuration
# ========================================
CORS_ORIGIN=http://localhost:4200

# ========================================
# Email Configuration (Optional)
# ========================================
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password
```

---

## 🗂️ Step 5: Database File Structure

Your backend will automatically create these tables:

```
admin_dashboard_db/
├── users (authentication)
├── clients (client management)
├── access_keys (key generation)
├── dashboard_stats (statistics)
└── logs (optional)
```

TypeORM will create tables based on the entity files in:
- `admin-dashboard-api/src/auth/entities/`
- `admin-dashboard-api/src/clients/entities/`
- `admin-dashboard-api/src/access-keys/entities/`

---

## 🚀 Step 6: Start Backend with Database

### Option A: Auto-sync Mode (Development)
```bash
cd admin-dashboard-api

# Install dependencies if not done
npm install

# Start backend (TypeORM will sync database automatically)
npm run start:dev
```

The backend will:
1. Connect to MySQL
2. Create tables automatically
3. Seed data (if configured)
4. Start listening on port 3000

### Option B: Manual Migration (Production)
```bash
# Generate migrations
npm run migration:generate -- src/migrations/InitialMigration

# Run migrations
npm run migration:run

# Start backend
npm run start
```

---

## ✅ Verification Checklist

Make sure all of these are working:

- [ ] MySQL Server is installed and running
- [ ] Can connect to MySQL: `mysql -u root -p`
- [ ] Database `admin_dashboard_db` exists
- [ ] `.env` file created in `admin-dashboard-api`
- [ ] Database credentials in `.env` are correct
- [ ] Backend starts without errors: `npm run start:dev`
- [ ] See message: "✅ Application is running on: http://localhost:3000"

---

## 🐛 Troubleshooting

### Issue 1: "Can't connect to MySQL server"
**Solution:**
```bash
# Check if MySQL is running
# Windows: Check Services for MySQL
# Mac: brew services list | grep mysql
# Linux: sudo systemctl status mysql

# Start MySQL if not running
brew services start mysql  # Mac
sudo systemctl start mysql  # Linux
```

### Issue 2: "Access denied for user 'root'@'localhost'"
**Solution:**
```bash
# Check password is correct in .env
# Reset MySQL root password:

# Windows:
mysqld --remove MySQL80
mysqld --install MySQL80
mysql -u root -p  # Try password 'admin'

# Mac:
sudo /usr/local/mysql/support-files/mysql.server stop
mysqld_safe --skip-grant-tables &
mysql -u root
```

### Issue 3: "Database 'admin_dashboard_db' doesn't exist"
**Solution:**
```bash
# Create the database
mysql -u root -p -e "CREATE DATABASE admin_dashboard_db;"

# Or verify it was created
mysql -u root -p -e "SHOW DATABASES;"
```

### Issue 4: "Port 3306 already in use"
**Solution:**
```bash
# Change port in .env
DB_PORT=3307

# Or kill process using port
# Windows: netstat -ano | findstr :3306
# Mac: lsof -i :3306
# Linux: sudo lsof -i :3306
```

---

## 📊 Check Database Connection

### Using Backend Logs
When backend starts, you should see:
```
TypeORM logging - "Query: SELECT DATABASE()" 
✅ Application is running on: http://localhost:3000
```

### Using MySQL Command
```bash
mysql -u root -p admin_dashboard_db -e "SHOW TABLES;"
```

You should see tables like:
```
+----------------------------+
| Tables_in_admin_dashboard_db |
+----------------------------+
| users                       |
| clients                     |
| access_keys                 |
| dashboard_stats             |
+----------------------------+
```

---

## 🔄 Resetting Database (If Needed)

### Complete Reset
```bash
# WARNING: This deletes all data!
mysql -u root -p -e "DROP DATABASE admin_dashboard_db; CREATE DATABASE admin_dashboard_db;"

# Restart backend
npm run start:dev
```

### Just Clear Data (Keep Tables)
```bash
mysql -u root -p admin_dashboard_db -e "TRUNCATE TABLE access_keys; TRUNCATE TABLE clients; TRUNCATE TABLE users;"
```

---

## 🔐 Security Notes

⚠️ **For Production:**
1. Change root password from `admin` to a strong password
2. Update `.env` with strong JWT_SECRET
3. Never commit `.env` to git
4. Add `.env` to `.gitignore`
5. Use environment-specific configurations

**Check if .env is in .gitignore:**
```bash
cat .gitignore | grep env
```

Should show: `.env`

---

## 📝 Default Credentials

After setup, you can log in with:
```
Username: admin
Password: admin123
```

(Verify these in your backend authentication configuration)

---

## 🎯 Next Steps

1. **Complete MySQL setup** using this guide
2. **Create `.env` file** with database credentials
3. **Start backend:** `npm run start:dev`
4. **Start frontend:** `npm start`
5. **Access:** http://localhost:4200
6. **Login** with default credentials

---

## 🔗 Related Files

- Backend config: `admin-dashboard-api/src/config/database.config.ts`
- Entities: `admin-dashboard-api/src/**/*.entity.ts`
- Package.json: `admin-dashboard-api/package.json`
- Example .env: `admin-dashboard-api/.env.example`

---

**Your database setup is ready! Follow the steps above and you'll be good to go.** ✅
