# Complete Backend Testing Guide

This guide provides step-by-step instructions for testing all backend API endpoints.

---

## Prerequisites

- Backend running on `http://localhost:3000`
- MySQL database created and running
- Environment variables configured in `.env`
- Dependencies installed with `npm install`

---

## Part 1: Quick Health Check

### Check Backend Status

```bash
# Simple health check
curl http://localhost:3000/health

# Expected response:
{
  "statusCode": 200,
  "message": "API is running",
  "timestamp": "2024-02-12T10:30:00Z"
}
```

---

## Part 2: Authentication Testing

### Test 1: Register New User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePassword123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Expected Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "admin@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "admin",
  "isActive": true,
  "createdAt": "2024-02-12T10:30:00Z",
  "updatedAt": "2024-02-12T10:30:00Z"
}
```

### Test 2: Login and Get Token

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePassword123"
  }'
```

**Expected Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "admin@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "admin",
    "isActive": true,
    "createdAt": "2024-02-12T10:30:00Z"
  }
}
```

**Save the token for testing protected endpoints:**
```bash
TOKEN="your_token_here"
```

### Test 3: Get User Profile (Protected)

```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "admin@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "admin",
  "isActive": true,
  "createdAt": "2024-02-12T10:30:00Z"
}
```

### Test 4: Logout (Protected)

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

## Part 3: Clients Management Testing

### Test 5: Create Client (Protected)

```bash
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "companyName": "Tech Solutions Ltd",
    "email": "contact@techsolutions.com",
    "contactPerson": "John Smith",
    "contactNumber": "+1234567890",
    "address": "123 Tech Street, San Francisco, CA",
    "plan": "Pro",
    "startDate": "2024-02-12",
    "expirationDate": "2025-02-12",
    "modules": ["API", "Analytics", "Reports"]
  }'
```

**Expected Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "companyName": "Tech Solutions Ltd",
  "email": "contact@techsolutions.com",
  "contactPerson": "John Smith",
  "contactNumber": "+1234567890",
  "address": "123 Tech Street, San Francisco, CA",
  "plan": "Pro",
  "startDate": "2024-02-12",
  "expirationDate": "2025-02-12",
  "status": "active",
  "modules": ["API", "Analytics", "Reports"],
  "createdAt": "2024-02-12T10:30:00Z",
  "updatedAt": "2024-02-12T10:30:00Z"
}
```

**Save client ID for later:**
```bash
CLIENT_ID="550e8400-e29b-41d4-a716-446655440001"
```

### Test 6: Get All Clients (Protected)

```bash
curl -X GET "http://localhost:3000/api/clients?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "companyName": "Tech Solutions Ltd",
      "email": "contact@techsolutions.com",
      "contactPerson": "John Smith",
      "contactNumber": "+1234567890",
      "address": "123 Tech Street, San Francisco, CA",
      "plan": "Pro",
      "startDate": "2024-02-12",
      "expirationDate": "2025-02-12",
      "status": "active",
      "modules": ["API", "Analytics", "Reports"],
      "createdAt": "2024-02-12T10:30:00Z",
      "updatedAt": "2024-02-12T10:30:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "pages": 1
}
```

### Test 7: Get Single Client (Protected)

```bash
curl -X GET http://localhost:3000/api/clients/$CLIENT_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "companyName": "Tech Solutions Ltd",
  "email": "contact@techsolutions.com",
  "contactPerson": "John Smith",
  "contactNumber": "+1234567890",
  "address": "123 Tech Street, San Francisco, CA",
  "plan": "Pro",
  "startDate": "2024-02-12",
  "expirationDate": "2025-02-12",
  "status": "active",
  "modules": ["API", "Analytics", "Reports"],
  "createdAt": "2024-02-12T10:30:00Z",
  "updatedAt": "2024-02-12T10:30:00Z"
}
```

### Test 8: Update Client (Protected)

```bash
curl -X PUT http://localhost:3000/api/clients/$CLIENT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "plan": "Enterprise",
    "expirationDate": "2026-02-12",
    "modules": ["API", "Analytics", "Reports", "WebHooks", "SSO"]
  }'
```

