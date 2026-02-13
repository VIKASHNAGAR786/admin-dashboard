# Backend Project - Complete Setup Verification

This checklist ensures your NestJS backend is correctly set up and ready for deployment.

---

## ✅ Pre-Installation Checklist

Before you start, verify you have:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] MySQL 8.0+ running
- [ ] Git installed (`git --version`)
- [ ] A text editor (VS Code, Sublime, etc.)
- [ ] Terminal/Command prompt access
- [ ] At least 500MB free disk space

---

## 📋 Step 1: Project Files Verification

Verify these files exist in `admin-dashboard-api/` directory:

### Core Files
- [ ] `package.json` - Project configuration
- [ ] `tsconfig.json` - TypeScript settings
- [ ] `nest-cli.json` - NestJS CLI config
- [ ] `.env.example` - Environment template
- [ ] `.gitignore` - Git ignore rules

### Source Code (`src/` directory)
- [ ] `main.ts` - Application entry point
- [ ] `app.module.ts` - Root module
- [ ] `app.controller.ts` - Health check
- [ ] `app.service.ts` - Application service
- [ ] `config/database.config.ts` - Configuration
- [ ] `auth/` directory with 7 files
- [ ] `clients/` directory with 5 files
- [ ] `access-keys/` directory with 5 files
- [ ] `dashboard/` directory with 3 files

### Documentation
- [ ] `README.md` - API overview
- [ ] `SETUP.md` - Setup instructions
- [ ] `API_DOCUMENTATION.md` - Endpoints reference
- [ ] `FRONTEND_INTEGRATION.md` - Angular integration
- [ ] `TESTING_GUIDE.md` - Testing guide
- [ ] `QUICK_REFERENCE.md` - Quick commands
- [ ] `PROJECT_SUMMARY.md` - Project overview
- [ ] `DEPLOYMENT_GUIDE.md` - Deployment guide
- [ ] `FILES_REFERENCE.md` - File listing

### Scripts
- [ ] `verify-setup.sh` - Bash verification
- [ ] `verify-setup.ps1` - PowerShell verification

**Status:** All files present? ✓ Proceed to Step 2

---

## 📦 Step 2: Dependencies Installation

### Install Node Modules

```bash
# Navigate to project directory
cd admin-dashboard-api

# Install all dependencies
npm install
```

**What gets installed:**
- NestJS framework (10.3.3)
- TypeORM (0.3.19)
- MySQL2 driver (3.6.5)
- Passport & JWT libraries
- bcrypt for password hashing
- class-validator for DTOs
- 50+ other dependencies

**Verification:**
```bash
# Check installation
ls node_modules | head -20

# Verify key packages
npm list @nestjs/core
npm list typeorm
npm list mysql2
npm list bcrypt
```

**Expected Output:** Version numbers for all key packages

**Status:** ✓ All dependencies installed? Proceed to Step 3

---

## 🔧 Step 3: Environment Configuration

### Create .env File

```bash
# Copy template
cp .env.example .env
```

### Edit .env File

Open `.env` and update these values:

```env
# Database Configuration
DB_HOST=localhost              # MySQL host
DB_PORT=3306                   # MySQL port (default 3306)
DB_USERNAME=admin              # MySQL user (will create)
DB_PASSWORD=admin123           # MySQL password (change in production)
DB_DATABASE=admin_dashboard_db # Database name

# JWT Authentication
JWT_SECRET=your-secure-secret-key-at-least-32-characters-long
JWT_EXPIRATION=3600            # Token expiration in seconds (1 hour)

# CORS Configuration (Where Angular runs)
CORS_ORIGIN=http://localhost:4200

# Application
NODE_ENV=development           # development | production
PORT=3000                      # API port
```

### Generate Strong JWT Secret

```bash
# Generate random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copy the output to JWT_SECRET in .env
```

**Status:** ✓ .env file configured? Proceed to Step 4

---

## 🗄️ Step 4: Database Setup

### Start MySQL Service

**Linux/Mac:**
```bash
# Start MySQL
mysql.server start

# Or with Homebrew
brew services start mysql
```

**Windows:**
```bash
# MySQL is usually auto-started
# Or restart MySQL service
net start MySQL80
```

**Docker:**
```bash
docker run --name mysql -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:8.0
```

### Create Database

```bash
# Connect to MySQL
mysql -u root -p

# Enter root password when prompted
```

Then execute:

```sql
-- Create database
CREATE DATABASE admin_dashboard_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin123';

-- Grant privileges
GRANT ALL PRIVILEGES ON admin_dashboard_db.* TO 'admin'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Verify (should return 1)
SELECT COUNT(*) FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'admin_dashboard_db';

-- Exit
EXIT;
```

### Verify Database Creation

