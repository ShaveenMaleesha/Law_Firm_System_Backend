# Client Management API Documentation

## Overview
This document describes the client management APIs for the Law Firm Management System. Admin users have full access to client management, while authenticated users can access client selection lists for case/appointment management.

## Base URL
```
http://localhost:5000/api/clients
```

## Client Model Structure
```javascript
{
  name: String (required),
  username: String (required, unique),
  password: String (required, hashed),
  email: String (required, unique),
  contactNo: String (required),
  address: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### 1. Admin: Create Client

```
POST /
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "John Smith",
  "username": "johnsmith",
  "password": "securepassword123",
  "email": "john.smith@example.com",
  "contactNo": "+1-555-0123",
  "address": "123 Main Street, City, State 12345"
}
```

**Response:**
```json
{
  "message": "Client created successfully",
  "client": {
    "_id": "client_id",
    "name": "John Smith",
    "username": "johnsmith",
    "email": "john.smith@example.com",
    "contactNo": "+1-555-0123",
    "address": "123 Main Street, City, State 12345",
    "createdAt": "2025-08-26T12:00:00.000Z"
  }
}
```

### 2. Admin: Get All Clients

```
GET /?name=John&email=smith&page=1&limit=10
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `name` (optional): Filter by name (partial match)
- `email` (optional): Filter by email (partial match)
- `username` (optional): Filter by username (partial match)
- `contactNo` (optional): Filter by contact number (partial match)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "message": "Clients retrieved successfully",
  "clients": [
    {
      "_id": "client_id",
      "name": "John Smith",
      "username": "johnsmith",
      "email": "john.smith@example.com",
      "contactNo": "+1-555-0123",
      "address": "123 Main Street, City, State 12345",
      "createdAt": "2025-08-26T12:00:00.000Z"
    }
  ],
  "total": 50,
  "page": 1,
  "pages": 5
}
```

### 3. Admin: Get Client by ID

```
GET /:id
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "_id": "client_id",
  "name": "John Smith",
  "username": "johnsmith",
  "email": "john.smith@example.com",
  "contactNo": "+1-555-0123",
  "address": "123 Main Street, City, State 12345",
  "createdAt": "2025-08-26T12:00:00.000Z",
  "updatedAt": "2025-08-26T12:00:00.000Z"
}
```

### 4. Admin: Get Client with Statistics

```
GET /:id/stats
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "message": "Client details with statistics retrieved successfully",
  "client": {
    "_id": "client_id",
    "name": "John Smith",
    "username": "johnsmith",
    "email": "john.smith@example.com",
    "contactNo": "+1-555-0123",
    "address": "123 Main Street, City, State 12345",
    "cases": [
      {
        "_id": "case_id",
        "caseName": "Property Dispute",
        "fileNumber": "PROP-2025-001",
        "status": "active",
        "startDate": "2025-08-20T00:00:00.000Z",
        "lawyer_id": {
          "name": "Jane Doe",
          "practiceArea": "Property Law"
        }
      }
    ],
    "appointments": [
      {
        "_id": "appointment_id",
        "subject": "Initial Consultation",
        "date": "2025-08-30T00:00:00.000Z",
        "status": "approved",
        "createdAt": "2025-08-26T10:00:00.000Z",
        "lawyer_id": {
          "name": "Jane Doe",
          "practiceArea": "Property Law"
        }
      }
    ],
    "statistics": {
      "totalCases": 3,
      "activeCases": 2,
      "closedCases": 1,
      "totalAppointments": 5,
      "pendingAppointments": 1,
      "approvedAppointments": 4
    }
  }
}
```

### 5. Get Clients for Selection (Authentication Required)

```
GET /selection
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Clients for selection retrieved successfully",
  "count": 25,
  "clients": [
    {
      "_id": "client_id",
      "name": "John Smith",
      "email": "john.smith@example.com",
      "username": "johnsmith",
      "contactNo": "+1-555-0123"
    },
    {
      "_id": "client_id_2",
      "name": "Jane Johnson",
      "email": "jane.johnson@example.com",
      "username": "janejohnson",
      "contactNo": "+1-555-0124"
    }
  ]
}
```

### 6. Admin: Search Clients

```
GET /search?q=john
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `q` (required): Search term (minimum 2 characters)

**Response:**
```json
{
  "message": "Client search completed successfully",
  "count": 3,
  "clients": [
    {
      "_id": "client_id",
      "name": "John Smith",
      "username": "johnsmith",
      "email": "john.smith@example.com",
      "contactNo": "+1-555-0123",
      "address": "123 Main Street, City, State 12345"
    }
  ]
}
```

### 7. Admin: Update Client

```
PUT /:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "John Smith Jr.",
  "contactNo": "+1-555-0999",
  "address": "456 New Street, City, State 12345"
}
```

