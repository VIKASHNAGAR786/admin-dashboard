# Backend Project Summary & Configuration

Complete overview of your NestJS backend project structure, configuration, and how everything works together.

---

## Project Overview

**Project Name:** Admin Dashboard API  
**Framework:** NestJS 10.3.3  
**Database:** MySQL 8.0+  
**ORM:** TypeORM 0.3.19  
**Authentication:** JWT with Passport  
**Language:** TypeScript 5.3  
**Backend Port:** 3000  
**Frontend Port:** 4200 (Angular)

---

## Directory Structure

```
admin-dashboard-api/
├── src/
│   ├── auth/
│   │   ├── auth.controller.ts       # Routes: register, login, logout, profile
│   │   ├── auth.service.ts          # Password hashing, JWT token generation
│   │   ├── auth.module.ts           # NestJS module configuration
│   │   ├── entities/
│   │   │   └── user.entity.ts       # User model (UUID, email, password, name)
│   │   ├── dtos/
│   │   │   ├── register.dto.ts      # Input validation for registration
│   │   │   └── login.dto.ts         # Input validation for login
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts    # JWT validation guard for protected routes
│   │   ├── decorators/
│   │   │   └── get-user.decorator.ts # @GetUser() decorator for extracting user
│   │   └── strategies/
│   │       └── jwt.strategy.ts       # JWT strategy for Passport
│   │
│   ├── clients/
│   │   ├── clients.controller.ts    # Routes: CRUD, pagination, stats
│   │   ├── clients.service.ts       # Business logic, database operations
│   │   ├── clients.module.ts        # Module configuration
│   │   ├── entities/
│   │   │   └── client.entity.ts     # Client model with AccessKey relationship
│   │   └── dtos/
│   │       ├── create-client.dto.ts # Client creation validation
│   │       └── update-client.dto.ts # Client update validation
│   │
│   ├── access-keys/
│   │   ├── access-keys.controller.ts # Routes: generate, list, validate, revoke
│   │   ├── access-keys.service.ts   # Key generation, validation logic
│   │   ├── access-keys.module.ts    # Module configuration
│   │   ├── entities/
│   │   │   └── access-key.entity.ts # Key model with expiration, status tracking
│   │   └── dtos/
│   │       └── generate-key.dto.ts  # Key generation validation
│   │
│   ├── dashboard/
│   │   ├── dashboard.controller.ts  # Routes: stats, summary, activity
│   │   ├── dashboard.service.ts     # Aggregates statistics across modules
│   │   └── dashboard.module.ts      # Module configuration
│   │
│   ├── config/
│   │   └── database.config.ts       # Centralized config for DB, JWT, CORS
│   │
│   ├── app.module.ts                # Root module, TypeORM setup
│   ├── app.controller.ts            # Health check endpoint
│   ├── app.service.ts               # Application-level service
│   └── main.ts                      # Entry point, app bootstrap
│
├── .env                             # Local environment variables (Git ignored)
├── .env.example                     # Template for .env file
├── .gitignore                       # Git ignore rules
├── tsconfig.json                    # TypeScript configuration
├── package.json                     # Dependencies and scripts
├── package-lock.json                # Locked dependency versions
├── nest-cli.json                    # NestJS CLI configuration
│
├── Documentation/
│   ├── README.md                    # Complete API overview
│   ├── SETUP.md                     # Installation & setup instructions
│   ├── TESTING_GUIDE.md             # Testing all endpoints with curl
│   ├── API_DOCUMENTATION.md         # Complete endpoint reference
│   ├── FRONTEND_INTEGRATION.md      # Angular integration guide
│   └── QUICK_REFERENCE.md           # Fast command reference
│
├── verify-setup.sh                  # Bash setup verification script
└── verify-setup.ps1                 # PowerShell setup verification script
```

---

## Core Modules

### 1. Authentication Module (`auth/`)

**Purpose:** User registration, login, JWT token generation, and profile management

**Key Files:**
- `user.entity.ts` - Defines User table structure
- `auth.service.ts` - Password hashing (bcrypt), JWT token generation
- `auth.controller.ts` - HTTP endpoints for auth operations
- `jwt.strategy.ts` - Passport JWT strategy
- `jwt-auth.guard.ts` - Protects routes that require authentication