```bash
# Connect as new user
mysql -u admin -p admin_dashboard_db

# List tables (should be empty initially)
SHOW TABLES;

# Exit
EXIT;
```

**Status:** ✓ Database created? Proceed to Step 5

---

## 🚀 Step 5: Build & Start Application

### Build TypeScript

```bash
# Compile TypeScript to JavaScript
npm run build

# Check output
ls dist/

# Should contain: main.js, app.module.js, config/, auth/, clients/, etc.
```

### Start Development Server

```bash
# Start with auto-reload
npm run start:dev

# Expected output:
# [NestFactory] Starting NestJS 10.3.3 application
# [DatabaseModule] Connected to MySQL at localhost:3306
# [TypeOrmModule] Database entities synchronized
# ✅ Application is running on http://localhost:3000
```

**Keep this terminal open!**

**Status:** ✓ Application running? Proceed to Step 6

---

## ✔️ Step 6: Health Check

### Test API is Responding

**Open another terminal and run:**

```bash
# Method 1: curl
curl http://localhost:3000/health

# Method 2: PowerShell (Windows)
Invoke-RestMethod -Uri http://localhost:3000/health -Method Get

# Method 3: Open in browser
# http://localhost:3000/health
```

**Expected Response:**
```json
{
  "statusCode": 200,
  "message": "API is running",
  "timestamp": "2024-02-12T10:30:00.000Z"
}
```

**Status:** ✓ Health check passes? Proceed to Step 7

---

## 🔐 Step 7: Database Verification

### Verify Tables Were Created

```bash
# Connect to database
mysql -u admin -p admin_dashboard_db

# List tables (TypeORM auto-creates these)
SHOW TABLES;

# Should show:
# + user
# + client
# + access_key
```

### Check Table Structure

```sql
-- Check user table
DESCRIBE user;

-- Check client table
DESCRIBE client;

-- Check access_key table
DESCRIBE access_key;

-- Exit
EXIT;
```

**Expected Columns:**

**user table:**
- id (VARCHAR 36, PRIMARY KEY)
- email (VARCHAR 255, UNIQUE)
- firstName, lastName (VARCHAR 100)
- password (VARCHAR 255)
- role, isActive
- createdAt, updatedAt

**client table:**
- id, companyName, email, contactPerson, etc.
- plan, status (VARCHAR)
- modules (JSON)
- createdAt, updatedAt

**access_key table:**
- id, key (UNIQUE), clientId (FOREIGN KEY)
- status, expirationDate, lastUsed
- createdAt, updatedAt

**Status:** ✓ All tables created correctly? Proceed to Step 8

---

## 🧪 Step 8: Initial API Testing

### Test User Registration

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePass123",
    "firstName": "Admin",
    "lastName": "User"
  }'
```

**Expected Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "admin@example.com",
  "firstName": "Admin",
  "lastName": "User",
  "role": "admin",
  "isActive": true,
  "createdAt": "2024-02-12T10:30:00.000Z"
}
```

### Test User Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePass123"
  }'
```

**Expected Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "admin@example.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin",
    "isActive": true,
    "createdAt": "2024-02-12T10:30:00.000Z"
  }
}
```

**Save the token:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Test Protected Endpoint

```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):** User profile data

**Status:** ✓ Basic API tests pass? Proceed to Step 9

---

## 📱 Step 9: Frontend Connection Readiness

### Create Angular API Service

In your Angular project:

**File:** `src/app/services/api.service.ts`

```typescript
// Complete code in FRONTEND_INTEGRATION.md
// Creates service for all API endpoints
```

### Update Angular Environment

**File:** `src/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  apiTimeout: 30000
};
```

### Test from Angular

```typescript
// In your Angular component
constructor(private http: HttpClient) {}

