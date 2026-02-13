# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer <access_token>
```

---

## 📝 Authentication Endpoints

### POST /auth/register
Register a new admin user.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "securepass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "admin@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "isActive": true,
  "createdAt": "2024-02-12T10:30:00Z"
}
```

---

### POST /auth/login
Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "securepass123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "admin@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isActive": true,
    "createdAt": "2024-02-12T10:30:00Z"
  }
}
```

---

### POST /auth/logout
Logout current user.

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

### GET /auth/profile
Get current user profile (Protected).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "admin@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "isActive": true,
  "createdAt": "2024-02-12T10:30:00Z"
}
```

---

## 👥 Clients Endpoints

### GET /clients
Get all clients with pagination (Protected).

**Query Parameters:**
- `page` (number): Page number, default 1
- `limit` (number): Items per page, default 10

**Example:**
```
GET /clients?page=1&limit=10
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "companyName": "Tech Corp",
      "email": "contact@techcorp.com",
      "contactPerson": "John Smith",
      "contactNumber": "+1234567890",
      "address": "123 Tech St",
      "plan": "Pro",
      "startDate": "2024-01-15",
      "expirationDate": "2025-01-15",
      "status": "active",
      "modules": ["API", "Analytics", "Reports"],
      "createdAt": "2024-02-12T10:30:00Z",
      "updatedAt": "2024-02-12T10:30:00Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10,
  "pages": 5
}
```

---

### POST /clients
Create new client (Protected).

**Request Body:**
```json
{
  "companyName": "Tech Corp",
  "email": "contact@techcorp.com",
  "contactPerson": "John Smith",
  "contactNumber": "+1234567890",
  "address": "123 Tech St, San Francisco",
  "plan": "Pro",
  "startDate": "2024-02-12",
  "expirationDate": "2025-02-12",
  "modules": ["API", "Analytics", "Reports"]
}
```

**Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "companyName": "Tech Corp",
  "email": "contact@techcorp.com",
  "contactPerson": "John Smith",
  "contactNumber": "+1234567890",
  "address": "123 Tech St, San Francisco",
  "plan": "Pro",
  "startDate": "2024-02-12",
  "expirationDate": "2025-02-12",
  "status": "active",
  "modules": ["API", "Analytics", "Reports"],
  "createdAt": "2024-02-12T10:30:00Z",
  "updatedAt": "2024-02-12T10:30:00Z"
}
```

---

### GET /clients/:id
Get specific client (Protected).

**Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "companyName": "Tech Corp",
  "email": "contact@techcorp.com",
  "contactPerson": "John Smith",
  "contactNumber": "+1234567890",
  "address": "123 Tech St",
  "plan": "Pro",
  "startDate": "2024-01-15",
  "expirationDate": "2025-01-15",
  "status": "active",
  "modules": ["API", "Analytics", "Reports"],
  "createdAt": "2024-02-12T10:30:00Z",
  "updatedAt": "2024-02-12T10:30:00Z"
}
```

---

### PUT /clients/:id
Update client (Protected).

**Request Body:**
```json
{
  "plan": "Enterprise",
  "expirationDate": "2025-12-15",
  "modules": ["API", "Analytics", "Reports", "WebHooks"]
}
```

**Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "companyName": "Tech Corp",
  "email": "contact@techcorp.com",
  "contactPerson": "John Smith",
  "contactNumber": "+1234567890",
  "address": "123 Tech St",
  "plan": "Enterprise",
  "startDate": "2024-01-15",
  "expirationDate": "2025-12-15",
  "status": "active",
  "modules": ["API", "Analytics", "Reports", "WebHooks"],
  "createdAt": "2024-02-12T10:30:00Z",
  "updatedAt": "2024-02-12T11:45:00Z"
}
```

---

### DELETE /clients/:id
Delete client (Protected).

**Response (200):**
```json
{
  "message": "Client deleted successfully"
}
```

---

### GET /clients/stats
Get client statistics (Protected).

**Response (200):**
```json
{
  "total": 50,
  "active": 45,
  "expiring": 5
}
```

---

## 🔑 Access Keys Endpoints

### POST /access-keys
Generate new access key (Protected).

**Request Body:**
```json
{
  "clientId": "550e8400-e29b-41d4-a716-446655440001",
  "expirationDate": "2025-06-12",
  "modules": ["API", "WebHooks"]
}
```

**Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440010",
  "key": "AK_ABC123DEF456GHI789_7VQM4X",
  "clientId": "550e8400-e29b-41d4-a716-446655440001",
  "modules": ["API", "WebHooks"],
  "expirationDate": "2025-06-12",
  "status": "active",
  "createdAt": "2024-02-12T10:30:00Z"
}
```

