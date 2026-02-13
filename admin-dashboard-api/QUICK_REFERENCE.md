# Quick Reference Guide

Fast reference for common tasks and commands.

---

## Installation & Setup (5 minutes)

```bash
# 1. Navigate to project
cd admin-dashboard-api

# 2. Install dependencies
npm install

# 3. Create environment file
copy .env.example .env

# 4. Update .env with your database credentials
# DB_HOST=localhost
# DB_PORT=3306
# DB_USERNAME=admin
# DB_PASSWORD=admin123
# DB_DATABASE=admin_dashboard_db
# JWT_SECRET=your_secret_key_here

# 5. Create MySQL database
mysql -u root -p
CREATE DATABASE admin_dashboard_db;
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin123';
GRANT ALL PRIVILEGES ON admin_dashboard_db.* TO 'admin'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# 6. Start backend
npm run start:dev
```

---

## Running the Application

### Development Mode
```bash
npm run start:dev
# Watches files and auto-restarts on changes
# Runs on http://localhost:3000
```

### Production Build
```bash
npm run build
npm run start:prod
```

### Run Tests
```bash
npm test
npm run test:e2e
```

---

## API Endpoints Cheat Sheet

### Authentication
```
POST   /api/auth/register      → Register user
POST   /api/auth/login         → Login & get token
GET    /api/auth/profile       → Get user profile (Protected)
POST   /api/auth/logout        → Logout (Protected)
```

### Clients
```
GET    /api/clients            → List all clients (Protected)
POST   /api/clients            → Create client (Protected)
GET    /api/clients/:id        → Get client detail (Protected)
PUT    /api/clients/:id        → Update client (Protected)
DELETE /api/clients/:id        → Delete client (Protected)
GET    /api/clients/stats      → Get statistics (Protected)
```

### Access Keys
```
POST   /api/access-keys                    → Generate key (Protected)
GET    /api/access-keys                    → List keys (Protected)
GET    /api/access-keys/client/:clientId   → Get client keys (Protected)
GET    /api/access-keys/validate/:key      → Validate key (Public!)
DELETE /api/access-keys/:id                → Revoke key (Protected)
```

### Dashboard
```
GET    /api/dashboard/stats    → Get statistics (Protected)
GET    /api/dashboard/summary  → Get summary (Protected)
GET    /api/dashboard/activity → Get activity (Protected)
```

---

## Testing Commands

### Health Check
```bash
curl http://localhost:3000/health
```

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePass123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login & Get Token
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePass123"
  }'

# Save token from response:
# TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Authenticated Request
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

### Create Client
```bash
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "companyName": "Tech Corp",
    "email": "contact@techcorp.com",
    "contactPerson": "John Smith",
    "contactNumber": "+1234567890",
    "address": "123 Tech St",
    "plan": "Pro",
    "startDate": "2024-02-12",
    "expirationDate": "2025-02-12",
    "modules": ["API", "Analytics"]
  }'
```

### Generate Access Key
```bash
curl -X POST http://localhost:3000/api/access-keys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "clientId": "client-id-here",
    "expirationDate": "2025-12-31",
    "modules": ["API", "WebHooks"]
  }'
```

### Validate Access Key (No Auth Needed)
```bash
curl -X GET http://localhost:3000/api/access-keys/validate/AK_ABC123_XYZ
```

---

## Database Management

### View Database
```bash
mysql -u admin -p
USE admin_dashboard_db;
SHOW TABLES;
DESC users;
DESC clients;
DESC access_keys;
```

### Clear All Data
```bash
DROP DATABASE admin_dashboard_db;
CREATE DATABASE admin_dashboard_db;
```

### Backup Database
```bash
mysqldump -u admin -p admin_dashboard_db > backup.sql
```

### Restore Database
```bash
mysql -u admin -p admin_dashboard_db < backup.sql
```

---

## File Structure