**Response:**
```json
{
  "message": "Client updated successfully",
  "client": {
    "_id": "client_id",
    "name": "John Smith Jr.",
    "username": "johnsmith",
    "email": "john.smith@example.com",
    "contactNo": "+1-555-0999",
    "address": "456 New Street, City, State 12345",
    // ... other fields
  }
}
```

### 8. Admin: Delete Client

```
DELETE /:id
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "message": "Client deleted successfully"
}
```

### 9. Admin: Get Client Statistics

```
GET /statistics
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "message": "Client statistics retrieved successfully",
  "statistics": {
    "total": 150,
    "recentClients": 25,
    "monthlyRegistrations": [
      {
        "_id": {
          "year": 2025,
          "month": 8
        },
        "count": 12
      },
      {
        "_id": {
          "year": 2025,
          "month": 7
        },
        "count": 8
      }
    ]
  }
}
```

## Authentication Requirements

- **Admin Access**: Create, read, update, delete clients; get statistics; search clients
- **User Access**: Get clients for selection (for case/appointment management)

## Required Fields for Client Creation

- `name`: Full name of the client
- `username`: Unique username for login
- `password`: Secure password (will be hashed)
- `email`: Unique email address
- `contactNo`: Contact phone number
- `address`: Physical address

## Error Responses

### 400 - Bad Request
```json
{
  "message": "Missing required fields: name, username, password, email, contactNo, address"
}
```

```json
{
  "message": "Email already exists. Please use a different email address."
}
```

```json
{
  "message": "Username already exists. Please use a different username."
}
```

```json
{
  "message": "Search term must be at least 2 characters long"
}
```

### 401 - Unauthorized
```json
{
  "message": "No token, authorization denied"
}
```

### 403 - Forbidden
```json
{
  "message": "Access denied. Admin role required."
}
```

### 404 - Not Found
```json
{
  "message": "Client not found"
}
```

### 500 - Server Error
```json
{
  "error": "Error message details"
}
```

## Frontend Integration Examples

### Admin: Create Client
```javascript
const createClient = async (clientData) => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/clients', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(clientData)
  });
  
  return await response.json();
};

// Example usage
const clientData = {
  name: "John Smith",
  username: "johnsmith",
  password: "securepassword123",
  email: "john.smith@example.com",
  contactNo: "+1-555-0123",
  address: "123 Main Street, City, State 12345"
};

createClient(clientData);
```

### Admin: Get All Clients with Filters
```javascript
const getAllClients = async (filters = {}) => {
  const token = localStorage.getItem('token');
  const queryParams = new URLSearchParams(filters).toString();
  const response = await fetch(`/api/clients?${queryParams}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
};

// Example usage
getAllClients({ 
  name: 'john', 
  page: 1, 
  limit: 20 
});
```

### Get Clients for Selection (for case creation)
```javascript
const getClientsForSelection = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/clients/selection', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
};

// Use in case creation form
getClientsForSelection().then(data => {
  // Populate client dropdown
  const clientSelect = document.getElementById('client-select');
  data.clients.forEach(client => {
    const option = document.createElement('option');
    option.value = client._id;
    option.textContent = `${client.name} (${client.email})`;
    clientSelect.appendChild(option);
  });
});
```

### Admin: Search Clients
```javascript
const searchClients = async (searchTerm) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`/api/clients/search?q=${encodeURIComponent(searchTerm)}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
};

// Example usage for search functionality
const handleSearch = (event) => {
  const searchTerm = event.target.value;
  if (searchTerm.length >= 2) {
    searchClients(searchTerm).then(data => {
      // Display search results
      displaySearchResults(data.clients);
    });
  }
};
```

### Admin: Get Client with Statistics
```javascript
const getClientWithStats = async (clientId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`/api/clients/${clientId}/stats`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
};

// Use for client profile page
getClientWithStats('client_id').then(data => {
  // Display client info and statistics
  console.log('Total Cases:', data.client.statistics.totalCases);
  console.log('Active Cases:', data.client.statistics.activeCases);
  console.log('Appointments:', data.client.statistics.totalAppointments);
});
```

## Usage Notes

1. **Admin Dashboard**: Full client management capabilities
2. **Unique Constraints**: Email and username must be unique
3. **Password Security**: All passwords are automatically hashed
4. **Client Selection**: Available for authenticated users for case/appointment creation
5. **Statistics**: Comprehensive client activity tracking
6. **Search Functionality**: Multi-field search across name, email, username, and contact
7. **Filtering**: Multiple filter options for finding specific clients
8. **Pagination**: Large client lists are paginated for performance

## Integration with Other Systems

- **Case Management**: Clients are assigned to cases
- **Appointment System**: Clients create appointments and are linked to cases
- **Authentication**: Clients can login using username/email and password
- **Statistics Tracking**: Complete activity monitoring for admin dashboard

## Security Features

- **Password Hashing**: All passwords stored securely with bcrypt
- **Role-based Access**: Admin-only access for sensitive operations
- **Data Validation**: Email and username uniqueness validation
- **Secure Responses**: Passwords never included in API responses
