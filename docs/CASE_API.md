# Case Management API Documentation

## Overview
This document describes the case management APIs for the Law Firm Management System. Only admins can create, update, and delete cases. All users can view cases they have access to.

## Base URL
```
http://localhost:5000/api/cases
```

## Case Model Structure
```javascript
{
  caseName: String (required),
  fileNumber: String (required, unique),
  client_id: ObjectId (required, ref: "Client"),
  lawyer_id: ObjectId (required, ref: "Lawyer"),
  description: String,
  status: String (enum: 'active', 'closed', 'pending', 'on-hold'),
  caseType: String,
  startDate: Date,
  endDate: Date,
  priority: String (enum: 'low', 'medium', 'high', 'urgent'),
  shedual_ids: [ObjectId] (ref: "Schedule"),
  payments: [ObjectId] (ref: "Payment"),
  createdBy: ObjectId (ref: "Admin"),
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### 1. Create Case (Admin Only)

```
POST /
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "caseName": "Property Dispute - Smith vs Jones",
  "fileNumber": "CASE-2025-001",
  "client_id": "client_object_id",
  "lawyer_id": "lawyer_object_id",
  "description": "Property boundary dispute between neighboring properties",
  "caseType": "Property Law",
  "priority": "medium",
  "startDate": "2025-08-26T00:00:00.000Z"
}
```

**Response:**
```json
{
  "message": "Case created successfully",
  "case": {
    "_id": "case_id",
    "caseName": "Property Dispute - Smith vs Jones",
    "fileNumber": "CASE-2025-001",
    "client_id": {
      "_id": "client_id",
      "name": "John Smith",
      "email": "john@example.com",
      "contactNo": "1234567890",
      "username": "johnsmith"
    },
    "lawyer_id": {
      "_id": "lawyer_id",
      "name": "Jane Doe",
      "email": "jane@lawfirm.com",
      "practiceArea": "Property Law",
      "contactNo": "0987654321"
    },
    "description": "Property boundary dispute between neighboring properties",
    "status": "active",
    "caseType": "Property Law",
    "priority": "medium",
    "startDate": "2025-08-26T00:00:00.000Z",
    "createdBy": {
      "_id": "admin_id",
      "username": "admin"
    },
    "createdAt": "2025-08-26T12:00:00.000Z",
    "updatedAt": "2025-08-26T12:00:00.000Z"
  }
}
```

### 2. Get All Cases (Authentication Required)

```
GET /?status=active&priority=high&page=1&limit=10
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): Filter by status (active, closed, pending, on-hold)
- `lawyer_id` (optional): Filter by lawyer ID
- `client_id` (optional): Filter by client ID
- `priority` (optional): Filter by priority (low, medium, high, urgent)
- `caseType` (optional): Filter by case type (partial match)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "cases": [...],
  "total": 50,
  "page": 1,
  "pages": 5
}
```

### 3. Get Case by ID (Authentication Required)

```
GET /:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "_id": "case_id",
  "caseName": "Property Dispute - Smith vs Jones",
  "fileNumber": "CASE-2025-001",
  "client_id": {
    "_id": "client_id",
    "name": "John Smith",
    "email": "john@example.com",
    "contactNo": "1234567890",
    "username": "johnsmith",
    "address": "123 Main St"
  },
  "lawyer_id": {
    "_id": "lawyer_id",
    "name": "Jane Doe",
    "email": "jane@lawfirm.com",
    "practiceArea": "Property Law",
    "contactNo": "0987654321",
    "address": "456 Legal Ave"
  },
  "description": "Property boundary dispute between neighboring properties",
  "status": "active",
  "caseType": "Property Law",
  "priority": "medium",
  "startDate": "2025-08-26T00:00:00.000Z",
  "endDate": null,
  "shedual_ids": [...],
  "payments": [...],
  "createdBy": {
    "_id": "admin_id",
    "username": "admin"
  },
  "createdAt": "2025-08-26T12:00:00.000Z",
  "updatedAt": "2025-08-26T12:00:00.000Z"
}
```

### 4. Update Case (Admin Only)

```
PUT /:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "caseName": "Updated Case Name",
  "description": "Updated description",
  "priority": "high",
  "caseType": "Updated Case Type",
  "endDate": "2025-12-31T00:00:00.000Z"
}
```

**Response:**
```json
{
  "message": "Case updated successfully",
  "case": {
    // Updated case object
  }
}
```

### 5. Update Case Status (Admin Only)

```
PUT /:id/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "closed"
}
```

**Response:**
```json
{
  "message": "Case status updated successfully",
  "case": {
    // Updated case object with new status
  }
}
```

### 6. Delete Case (Admin Only)

```
DELETE /:id
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "message": "Case deleted successfully"
}
```

### 7. Get Cases by Lawyer (Authentication Required)

```
GET /lawyer/:lawyerId?status=active
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Lawyer cases retrieved successfully",
  "count": 5,
  "cases": [...]
}
```

### 8. Get Cases by Client (Authentication Required)

```
GET /client/:clientId?status=active
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Client cases retrieved successfully",
  "count": 3,
  "cases": [...]
}
```

### 9. Get Case Statistics (Admin Only)

```
GET /statistics
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "message": "Case statistics retrieved successfully",
  "statistics": {
    "total": 100,
    "active": 45,
    "closed": 30,
    "pending": 15,
    "onHold": 10,
    "priorityBreakdown": [
      {
        "_id": "high",
        "count": 20
      },
      {
        "_id": "medium",
        "count": 50
      },
      {
        "_id": "low",
        "count": 25
      },
      {
        "_id": "urgent",
        "count": 5
      }
    ]
  }
}
```

## Required Fields for Case Creation

- `caseName`: Name/title of the case
- `fileNumber`: Unique file number for the case
- `client_id`: Valid client ID from the database
- `lawyer_id`: Valid lawyer ID from the database

## Status Options

- `active`: Case is currently being worked on
- `closed`: Case has been completed
- `pending`: Case is waiting to be started
- `on-hold`: Case is temporarily paused

## Priority Levels

- `low`: Low priority case
- `medium`: Medium priority (default)
- `high`: High priority case
- `urgent`: Urgent case requiring immediate attention

## Authentication Requirements

- **Admin Access**: Create case, update case, delete case, case statistics, status updates
- **User Access**: View cases, get case by ID, view cases by lawyer/client

## Error Responses

### 400 - Bad Request
```json
{
  "message": "Missing required fields: caseName, fileNumber, client_id, lawyer_id"
}
```

```json
{
  "message": "File number already exists. Please use a unique file number."
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
  "message": "Case not found"
}
```

### 500 - Server Error
```json
{
  "error": "Error message details"
}
```

## Frontend Integration Examples

### Admin: Create Case
```javascript
const createCase = async (caseData) => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/cases', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(caseData)
  });
  
  return await response.json();
};