**Expected Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "companyName": "Tech Solutions Ltd",
  "email": "contact@techsolutions.com",
  "contactPerson": "John Smith",
  "contactNumber": "+1234567890",
  "address": "123 Tech Street, San Francisco, CA",
  "plan": "Enterprise",
  "startDate": "2024-02-12",
  "expirationDate": "2026-02-12",
  "status": "active",
  "modules": ["API", "Analytics", "Reports", "WebHooks", "SSO"],
  "createdAt": "2024-02-12T10:30:00Z",
  "updatedAt": "2024-02-12T12:00:00Z"
}
```

### Test 9: Get Client Statistics (Protected)

```bash
curl -X GET http://localhost:3000/api/clients/stats \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "total": 1,
  "active": 1,
  "expiring": 0,
  "planDistribution": {
    "Enterprise": 1
  }
}
```

---

## Part 4: Access Keys Testing

### Test 10: Generate Access Key (Protected)

```bash
curl -X POST http://localhost:3000/api/access-keys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "clientId": "'$CLIENT_ID'",
    "expirationDate": "2025-12-31",
    "modules": ["API", "Analytics"]
  }'
```

**Expected Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440010",
  "key": "AK_ABC123DEF456GHI789_7VQM4X",
  "clientId": "550e8400-e29b-41d4-a716-446655440001",
  "modules": ["API", "Analytics"],
  "expirationDate": "2025-12-31",
  "status": "active",
  "lastUsed": null,
  "createdAt": "2024-02-12T10:30:00Z",
  "updatedAt": "2024-02-12T10:30:00Z"
}
```

**Save the key for validation:**
```bash
API_KEY="AK_ABC123DEF456GHI789_7VQM4X"
```

### Test 11: Get All Access Keys (Protected)

```bash
curl -X GET "http://localhost:3000/api/access-keys?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440010",
      "key": "AK_ABC123DEF456GHI789_7VQM4X",
      "clientId": "550e8400-e29b-41d4-a716-446655440001",
      "client": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "companyName": "Tech Solutions Ltd"
      },
      "modules": ["API", "Analytics"],
      "expirationDate": "2025-12-31",
      "status": "active",
      "lastUsed": null,
      "createdAt": "2024-02-12T10:30:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "pages": 1
}
```

### Test 12: Get Keys for Specific Client (Protected)

```bash
curl -X GET http://localhost:3000/api/access-keys/client/$CLIENT_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "key": "AK_ABC123DEF456GHI789_7VQM4X",
    "clientId": "550e8400-e29b-41d4-a716-446655440001",
    "modules": ["API", "Analytics"],
    "expirationDate": "2025-12-31",
    "status": "active",
    "lastUsed": null,
    "createdAt": "2024-02-12T10:30:00Z"
  }
]
```

### Test 13: Validate Access Key (Public - No Auth Required!)

```bash
# This endpoint is public, no token needed
curl -X GET http://localhost:3000/api/access-keys/validate/$API_KEY
```

**Expected Response (200) - Valid Key:**
```json
{
  "valid": true,
  "key": {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "key": "AK_ABC123DEF456GHI789_7VQM4X",
    "status": "active",
    "modules": ["API", "Analytics"]
  },
  "client": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "companyName": "Tech Solutions Ltd",
    "plan": "Enterprise"
  },
  "modules": ["API", "Analytics"]
}
```

### Test 14: Revoke Access Key (Protected)

```bash
curl -X DELETE http://localhost:3000/api/access-keys/550e8400-e29b-41d4-a716-446655440010 \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "message": "Access key revoked successfully"
}
```

### Test 15: Validate Revoked Key (Public)

After revoking, test validation again:

```bash
curl -X GET http://localhost:3000/api/access-keys/validate/$API_KEY
```

**Expected Response (200) - Invalid Key:**
```json
{
  "valid": false,
  "message": "Invalid or inactive key"
}
```

---

## Part 5: Dashboard Testing

### Test 16: Get Dashboard Statistics (Protected)

```bash
curl -X GET http://localhost:3000/api/dashboard/stats \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "totalClients": 1,
  "activeClients": 1,
  "expiringClients": 0,
  "planDistribution": {
    "Enterprise": 1
  },
  "totalKeysGenerated": 0,
  "timestamp": "2024-02-12T10:30:00Z"
}
```

