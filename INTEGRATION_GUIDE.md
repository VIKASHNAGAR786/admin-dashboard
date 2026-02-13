# Frontend & Backend Integration Guide

This document explains how the frontend and backend are connected and how to run both together.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Angular Frontend                         │
│              (admin-dashborad-ui - Port 4200)               │
├─────────────────────────────────────────────────────────────┤
│  Services Layer:                                            │
│  - AuthService (Login/Logout/Token Management)             │
│  - DataService (Clients, Keys, Stats)                      │
│  - JWT Interceptor (Auto-attach Authorization Header)      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    HTTP/REST API Calls
                    (localhost:3000/api)
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                  NestJS Backend API                          │
│               (admin-dashboard-api - Port 3000)             │
├─────────────────────────────────────────────────────────────┤
│  Controllers:                                               │
│  - AuthController (Login, Register, Profile)               │
│  - ClientsController (CRUD Operations)                     │
│  - AccessKeysController (Generate, Validate, Revoke)       │
│  - DashboardController (Stats)                             │
│                                                             │
│  Database: TypeORM (SQL Database)                          │
└─────────────────────────────────────────────────────────────┘
```

## API Endpoints

### Authentication
- **POST** `/api/auth/login` - Login with username and password
- **POST** `/api/auth/register` - Register new user
- **GET** `/api/auth/profile` - Get user profile (requires JWT)
- **POST** `/api/auth/logout` - Logout

### Clients
- **GET** `/api/clients` - Get all clients (paginated)
- **GET** `/api/clients/stats` - Get client statistics
- **POST** `/api/clients` - Create new client
- **GET** `/api/clients/:id` - Get client by ID
- **PUT** `/api/clients/:id` - Update client
- **DELETE** `/api/clients/:id` - Delete client

### Access Keys
- **GET** `/api/access-keys` - Get all keys (paginated)
- **POST** `/api/access-keys` - Generate new key
- **GET** `/api/access-keys/:id` - Get key by ID
- **GET** `/api/access-keys/client/:clientId` - Get keys by client
- **GET** `/api/access-keys/validate/:key` - Validate key
- **DELETE** `/api/access-keys/:id` - Revoke key

## Services Overview

### AuthService
Located: `admin-dashborad-ui/services/auth.service.ts`

**Key Methods:**
- `login(loginDto: LoginDto): Observable<LoginResponse>` - Authenticates user and stores JWT token
- `register(registerDto: RegisterDto): Observable<any>` - Registers new user
- `logout(): void` - Clears authentication tokens
- `isAuthenticated(): boolean` - Checks if user is authenticated
- `getToken(): string | null` - Retrieves stored JWT token
- `getUserProfile(): Observable<any>` - Fetches user profile from backend

**Token Management:**
- Token is stored in `localStorage` as `authToken`
- Token is automatically attached to all API requests via JWT Interceptor
- Token is cleared on logout

### DataService
Located: `admin-dashborad-ui/services/data.service.ts`

**Client Methods:**
- `getAllClients(page, limit)` - Fetch paginated clients
- `getClient(id)` - Fetch single client
- `getClientStats()` - Fetch client statistics
- `createClient(clientData)` - Create new client
- `updateClient(id, clientData)` - Update existing client
- `deleteClient(id)` - Delete client

**Key Methods:**
- `getAllGeneratedKeys(page, limit)` - Fetch paginated keys
- `getGeneratedKey(id)` - Fetch single key
- `getKeysByClient(clientId)` - Get keys for specific client
- `validateKey(key)` - Validate an access key
- `addGeneratedKey(keyData)` - Generate new access key
- `revokeKey(id)` - Revoke/delete key

**Observables:**
- `clients$: Observable<Client[]>` - Real-time client list
- `generatedKeys$: Observable<GeneratedKey[]>` - Real-time generated keys list

### JWT Interceptor
Located: `admin-dashborad-ui/services/jwt.interceptor.ts`

**Functionality:**
- Automatically attaches JWT token to all HTTP requests
- Adds `Authorization: Bearer <token>` header
- Works with all API endpoints that require authentication

## Running the Applications

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- A running database (check backend setup)

### Backend Setup & Run

```bash
cd admin-dashboard-api

# Install dependencies
npm install