```
admin-dashboard-api/
├── src/
│   ├── auth/                    # Authentication module
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   ├── dtos/
│   │   │   ├── register.dto.ts
│   │   │   └── login.dto.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   └── auth.module.ts
│   │
│   ├── clients/                 # Client management module
│   │   ├── entities/
│   │   │   └── client.entity.ts
│   │   ├── dtos/
│   │   │   ├── create-client.dto.ts
│   │   │   └── update-client.dto.ts
│   │   ├── clients.service.ts
│   │   ├── clients.controller.ts
│   │   └── clients.module.ts
│   │
│   ├── access-keys/             # API key management module
│   │   ├── entities/
│   │   │   └── access-key.entity.ts
│   │   ├── dtos/
│   │   │   └── generate-key.dto.ts
│   │   ├── access-keys.service.ts
│   │   ├── access-keys.controller.ts
│   │   └── access-keys.module.ts
│   │
│   ├── dashboard/               # Dashboard statistics module
│   │   ├── dashboard.service.ts
│   │   ├── dashboard.controller.ts
│   │   └── dashboard.module.ts
│   │
│   ├── config/
│   │   └── database.config.ts   # Database, JWT, CORS config
│   │
│   ├── app.module.ts            # Root module
│   ├── app.controller.ts        # Health check
│   ├── app.service.ts
│   └── main.ts                  # Application bootstrap
│
├── .env                         # Environment variables (create from .env.example)
├── .env.example                 # Environment template
├── .gitignore
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── README.md                    # API documentation
├── SETUP.md                     # Setup guide
├── TESTING_GUIDE.md             # Testing documentation
├── FRONTEND_INTEGRATION.md      # Angular integration guide
└── API_DOCUMENTATION.md         # Complete API reference
```

---

## Environment Variables

Create `.env` file from `.env.example`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=admin
DB_PASSWORD=admin123
DB_DATABASE=admin_dashboard_db

# JWT Configuration
JWT_SECRET=your-secret-key-min-32-characters-long
JWT_EXPIRATION=3600

# CORS Configuration (comma-separated)
CORS_ORIGIN=http://localhost:4200,http://localhost:3000

# Application
NODE_ENV=development
PORT=3000
```

---

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000          # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>          # Mac/Linux
taskkill /PID <PID> /F # Windows
```

### Database Connection Failed
```bash
# Check MySQL is running
mysql -u root -p     # Should connect

# Verify credentials in .env
# Verify database exists
mysql -u admin -p -e "SHOW DATABASES;"

# Verify database is selected
mysql -u admin -p admin_dashboard_db -e "SHOW TABLES;"
```

### JWT Token Expired
```bash
# Token expires according to JWT_EXPIRATION in .env
# Default: 3600 seconds (1 hour)
# Login again to get new token
```

### Module Not Found Error
```bash
# Reinstall dependencies
rm -rf node_modules
npm cache clean --force
npm install
```

### CORS Error
```bash
# Update .env CORS_ORIGIN
CORS_ORIGIN=http://localhost:4200

# Restart backend
npm run start:dev
```

---

## Authentication Flow

### 1. Register
```
POST /auth/register
→ Hash password (bcrypt)
→ Create user in database
→ Return user object
```

### 2. Login
```
POST /auth/login
→ Find user by email
→ Compare password hash
→ Generate JWT token
→ Return token + user
```

### 3. Protected Request
```
GET /clients
Header: Authorization: Bearer <token>
→ JWT strategy validates token
→ Extract userId from token
→ Process request
→ Return data
```

### 4. Logout
```
POST /auth/logout
→ Token remains valid (stateless)
→ Client should delete token from storage
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Login again, check token validity |
| 403 Forbidden | Check JWT_SECRET matches |
| 404 Not Found | Verify endpoint path, check resource exists |
| 500 Server Error | Check logs, verify database connection |
| CORS Error | Update CORS_ORIGIN in .env |
| Connection Timeout | Check MySQL is running |
| Module not found | Run `npm install` |
| Port in use | Kill process using port 3000 |

---

## Useful Commands

```bash
# View logs
npm run start:dev 2>&1 | tee api.log

# Format code
npm run format

# Lint code
npm run lint

# Check TypeScript
npm run typecheck

# Clean build
npm run clean

# View package versions
npm list

# Update packages
npm update

# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

---

## Next Steps

1. **Start Backend**: `npm run start:dev`
2. **Test API**: See [TESTING_GUIDE.md](TESTING_GUIDE.md)
3. **Connect Angular**: See [FRONTEND_INTEGRATION.md](FRONTEND_INTEGRATION.md)
4. **Deploy**: Update environment variables for production
5. **Scale**: Add caching, rate limiting, logging

---

## Support & Documentation

- **API Docs**: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Setup Guide**: [SETUP.md](SETUP.md)
- **Testing Guide**: [TESTING_GUIDE.md](TESTING_GUIDE.md)
- **Frontend Integration**: [FRONTEND_INTEGRATION.md](FRONTEND_INTEGRATION.md)
- **Complete README**: [README.md](README.md)

---

**Last Updated:** February 12, 2026  
**API Version:** 1.0.0