### Test 17: Get Dashboard Summary (Protected)

```bash
curl -X GET http://localhost:3000/api/dashboard/summary \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "sessionData": {
    "totalClients": 1,
    "apiKeysGenerated": 0,
    "sessionDuration": "15 minutes",
    "lastAction": "Client update at 12:00:00 PM"
  },
  "securityInfo": {
    "status": "Secure",
    "message": "Your session is secure"
  },
  "stats": {
    "totalClients": 1,
    "activeClients": 1,
    "expiringClients": 0,
    "planDistribution": {
      "Enterprise": 1
    }
  }
}
```

### Test 18: Get Recent Activity (Protected)

```bash
curl -X GET http://localhost:3000/api/dashboard/activity \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "recentClients": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "companyName": "Tech Solutions Ltd",
      "createdAt": "2024-02-12T10:30:00Z"
    }
  ],
  "timestamp": "2024-02-12T10:30:00Z"
}
```

---

## Part 6: Error Scenarios Testing

### Test 19: Invalid Credentials

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@example.com",
    "password": "wrongpassword"
  }'
```

**Expected Response (401):**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

### Test 20: Missing Authorization Header

```bash
# No Authorization header
curl -X GET http://localhost:3000/api/clients
```

**Expected Response (401):**
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### Test 21: Invalid Token

```bash
curl -X GET http://localhost:3000/api/clients \
  -H "Authorization: Bearer invalid_token_123"
```

**Expected Response (401):**
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### Test 22: Not Found Error

```bash
curl -X GET http://localhost:3000/api/clients/nonexistent-id \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (404):**
```json
{
  "statusCode": 404,
  "message": "Client not found",
  "error": "Not Found"
}
```

### Test 23: Invalid Input Data

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "not_an_email",
    "password": "short",
    "firstName": "",
    "lastName": ""
  }'
```

**Expected Response (400):**
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password should not be empty",
    "firstName should not be empty",
    "lastName should not be empty"
  ],
  "error": "Bad Request"
}
```

---

## Testing Checklist

- [ ] Health check endpoint responds with 200
- [ ] User can register successfully
- [ ] User can login and receives valid token
- [ ] User can get their profile with token
- [ ] User can create a client
- [ ] User can list all clients
- [ ] User can get single client details
- [ ] User can update client information
- [ ] User can generate access keys
- [ ] User can validate access keys
- [ ] User can revoke access keys
- [ ] User can view dashboard statistics
- [ ] Invalid credentials return 401
- [ ] Missing authorization returns 401
- [ ] Invalid token returns 401
- [ ] Not found errors return 404
- [ ] Validation errors return 400
- [ ] All responses have proper structure

---

## Automation Script

Create a bash script to run all tests:

**File: `test-all.sh`**

```bash
#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

API_URL="http://localhost:3000/api"
PASS=0
FAIL=0

test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    local token=$5
    
    echo "Testing: $name"
    
    if [ -z "$token" ]; then
        response=$(curl -s -X $method "$API_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    else
        response=$(curl -s -X $method "$API_URL$endpoint" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $token" \
            -d "$data")
    fi
    
    if echo "$response" | grep -q "error\|Error\|401\|404"; then
        echo -e "${RED}✗ Failed${NC}"
        echo "Response: $response"
        ((FAIL++))
    else
        echo -e "${GREEN}✓ Passed${NC}"
        ((PASS++))
    fi
    echo ""
}

echo "Starting API tests..."
echo ""

# Run tests
test_endpoint "Health Check" "GET" "/health" ""
test_endpoint "Register User" "POST" "/auth/register" '{"email":"test@example.com","password":"Test123","firstName":"Test","lastName":"User"}'

# ... add more tests

echo "========================================="
echo "Tests Passed: $PASS"
echo "Tests Failed: $FAIL"
echo "========================================="
```

---

## Performance Testing

To test API response times:

```bash
# Time a single request
time curl -X GET http://localhost:3000/api/dashboard/stats \
  -H "Authorization: Bearer $TOKEN"

# Load testing with Apache Bench (if installed)
ab -n 100 -c 10 -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/dashboard/stats
```

---

**Last Updated:** February 12, 2026  
**API Version:** 1.0.0