ngOnInit() {
  this.http.get('http://localhost:3000/health').subscribe(
    (response) => console.log('Backend connected!', response),
    (error) => console.error('Connection failed', error)
  );
}
```

**Status:** ✓ Angular can connect? Proceed to Step 10

---

## 🔍 Step 10: Complete Functionality Check

### Run All Tests from TESTING_GUIDE.md

Test these endpoints in order:

1. **Authentication**
   - [ ] Register user
   - [ ] Login user
   - [ ] Get profile
   - [ ] Logout

2. **Clients Management**
   - [ ] Create client
   - [ ] List clients
   - [ ] Get single client
   - [ ] Update client
   - [ ] Delete client
   - [ ] Get stats

3. **Access Keys**
   - [ ] Generate key
   - [ ] List keys
   - [ ] Validate key (public)
   - [ ] Revoke key

4. **Dashboard**
   - [ ] Get stats
   - [ ] Get summary
   - [ ] Get activity

5. **Error Handling**
   - [ ] Invalid credentials → 401
   - [ ] Missing auth → 401
   - [ ] Invalid token → 401
   - [ ] Not found → 404
   - [ ] Bad request → 400

**See TESTING_GUIDE.md for complete curl commands**

**Status:** ✓ All endpoints working? Proceed to Step 11

---

## 🚢 Step 11: Production Readiness

### Pre-Deployment Checklist

- [ ] Read [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- [ ] Generate strong JWT_SECRET
- [ ] Update database credentials
- [ ] Setup HTTPS (Let's Encrypt)
- [ ] Configure firewall
- [ ] Setup monitoring (Sentry)
- [ ] Enable logging
- [ ] Setup database backups
- [ ] Test error handling
- [ ] Verify rate limiting
- [ ] Check CORS configuration
- [ ] Test token expiration
- [ ] Verify password hashing
- [ ] Setup CI/CD pipeline

### Environment for Production

```env
NODE_ENV=production
DB_HOST=your-production-db-host
DB_USERNAME=secure_user
DB_PASSWORD=very_strong_password_here
JWT_SECRET=generate-long-random-secret-32-chars-min
CORS_ORIGIN=https://yourdomain.com
PORT=3000
```

**Status:** ✓ Ready for production? Ready to deploy!

---

## 📊 Final Verification Summary

| Component | Status | Notes |
|-----------|--------|-------|
| Node.js 18+ | ✓ | Required |
| npm | ✓ | Required |
| Dependencies | ✓ | npm install completed |
| .env file | ✓ | Configured from .env.example |
| MySQL Database | ✓ | Created with user privileges |
| TypeORM Sync | ✓ | Tables auto-created |
| Health Endpoint | ✓ | Responding at /health |
| Auth Endpoints | ✓ | Register/login/profile working |
| Clients Endpoints | ✓ | CRUD operations working |
| Access Keys | ✓ | Generate/validate/revoke working |
| Dashboard | ✓ | Statistics aggregating |
| Frontend Ready | ✓ | Can connect to API |
| Documentation | ✓ | 9 comprehensive guides |

---

## 🎯 What's Next?

### Immediate (Today)
1. Complete all steps of this checklist
2. Test the 5 test scenarios in Step 10
3. Verify frontend can connect to backend

### Short Term (This Week)
1. Implement full Angular frontend integration
2. Test complete user flow (register → login → create client → generate key)
3. Setup error handling and logging
4. Add input validation and security headers

### Medium Term (This Month)
1. Deploy to production
2. Setup monitoring and alerting
3. Configure database backups
4. Implement caching (Redis)
5. Add rate limiting
6. Setup CI/CD pipeline

### Long Term (Ongoing)
1. Monitor performance metrics
2. Optimize slow queries
3. Scale horizontally if needed
4. Keep dependencies updated
5. Regular security audits

---

## 📞 Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000          # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Kill it
kill -9 <PID>          # Mac/Linux
taskkill /PID <PID> /F # Windows
```

### Database Connection Failed
```bash
# Verify MySQL is running
mysql -u root -p

# Check credentials in .env
# Verify database exists
mysql -u admin -p -e "SHOW DATABASES;"
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules
npm cache clean --force
npm install
```

### CORS Error
- Update CORS_ORIGIN in .env
- Restart backend with `npm run start:dev`
- Check frontend URL matches exactly

### TypeScript Errors
```bash
# Rebuild project
npm run build

# Check for errors
npm run typecheck
```

---

## ✅ Achievement Unlocked!

Once you complete this checklist, you have:

- ✓ Fully functional NestJS backend
- ✓ MySQL database with auto-created tables
- ✓ JWT authentication system
- ✓ Complete REST API with 15+ endpoints
- ✓ Client management system
- ✓ API key generation and validation
- ✓ Dashboard statistics aggregation
- ✓ Comprehensive documentation
- ✓ Ready to connect Angular frontend
- ✓ Production-ready configuration

---

## 📚 Documentation Files

For more details, see:

1. **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - 5-minute quick commands
2. **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - All endpoint details
3. **[FRONTEND_INTEGRATION.md](FRONTEND_INTEGRATION.md)** - Angular integration
4. **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Complete testing scenarios
5. **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Production deployment
6. **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Project overview

---

## 🎉 Success!

Your NestJS backend is now:
- ✅ Installed
- ✅ Configured
- ✅ Running
- ✅ Tested
- ✅ Ready for production

**Start the backend with:**
```bash
npm run start:dev
```

**In another terminal, test with:**
```bash
curl http://localhost:3000/health
```

---

**Date:** February 12, 2026  
**Status:** Production Ready  
**Version:** 1.0.0  
**Support:** See documentation files for detailed guides