**Database Table:**
```sql
CREATE TABLE user (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  firstName VARCHAR(100),
  lastName VARCHAR(100),
  password VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin',
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

**Endpoints:**
- `POST /auth/register` - Create new user
- `POST /auth/login` - Get JWT token
- `GET /auth/profile` - Get user details (protected)
- `POST /auth/logout` - Logout (protected)

---

### 2. Clients Module (`clients/`)

**Purpose:** Manage client companies, plans, and subscription details

**Key Files:**
- `client.entity.ts` - Client model with fields for company, plan, modules
- `clients.service.ts` - CRUD operations, pagination, statistics
- `clients.controller.ts` - HTTP endpoints for client management

**Database Table:**
```sql
CREATE TABLE client (
  id VARCHAR(36) PRIMARY KEY,
  companyName VARCHAR(255),
  email VARCHAR(255),
  contactPerson VARCHAR(100),
  contactNumber VARCHAR(20),
  address TEXT,
  plan VARCHAR(50), -- 'Basic', 'Pro', 'Enterprise'
  startDate DATE,
  expirationDate DATE,
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive'
  modules JSON, -- ["API", "Analytics", "Reports"]
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

**Key Features:**
- Pagination support (page, limit parameters)
- Plan distribution statistics
- Expiration tracking
- Module management (JSON array)

**Endpoints:**
- `GET /clients?page=1&limit=10` - List with pagination
- `POST /clients` - Create client
- `GET /clients/:id` - Get single client
- `PUT /clients/:id` - Update client
- `DELETE /clients/:id` - Delete client
- `GET /clients/stats` - Get statistics (all protected)

---

### 3. Access Keys Module (`access-keys/`)

**Purpose:** Generate, validate, and manage API keys for client authentication

**Key Files:**
- `access-key.entity.ts` - API key model with expiration and status
- `access-keys.service.ts` - Key generation, validation, revocation
- `access-keys.controller.ts` - HTTP endpoints for key management

**Database Table:**
```sql
CREATE TABLE access_key (
  id VARCHAR(36) PRIMARY KEY,
  key VARCHAR(255) UNIQUE, -- Format: AK_[20 hex]_[timestamp]36
  clientId VARCHAR(36) FOREIGN KEY REFERENCES client(id),
  modules JSON, -- Modules this key can access
  expirationDate DATE,
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'revoked'
  lastUsed TIMESTAMP,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

**Key Features:**
- Unique key generation (crypto-based)
- Expiration validation
- Status tracking (active/revoked)
- Last used timestamp for audit
- Public validation endpoint (no auth required)

**Endpoints:**
- `POST /access-keys` - Generate new key
- `GET /access-keys?page=1&limit=10` - List keys
- `GET /access-keys/client/:clientId` - Keys for specific client
- `GET /access-keys/validate/:key` - Validate key **[PUBLIC]**
- `DELETE /access-keys/:id` - Revoke key
- (Most are protected except validation)

---

### 4. Dashboard Module (`dashboard/`)

**Purpose:** Aggregate and display statistics across all modules

**Key Features:**
- Total clients and active clients
- Plan distribution breakdown
- Total API keys generated
- Recent activity tracking
- Session summary data

**Database Queries:**
- Count total/active clients
- Count keys per client
- Aggregate plan distribution
- Get recent client creations

**Endpoints:**
- `GET /dashboard/stats` - Statistics summary
- `GET /dashboard/summary` - Detailed summary with session info
- `GET /dashboard/activity` - Recent activity list
- (All protected)

---

## Database Configuration

### Connection Settings

**File:** `src/config/database.config.ts`

```typescript
const databaseConfig = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USERNAME || 'admin',
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_DATABASE || 'admin_dashboard_db',
  entities: ['dist/**/*.entity.js'],
  synchronize: true, // Auto-create tables in development
  logging: true,     // Log SQL queries
  dropSchema: false  // Don't drop tables on startup
};
```

### Key Configuration Features

- **Auto-synchronize**: Entities automatically create/update database tables
- **Logging**: SQL queries logged to console (development only)
- **Relationships**: One-to-many (Client → AccessKey)
- **Timestamps**: All entities have createdAt/updatedAt
- **UUIDs**: All IDs are UUID v4 (not auto-increment integers)

---

## Authentication System

### JWT Configuration

**File:** `src/config/database.config.ts`

```typescript
const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your-secret-key-min-32-characters',
  expiresIn: process.env.JWT_EXPIRATION || 3600 // 1 hour
};
```

### Authentication Flow

1. **Registration**
   - User submits: email, password, firstName, lastName
   - Password is hashed using bcrypt (10 salt rounds)
   - User created in database
   - Returns user object (no token)

2. **Login**
   - User submits: email, password
   - Password compared with stored hash
   - JWT token generated: `header.payload.signature`
   - Token contains: userId (sub), email, iat, exp
   - Client stores token in localStorage
   - Token included in Authorization header for protected requests

3. **Protected Request**
   - Client sends: `Authorization: Bearer <token>`
   - JWT Guard validates signature and expiration
   - If valid: user extracted from token
   - If invalid: returns 401 Unauthorized

4. **Token Expiration**
   - Default: 1 hour (3600 seconds)
   - Configurable via JWT_EXPIRATION env var
   - Client must re-login when expired

### Security Features

- **Bcrypt**: Passwords hashed with 10 salt rounds
- **JWT**: Stateless authentication (no sessions)
- **HTTPS**: Use HTTPS in production
- **Secrets**: JWT_SECRET should be 32+ characters
- **CORS**: Limited to configured origins only

---

## API Response Format

### Success Response (20x)

```json
{
  "statusCode": 200,
  "data": { /* actual data */ },
  "message": "Success message"
}
```

### Error Response (4xx, 5xx)

```json
{
  "statusCode": 400,
  "message": ["Validation error 1", "Validation error 2"],
  "error": "Bad Request"
}
```

### Pagination Response

```json
{
  "data": [{ /* items */ }],
  "total": 50,
  "page": 1,
  "limit": 10,
  "pages": 5
}
```

---

## Environment Variables

**File:** `.env` (create from `.env.example`)

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=admin
DB_PASSWORD=admin123
DB_DATABASE=admin_dashboard_db

# JWT
JWT_SECRET=your-secret-key-minimum-32-characters-long
JWT_EXPIRATION=3600

# CORS (comma-separated origins)
CORS_ORIGIN=http://localhost:4200,http://localhost:3000

# Application
NODE_ENV=development
PORT=3000
```

