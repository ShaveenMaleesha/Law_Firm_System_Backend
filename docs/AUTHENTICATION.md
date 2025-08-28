# Authentication API Documentation

## Overview
This document describes the authentication APIs for the Law Firm Management System. The system supports three types of users: Admin, Client, and Lawyer.

## Base URL
```
http://localhost:5000/api/auth
```

## Authentication Flow
1. Users register or login to receive a JWT token
2. Include the token in the Authorization header for protected routes: `Bearer <token>`
3. Token expires after 24 hours

## API Endpoints

### Admin Authentication

#### Register Admin
```
POST /admin/register
Content-Type: application/json

{
  "username": "admin123",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "Admin registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "admin_id",
    "username": "admin123",
    "role": "admin"
  }
}
```

#### Login Admin
```
POST /admin/login
Content-Type: application/json

{
  "username": "admin123",
  "password": "securepassword"
}
```

### Client Authentication

#### Register Client
```
POST /client/register
Content-Type: application/json

{
  "name": "John Doe",
  "username": "johndoe",
  "password": "securepassword",
  "email": "john@example.com",
  "contactNo": "1234567890",
  "address": "123 Main St, City"
}
```

#### Login Client
```
POST /client/login
Content-Type: application/json

{
  "username": "johndoe", // Can also use email
  "password": "securepassword"
}
```

### Lawyer Authentication

#### Register Lawyer
```
POST /lawyer/register
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@lawfirm.com",
  "password": "securepassword",
  "practiceArea": ["Criminal Law", "Corporate Law"],
  "address": "456 Legal Ave, City",
  "contactNo": "0987654321"
}
```

#### Login Lawyer
```
POST /lawyer/login
Content-Type: application/json

{
  "email": "jane@lawfirm.com",
  "password": "securepassword"
}
```

### Protected Routes

#### Get User Profile
```
GET /profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "name": "User Name",
    "role": "client|lawyer|admin",
    // ... other user fields
  }
}
```

#### Change Password
```
PUT /change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

## Error Responses

### 400 - Bad Request
```json
{
  "message": "User already exists"
}
```

### 401 - Unauthorized
```json
{
  "message": "Invalid credentials"
}
```

### 403 - Forbidden
```json
{
  "message": "Access denied. Admin role required."
}
```

### 500 - Server Error
```json
{
  "error": "Error message details"
}
```

## Security Features

1. **Password Hashing**: All passwords are hashed using bcryptjs with salt rounds of 10
2. **JWT Tokens**: Secure token-based authentication with 24-hour expiration
3. **Role-based Access Control**: Different access levels for admin, lawyer, and client
4. **Input Validation**: Duplicate checking for usernames and emails
5. **Protected Routes**: Middleware to verify authentication and authorization

## Usage Examples

### Frontend Implementation (JavaScript)

```javascript
// Register a client
const registerClient = async (userData) => {
  const response = await fetch('/api/auth/client/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData)
  });
  
  const data = await response.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
};

// Login
const login = async (credentials, userType) => {
  const response = await fetch(`/api/auth/${userType}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials)
  });
  
  const data = await response.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
};

// Make authenticated requests
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};
```

## Environment Variables

Make sure to set the following environment variables in your `.env` file:

```
JWT_SECRET=your_super_secure_jwt_secret_key_here_please_change_in_production
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

## Testing the APIs

You can test these APIs using tools like Postman, Insomnia, or curl. Make sure to:

1. Start the server: `npm run dev`
2. The server will run on `http://localhost:5000`
3. Use the endpoints as documented above
4. Include the Authorization header for protected routes

## Notes

- All passwords are automatically hashed when creating or updating users
- JWT tokens contain user ID and role information
- The system prevents duplicate registrations based on unique fields
- Password changes require the current password for security
