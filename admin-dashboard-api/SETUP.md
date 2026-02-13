# Installation & Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js v18 or higher
- npm or yarn
- MySQL 8.0 or higher
- MySQL Workbench (optional, for GUI)

### Step 1: Install Node Dependencies

```bash
cd admin-dashboard-api
npm install
```

### Step 2: Setup MySQL Database

**Option A: Using MySQL Command Line**

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE admin_dashboard_db;
CREATE USER 'admin_user'@'localhost' IDENTIFIED BY 'admin123';
GRANT ALL PRIVILEGES ON admin_dashboard_db.* TO 'admin_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Option B: Using MySQL Workbench**
1. Open MySQL Workbench
2. Click + to create new connection or use existing
3. Right-click "Schemas" → Create Schema
4. Name: `admin_dashboard_db`
5. Click Apply

### Step 3: Configure Environment Variables

```bash
# Copy example file
cp .env.example .env

# Edit .env with your settings
# For Windows (PowerShell):
notepad .env

# For macOS/Linux:
nano .env
```

**Update these values:**
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
DB_NAME=admin_dashboard_db
JWT_SECRET=your_super_secret_key_here
PORT=3000
```

### Step 4: Run Database Auto-Sync

The application will automatically create tables when you start it. TypeORM synchronization is enabled in development mode.

### Step 5: Start the Backend Server

```bash
# Development mode (with hot reload)
npm run start:dev

# Or production mode
npm run build
npm run start:prod
```

You should see:
```
✅ Application is running on: http://localhost:3000
📚 API Documentation: http://localhost:3000/api
```

## 🧪 Testing the API

### Register Admin User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123",
    "firstName": "Admin",
    "lastName": "User"
  }'
```

Response:
```json
{
  "id": "uuid-here",
  "email": "admin@example.com",
  "firstName": "Admin",
  "lastName": "User",
  "isActive": true,
  "createdAt": "2024-02-12T...",
  "updatedAt": "2024-02-12T..."
}
```

### Login & Get Token
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "admin@example.com",
    "firstName": "Admin",
    "lastName": "User",
    "isActive": true,
    "createdAt": "2024-02-12T..."
  }
}
```

### Create Client (Protected)
```bash
TOKEN="your_access_token_from_login"

curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "companyName": "Tech Corp",
    "email": "contact@techcorp.com",
    "contactPerson": "John Smith",
    "contactNumber": "+1234567890",
    "address": "123 Tech St, San Francisco",
    "plan": "Pro",
    "startDate": "2024-02-12",
    "expirationDate": "2025-02-12",
    "modules": ["API", "Analytics", "Reports"]
  }'
```

### Get All Clients
```bash
curl http://localhost:3000/api/clients \
  -H "Authorization: Bearer $TOKEN"
```

### Generate Access Key
```bash
CLIENT_ID="client_uuid_from_response"

curl -X POST http://localhost:3000/api/access-keys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "clientId": "'$CLIENT_ID'",
    "expirationDate": "2025-06-12",
    "modules": ["API", "WebHooks"]
  }'
```

### Validate Access Key
```bash
ACCESS_KEY="generated_key_from_response"

curl http://localhost:3000/api/access-keys/validate/$ACCESS_KEY
```

### Get Dashboard Stats
```bash
curl http://localhost:3000/api/dashboard/stats \
  -H "Authorization: Bearer $TOKEN"
```

## 🔗 Connect Frontend to Backend

Update your Angular app's environment files:

**src/environment.ts:**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
};
```

**Create API service in Angular:**
```typescript
// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Auth endpoints
  register(data) {
    return this.http.post(`${this.apiUrl}/auth/register`, data);
  }

  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password });
  }

  // Clients
  getClients(page = 1, limit = 10) {
    return this.http.get(`${this.apiUrl}/clients?page=${page}&limit=${limit}`);
  }

  createClient(data) {
    return this.http.post(`${this.apiUrl}/clients`, data);
  }

  // And so on...
}
```

## 🐛 Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution:**
- Ensure MySQL is running: `mysql.server start` (Mac) or check Windows Services
- Verify credentials in .env file
- Check database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:**
- Kill process: `lsof -ti:3000 | xargs kill -9` (Mac/Linux)
- Or change PORT in `.env` to 3001, 3002, etc.

### JWT Authentication Failed
```
Error: Invalid token
```
**Solution:**
- Check JWT_SECRET is set in .env
- Verify token format: `Authorization: Bearer <token>`
- Ensure token hasn't expired

### TypeORM Synchronization Error
```
Error: Column count doesn't match
```
**Solution:**
- Delete and recreate database
- Or set `synchronize: false` in database.config.ts and use migrations

## 📱 API Base URL

All endpoints are prefixed with `/api`:
- `http://localhost:3000/api/auth/...`
- `http://localhost:3000/api/clients/...`
- `http://localhost:3000/api/access-keys/...`
- `http://localhost:3000/api/dashboard/...`

## 🔐 Security Notes

1. **Never commit `.env`** - It contains sensitive credentials
2. **Change JWT_SECRET** in production to a strong random string
3. **Use HTTPS** in production
4. **Keep dependencies updated**: `npm audit` and `npm update`
5. **Validate all inputs** on both frontend and backend

## 📊 Database Schema Auto-Creation

When you first run the app, these tables are created:

**users:**
- id, email (unique), password, firstName, lastName, role, isActive, createdAt, updatedAt

**clients:**
- id, companyName, email, contactPerson, contactNumber, address, plan, startDate, expirationDate, status, modules, createdAt, updatedAt

**access_keys:**
- id, key (unique), clientId (FK), modules, expirationDate, status, lastUsed, createdAt, updatedAt

## ✅ Verification Checklist

- [ ] MySQL is running
- [ ] Database created: `admin_dashboard_db`
- [ ] .env file configured
- [ ] `npm install` completed
- [ ] `npm run start:dev` shows "Application is running"
- [ ] Can register user
- [ ] Can login and get token
- [ ] Can create client
- [ ] Can generate access key
- [ ] Frontend can connect to backend

## 🎯 Next Steps

1. ✅ Backend running
2. 🔗 Connect Angular frontend to this API
3. 📱 Test all endpoints with Postman or similar
4. 🚀 Deploy to production server

---

**Need Help?** Check the full README.md for detailed API documentation.