---

## Running the Application

### Development Mode (Watch & Auto-reload)

```bash
npm run start:dev
```

Console Output:
```
[NestFactory] Starting NestJS 10.3.3 application
[DatabaseModule] Initializing database connection
Connected to MySQL successfully
✅ Application is running on http://localhost:3000
```

### Production Build

```bash
npm run build    # Compile TypeScript to JavaScript
npm start        # Run built application
```

### Testing

```bash
npm test         # Run unit tests
npm run test:e2e # Run end-to-end tests
npm run test:cov # Generate coverage report
```

---

## Database Auto-sync

When application starts:

1. TypeORM reads all entity definitions
2. Connects to MySQL database
3. Compares entities with actual database schema
4. **Auto-creates missing tables**
5. **Auto-adds missing columns**
6. **Auto-creates relationships**
7. **Does NOT drop or modify existing data**

First run will create:
- `user` table
- `client` table
- `access_key` table
- Foreign key relationships

---

## CORS Configuration

**Enabled Origins:**
- Development: `http://localhost:4200` (Angular)
- Development: `http://localhost:3000` (Local API testing)
- Add more origins in `.env` as needed

**Credentials:** Enabled for cookie/auth header support

**Methods:** GET, POST, PUT, DELETE, PATCH, OPTIONS

**Headers:** Content-Type, Authorization

---

## Error Handling

