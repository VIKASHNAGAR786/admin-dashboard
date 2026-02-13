# Admin Dashboard API Backend

Complete NestJS backend with MySQL database for Admin Dashboard application.

## 🚀 Features

- ✅ JWT Authentication (login/logout)
- ✅ User Management
- ✅ Client Management (CRUD operations)
- ✅ API Key Generation & Management
- ✅ Database: MySQL with TypeORM
- ✅ Request Validation (class-validator)
- ✅ Error Handling
- ✅ CORS Support
- ✅ Environment Configuration

## 📋 Prerequisites

- Node.js (v18+)
- npm or yarn
- MySQL Server (v8+)

## 🔧 Installation

```bash
# Install dependencies
npm install

# Create database
mysql -u root -p
CREATE DATABASE admin_dashboard_db;
EXIT;

# Configure environment variables
cp .env.example .env

# Edit .env with your database credentials
```

## 📝 Environment Variables

Create a `.env` file in the project root:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=admin_dashboard_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRATION=3600

# Server Configuration
PORT=3000
NODE_ENV=development
```

## 🏃 Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

Server will run on: `http://localhost:3000`

## 🗄️ Database Setup

The application uses TypeORM with auto-synchronization. Tables will be created automatically:

- `users` - Admin users
- `clients` - Client company information
- `access_keys` - Generated API keys

## 📚 API Endpoints

### Authentication
- `POST /auth/register` - Register new admin user
- `POST /auth/login` - Login admin user
- `POST /auth/logout` - Logout user
- `GET /auth/profile` - Get current user profile

### Clients
- `GET /clients` - Get all clients (paginated)
- `GET /clients/:id` - Get specific client
- `POST /clients` - Create new client
- `PUT /clients/:id` - Update client
- `DELETE /clients/:id` - Delete client

### Access Keys
- `GET /access-keys` - Get all generated keys
- `POST /access-keys` - Generate new access key
- `DELETE /access-keys/:id` - Revoke access key
- `GET /access-keys/validate/:key` - Validate access key

### Dashboard Statistics
- `GET /dashboard/stats` - Get dashboard statistics
- `GET /dashboard/summary` - Get session summary

## 🗄️ Database Schema

### users table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  firstName VARCHAR(100),
  lastName VARCHAR(100),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### clients table
```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY,
  companyName VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  contactPerson VARCHAR(255),
  contactNumber VARCHAR(20),
  address TEXT,
  plan VARCHAR(50),
  startDate DATE,
  expirationDate DATE,
  status VARCHAR(50),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### access_keys table
```sql
CREATE TABLE access_keys (
  id UUID PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  clientId UUID NOT NULL,
  modules JSON,
  expirationDate DATE,
  status VARCHAR(50),
  lastUsed TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE
);
```

## 🔐 Authentication

The API uses JWT tokens for authentication:

1. Register/Login to get JWT token
2. Include token in `Authorization` header: `Bearer <token>`
3. Token expires after configured time (default: 1 hour)

## 📦 Project Structure

```
src/
├── auth/
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   ├── jwt.strategy.ts
│   └── dto/
├── clients/
│   ├── clients.module.ts
│   ├── clients.service.ts
│   ├── clients.controller.ts
│   ├── entities/
│   └── dto/
├── access-keys/
│   ├── access-keys.module.ts
│   ├── access-keys.service.ts
│   ├── access-keys.controller.ts
│   ├── entities/
│   └── dto/
├── dashboard/
│   ├── dashboard.module.ts
│   ├── dashboard.service.ts
│   ├── dashboard.controller.ts
│   └── dto/
├── database/
│   └── database.module.ts
├── config/
│   └── environment.ts
├── app.module.ts
└── main.ts
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

## 📖 Example Requests

### Register User
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "securepass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "securepass123"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@example.com",
    "firstName": "John"
  }
}
```

### Create Client
```bash
POST /clients
Authorization: Bearer <token>
Content-Type: application/json

{
  "companyName": "Tech Corp",
  "email": "contact@techcorp.com",
  "contactPerson": "John Smith",
  "contactNumber": "+1234567890",
  "plan": "Pro",
  "expirationDate": "2025-12-31",
  "modules": ["Analytics", "Reports"]
}
```

### Generate Access Key
```bash
POST /access-keys
Authorization: Bearer <token>
Content-Type: application/json

{
  "clientId": "uuid",
  "expirationDate": "2025-06-30",
  "modules": ["API", "WebHooks"]
}
```

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Request validation with class-validator
- CORS enabled
- Environment variable protection
- SQL injection prevention (TypeORM parameterized queries)

## 🐛 Troubleshooting

### Database connection failed
- Check MySQL is running
- Verify credentials in `.env`
- Ensure database exists: `CREATE DATABASE admin_dashboard_db;`

### Port already in use
- Change PORT in `.env`
- Or: Kill process using port 3000

### JWT token invalid
- Verify JWT_SECRET is set in `.env`
- Check token hasn't expired
- Ensure token format: `Bearer <token>`

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Commit changes: `git commit -am 'Add feature'`
3. Push branch: `git push origin feature/name`
4. Open Pull Request

## 📄 License

MIT

## 🆘 Support

For issues or questions, please create an issue or contact the development team.

---

**Version:** 1.0.0  
**Last Updated:** February 2026