# Set up environment variables (create .env file)
# DATABASE_URL=your_database_url
# JWT_SECRET=your_secret_key

# Run database migrations (if using TypeORM)
# npm run typeorm migration:run

# Start the server
npm run start

# For development with hot reload
npm run start:dev
```

Backend runs on **http://localhost:3000**

### Frontend Setup & Run

```bash
cd admin-dashborad-ui

# Install dependencies
npm install

# Start development server
npm start

# Frontend will open at http://localhost:4200
```

### Run Both Together

**Option 1: Two Terminal Windows**

Terminal 1 - Backend:
```bash
cd admin-dashboard-api
npm install
npm run start:dev
```

Terminal 2 - Frontend:
```bash
cd admin-dashborad-ui
npm install
npm start
```

**Option 2: Using npm-run-all (Recommended)**

In the root directory, install `npm-run-all`:
```bash
npm install -D npm-run-all
```

Create a `package.json` in the root:
```json
{
  "scripts": {
    "start": "npm-run-all --parallel start:api start:ui",
    "start:api": "cd admin-dashboard-api && npm run start:dev",
    "start:ui": "cd admin-dashborad-ui && npm start"
  }
}
```

Then run:
```bash
npm start
```

## Environment Configuration

### Frontend - `environment.ts`
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

### Frontend - `environment.prod.ts`
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com/api'
};
```

### Backend - `.env`
```
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/admin_dashboard
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=24h
CORS_ORIGIN=http://localhost:4200
```

## CORS Configuration

The backend is configured to allow requests from the frontend:

```typescript
// In admin-dashboard-api/src/main.ts
app.enableCors({
  origin: corsConfig.origin,        // Usually http://localhost:4200
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

## Authentication Flow

1. **Login**
   - User enters credentials on login page
   - Frontend sends POST request to `/api/auth/login`
   - Backend validates credentials and returns JWT token
   - Frontend stores token in `localStorage`

2. **Authenticated Requests**
   - JWT Interceptor automatically adds `Authorization: Bearer <token>` header
   - Backend validates token at `@UseGuards(JwtAuthGuard)`
   - Backend processes request and returns data

3. **Logout**
   - Frontend clears `localStorage`
   - User is redirected to login page

## Error Handling

### Frontend Error Handling
Services include error handling with `catchError` operator:
```typescript
catchError((error) => {
  console.error('Error:', error);
  return throwError(() => error.error?.message || 'Operation failed');
})
```

### Backend Error Handling
NestJS provides:
- Global exception filters
- Validation pipes for DTOs
- Custom error responses

## Best Practices

1. **Always use the DataService** - Don't make direct HTTP calls in components
2. **Subscribe to Observables** - Use `async` pipe in templates or subscribe in components
3. **Unsubscribe on Destroy** - Use `takeUntil` pattern to avoid memory leaks
4. **Handle Errors** - Always provide error handling for API calls
5. **Keep Environment Config** - Use different URLs for dev/prod

## Testing API Connections

### Using Postman/Insomnia

1. **Login first:**
   ```
   POST http://localhost:3000/api/auth/login
   Content-Type: application/json
   
   {
     "username": "admin",
     "password": "admin123"
   }
   ```

2. **Copy the access_token from response**

3. **Use token in other requests:**
   ```
   GET http://localhost:3000/api/clients
   Authorization: Bearer <access_token>
   ```

### Using Angular DevTools
- Open browser DevTools
- Check Network tab for API calls
- Verify requests have `Authorization` header
- Check response status codes

## Troubleshooting

### "Cannot connect to localhost:3000"
- Ensure backend is running: `npm run start:dev`
- Check if port 3000 is available
- Verify firewall settings

### "401 Unauthorized"
- JWT token is missing or expired
- Log in again to get new token
- Check `localStorage` for `authToken`

### "CORS error"
- Ensure backend has CORS enabled
- Check frontend `apiUrl` in `environment.ts`
- Verify credentials header is correct

### "API returns 500"
- Check backend console for error details
- Verify database connection
- Check request payload matches DTO requirements

## Related Documentation
- [API Documentation](./admin-dashboard-api/API_DOCUMENTATION.md)
- [Frontend Setup Guide](./admin-dashborad-ui/SETUP_GUIDE.md)
- [Deployment Guide](./admin-dashboard-api/DEPLOYMENT_GUIDE.md)