---

### GET /access-keys
Get all access keys (Protected).

**Query Parameters:**
- `page` (number): Page number, default 1
- `limit` (number): Items per page, default 10

**Response (200):**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440010",
      "key": "AK_ABC123DEF456GHI789_7VQM4X",
      "clientId": "550e8400-e29b-41d4-a716-446655440001",
      "client": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "companyName": "Tech Corp"
      },
      "modules": ["API", "WebHooks"],
      "expirationDate": "2025-06-12",
      "status": "active",
      "lastUsed": null,
      "createdAt": "2024-02-12T10:30:00Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "pages": 3
}
```

---

### GET /access-keys/client/:clientId
Get keys for specific client (Protected).

**Response (200):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "key": "AK_ABC123DEF456GHI789_7VQM4X",
    "clientId": "550e8400-e29b-41d4-a716-446655440001",
    "modules": ["API", "WebHooks"],
    "expirationDate": "2025-06-12",
    "status": "active",
    "lastUsed": "2024-02-12T15:45:00Z",
    "createdAt": "2024-02-12T10:30:00Z"
  }
]
```

---

### GET /access-keys/validate/:key
Validate access key (Public - no auth required!).

**Example:**
```
GET /access-keys/validate/AK_ABC123DEF456GHI789_7VQM4X
```

**Response (200) - Valid:**
```json
{
  "valid": true,
  "key": {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "key": "AK_ABC123DEF456GHI789_7VQM4X",
    "status": "active",
    "modules": ["API", "WebHooks"]
  },
  "client": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "companyName": "Tech Corp",
    "plan": "Pro"
  },
  "modules": ["API", "WebHooks"]
}
```

**Response (200) - Invalid:**
```json
{
  "valid": false,
  "message": "Invalid or inactive key"
}
```

---

### DELETE /access-keys/:id
Revoke access key (Protected).

**Response (200):**
```json
{
  "message": "Access key revoked successfully"
}
```

---

## 📊 Dashboard Endpoints

### GET /dashboard/stats
Get dashboard statistics (Protected).

**Response (200):**
```json
{
  "totalClients": 50,
  "activeClients": 45,
  "expiringClients": 5,
  "planDistribution": {
    "Basic": 15,
    "Pro": 25,
    "Enterprise": 10
  },
  "totalKeysGenerated": 125,
  "timestamp": "2024-02-12T10:30:00Z"
}
```

---

### GET /dashboard/summary
Get session summary (Protected).

**Response (200):**
```json
{
  "sessionData": {
    "totalClients": 50,
    "apiKeysGenerated": 125,
    "sessionDuration": "24 minutes",
    "lastAction": "Key Generation at 2:30:45 PM"
  },
  "securityInfo": {
    "status": "Secure",
    "message": "Your session has been securely terminated"
  },
  "stats": {
    "totalClients": 50,
    "activeClients": 45,
    "expiringClients": 5,
    "planDistribution": {
      "Basic": 15,
      "Pro": 25,
      "Enterprise": 10
    }
  }
}
```

---

### GET /dashboard/activity
Get recent activity (Protected).

**Response (200):**
```json
{
  "recentClients": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "companyName": "Tech Corp",
      "createdAt": "2024-02-12T10:30:00Z"
    }
  ],
  "timestamp": "2024-02-12T10:30:00Z"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["email must be an email"],
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden",
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Client not found",
  "error": "Not Found"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## Rate Limiting
Currently no rate limiting is implemented. Recommended for production:
- Install `@nestjs/throttler`
- Limit: 100 requests per 15 minutes

---

## Pagination Notes
- Default page: 1
- Default limit: 10
- Maximum limit: 100 (recommended)
- Return format includes total count and page information

---

## HTTP Methods
- `GET` - Retrieve data
- `POST` - Create data
- `PUT` - Update data
- `DELETE` - Delete data
- `PATCH` - Partial update

---

**Last Updated:** February 12, 2026  
**API Version:** 1.0.0