// Example usage
const caseData = {
  caseName: "Contract Dispute - ABC Corp",
  fileNumber: "CASE-2025-002",
  client_id: "client_id_here",
  lawyer_id: "lawyer_id_here",
  description: "Contract breach dispute",
  caseType: "Contract Law",
  priority: "high"
};

createCase(caseData);
```

### Get Cases with Filters
```javascript
const getCases = async (filters = {}) => {
  const token = localStorage.getItem('token');
  const queryParams = new URLSearchParams(filters).toString();
  const response = await fetch(`/api/cases?${queryParams}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
};

// Example usage
getCases({ status: 'active', priority: 'high', page: 1, limit: 20 });
```

### Admin: Update Case Status
```javascript
const updateCaseStatus = async (caseId, status) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`/api/cases/${caseId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });
  
  return await response.json();
};
```

## Usage Notes

1. **Admin Workflow**: Only admins can create and manage cases
2. **File Number Uniqueness**: Each case must have a unique file number
3. **Client-Lawyer Assignment**: Cases must be assigned to both a client and lawyer
4. **Status Tracking**: Complete status management from creation to closure
5. **Audit Trail**: Tracks who created each case and when
6. **Filtering**: Multiple filter options for finding specific cases
7. **Statistics**: Admin dashboard can get comprehensive case statistics