### Validation Errors (400)
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password should not be empty"
  ],
  "error": "Bad Request"
}
```

### Authentication Errors (401)
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### Not Found Errors (404)
```json
{
  "statusCode": 404,
  "message": "Client not found",
  "error": "Not Found"
}
```

### Server Errors (500)
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## Project Dependencies

### Core Framework
- `@nestjs/core` - NestJS framework
- `@nestjs/common` - Common utilities
- `@nestjs/platform-express` - Express HTTP adapter

### Database
- `typeorm` - ORM for database
- `mysql2` - MySQL driver
- `uuid` - UUID generation

### Authentication
- `@nestjs/passport` - Passport integration
- `@nestjs/jwt` - JWT authentication
- `passport-jwt` - JWT strategy
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT utilities

### Validation
- `class-validator` - DTO validation
- `class-transformer` - Object transformation

### Development
- `@nestjs/cli` - NestJS command-line tools
- `typescript` - TypeScript compiler
- `ts-loader` - TypeScript loader for webpack
- `jest` - Testing framework
- `@types/node` - Node.js type definitions

---

## Common Development Tasks

### Add New Entity

1. Create file: `src/users/entities/profile.entity.ts`
2. Define class with `@Entity()` decorator
3. Add to TypeORM module
4. Auto-sync will create database table

### Add New Endpoint

1. Create controller method with route decorator
2. Add service method with business logic
3. Use `@UseGuards(JwtAuthGuard)` for protected routes
4. NestJS automatically validates request body with DTOs

### Generate Migration

```bash
typeorm migration:generate src/migrations/Migration -d src/config/database.config.ts
npm run migration:run
```

### Add Logging

```typescript
import { Logger } from '@nestjs/common';

const logger = new Logger('ClassName');
logger.log('Message');
logger.error('Error message');
```

---

## Performance Considerations

### Pagination
- Always use pagination for list endpoints
- Default: 10 items per page
- Maximum: 100 items per page (configurable)

### Query Optimization
- Use `.select()` to fetch specific columns
- Load related entities only when needed
- Use indexing for frequently queried fields

### Caching
- Implement Redis for session/token caching
- Cache dashboard statistics (high read, low write)
- Cache client list with short TTL

### Rate Limiting
- Add `@nestjs/throttler` for rate limiting
- Protect endpoints from brute force attacks
- Per-IP request limits

---

## Production Deployment

### Pre-deployment Checklist

- [ ] Update JWT_SECRET to strong random value
- [ ] Set NODE_ENV=production
- [ ] Use HTTPS URLs only
- [ ] Setup error logging service
- [ ] Configure database backups
- [ ] Setup monitoring and alerting
- [ ] Test all endpoints in production environment
- [ ] Setup CI/CD pipeline
- [ ] Configure proper CORS origins
- [ ] Setup rate limiting

### Environment Setup

```env
NODE_ENV=production
JWT_SECRET=<very-long-random-string-32+-chars>
DB_HOST=<production-database-host>
DB_USERNAME=<production-db-user>
DB_PASSWORD=<strong-password>
DB_DATABASE=admin_dashboard_prod
CORS_ORIGIN=https://yourdomain.com
```

---

## Troubleshooting

### Application Won't Start
1. Check Node.js version (18+ required)
2. Run `npm install` 
3. Check .env file exists and is readable
4. Verify MySQL connection details
5. Check if port 3000 is already in use

### Database Connection Failed
1. Verify MySQL service is running
2. Check connection credentials in .env
3. Verify database exists
4. Check user has proper permissions

### Authentication Issues
1. Clear localStorage in browser
2. Verify JWT_SECRET matches
3. Check token expiry time
4. Re-login to get fresh token

### CORS Errors
1. Verify frontend URL in CORS_ORIGIN
2. Check for trailing slashes
3. Restart backend after .env changes
4. Check browser console for exact error

---

## Next Steps

1. **Start Backend**: `npm run start:dev`
2. **Test Endpoints**: Follow [TESTING_GUIDE.md](TESTING_GUIDE.md)
3. **Connect Frontend**: Follow [FRONTEND_INTEGRATION.md](FRONTEND_INTEGRATION.md)
4. **Deploy**: Update environment for production
5. **Monitor**: Setup logging and error tracking
6. **Scale**: Add caching, load balancing, etc.

---

**Last Updated:** February 12, 2026  
**API Version:** 1.0.0  
**Status:** Production Ready
