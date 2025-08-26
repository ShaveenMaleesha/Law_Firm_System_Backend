# Lawyer Management API Documentation

## Overview
This document describes the lawyer management APIs for the Law Firm Management System. Admin users have full access to lawyer management, while some endpoints are publicly available for lawyer selection.

## Base URL
```
http://localhost:5000/api/lawyers
```

## Lawyer Model Structure
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  practiceArea: String (required),
  address: String (required),
  contactNo: String (required),
  blogIds: [ObjectId] (ref: "Blog"),
  caseIds: [ObjectId] (ref: "Case"),
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### 1. Admin: Create Lawyer

```
POST /
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane.smith@lawfirm.com",
  "password": "securepassword123",
  "practiceArea": "Corporate Law",
  "address": "123 Legal Street, Law City, LC 12345",
  "contactNo": "+1-555-0123"
}
```

**Response:**
```json
{
  "message": "Lawyer created successfully",
  "lawyer": {
    "_id": "lawyer_id",
    "name": "Jane Smith",
    "email": "jane.smith@lawfirm.com",
    "practiceArea": "Corporate Law",
    "address": "123 Legal Street, Law City, LC 12345",
    "contactNo": "+1-555-0123",
    "blogIds": [],
    "caseIds": [],
    "createdAt": "2025-08-26T12:00:00.000Z"
  }
}
```

### 2. Admin: Get All Lawyers

```
GET /?practiceArea=Corporate&page=1&limit=10
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `practiceArea` (optional): Filter by practice area (partial match)
- `email` (optional): Filter by email (partial match)
- `name` (optional): Filter by name (partial match)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "message": "Lawyers retrieved successfully",
  "lawyers": [
    {
      "_id": "lawyer_id",
      "name": "Jane Smith",
      "email": "jane.smith@lawfirm.com",
      "practiceArea": "Corporate Law",
      "address": "123 Legal Street, Law City, LC 12345",
      "contactNo": "+1-555-0123",
      "blogIds": [
        {
          "_id": "blog_id",
          "topic": "Corporate Compliance",
          "approved": true,
          "timestamp": "2025-08-25T10:00:00.000Z"
        }
      ],
      "caseIds": [
        {
          "_id": "case_id",
          "caseName": "ABC Corp Merger",
          "fileNumber": "CORP-2025-001",
          "status": "active"
        }
      ]
    }
  ],
  "total": 25,
  "page": 1,
  "pages": 3
}
```

### 3. Admin: Get Lawyer by ID

```
GET /:id
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "_id": "lawyer_id",
  "name": "Jane Smith",
  "email": "jane.smith@lawfirm.com",
  "practiceArea": "Corporate Law",
  "address": "123 Legal Street, Law City, LC 12345",
  "contactNo": "+1-555-0123",
  "blogIds": [
    {
      "_id": "blog_id",
      "topic": "Corporate Compliance",
      "content": "Blog content here...",
      "approved": true,
      "timestamp": "2025-08-25T10:00:00.000Z"
    }
  ],
  "caseIds": [
    {
      "_id": "case_id",
      "caseName": "ABC Corp Merger",
      "fileNumber": "CORP-2025-001",
      "status": "active",
      "client_id": "client_id"
    }
  ]
}
```

### 4. Admin: Get Lawyer with Statistics

```
GET /:id/stats
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "message": "Lawyer details with statistics retrieved successfully",
  "lawyer": {
    "_id": "lawyer_id",
    "name": "Jane Smith",
    "email": "jane.smith@lawfirm.com",
    "practiceArea": "Corporate Law",
    "address": "123 Legal Street, Law City, LC 12345",
    "contactNo": "+1-555-0123",
    "blogIds": [...],
    "caseIds": [...],
    "statistics": {
      "totalCases": 15,
      "activeCases": 8,
      "closedCases": 7,
      "totalBlogs": 5,
      "approvedBlogs": 4
    }
  }
}
```

### 5. Public: Get Lawyers for Selection

```
GET /selection
```

**Response:**
```json
{
  "message": "Lawyers for selection retrieved successfully",
  "count": 10,
  "lawyers": [
    {
      "_id": "lawyer_id",
      "name": "Jane Smith",
      "email": "jane.smith@lawfirm.com",
      "practiceArea": "Corporate Law"
    },
    {
      "_id": "lawyer_id_2",
      "name": "John Doe",
      "email": "john.doe@lawfirm.com",
      "practiceArea": "Criminal Law"
    }
  ]
}
```

### 6. Public: Get Lawyers by Practice Area

```
GET /practice-area/:practiceArea
```

**Example:**
```
GET /practice-area/Corporate%20Law
```

**Response:**
```json
{
  "message": "Lawyers in Corporate Law retrieved successfully",
  "count": 3,
  "lawyers": [
    {
      "_id": "lawyer_id",
      "name": "Jane Smith",
      "email": "jane.smith@lawfirm.com",
      "practiceArea": "Corporate Law",
      "address": "123 Legal Street, Law City, LC 12345",
      "contactNo": "+1-555-0123",
      "blogIds": [...],
      "caseIds": [...]
    }
  ]
}
```

### 7. Admin: Update Lawyer

```
PUT /:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Jane Smith-Johnson",
  "practiceArea": "Corporate & Tax Law",
  "contactNo": "+1-555-0124",
  "address": "456 New Legal Ave, Law City, LC 12346"
}
```

**Response:**
```json
{
  "message": "Lawyer updated successfully",
  "lawyer": {
    "_id": "lawyer_id",
    "name": "Jane Smith-Johnson",
    "email": "jane.smith@lawfirm.com",
    "practiceArea": "Corporate & Tax Law",
    "address": "456 New Legal Ave, Law City, LC 12346",
    "contactNo": "+1-555-0124",
    // ... other fields
  }
}
```

### 8. Admin: Delete Lawyer

```
DELETE /:id
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "message": "Lawyer deleted successfully"
}
```

### 9. Admin: Get Lawyer Statistics

```
GET /statistics
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "message": "Lawyer statistics retrieved successfully",
  "statistics": {
    "total": 25,
    "practiceAreaDistribution": [
      {
        "_id": "Corporate Law",
        "count": 8
      },
      {
        "_id": "Criminal Law",
        "count": 6
      },
      {
        "_id": "Family Law",
        "count": 5
      },
      {
        "_id": "Personal Injury",
        "count": 4
      },
      {
        "_id": "Real Estate Law",
        "count": 2
      }
    ]
  }
}
```

## Authentication Requirements

- **Admin Access**: Create, read, update, delete lawyers; get statistics
- **Public Access**: Get lawyers for selection, get lawyers by practice area

## Required Fields for Lawyer Creation

- `name`: Full name of the lawyer
- `email`: Unique email address
- `password`: Secure password (will be hashed)
- `practiceArea`: Area of legal specialization
- `address`: Physical address
- `contactNo`: Contact phone number

## Error Responses

### 400 - Bad Request
```json
{
  "message": "Missing required fields: name, email, password, practiceArea, address, contactNo"
}
```

```json
{
  "message": "Email already exists. Please use a different email address."
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
  "message": "Lawyer not found"
}
```

### 500 - Server Error
```json
{
  "error": "Error message details"
}
```

## Frontend Integration Examples

### Admin: Create Lawyer
```javascript
const createLawyer = async (lawyerData) => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/lawyers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(lawyerData)
  });
  
  return await response.json();
};

// Example usage
const lawyerData = {
  name: "Jane Smith",
  email: "jane.smith@lawfirm.com",
  password: "securepassword123",
  practiceArea: "Corporate Law",
  address: "123 Legal Street, Law City, LC 12345",
  contactNo: "+1-555-0123"
};

createLawyer(lawyerData);
```

### Admin: Get All Lawyers with Filters
```javascript
const getAllLawyers = async (filters = {}) => {
  const token = localStorage.getItem('token');
  const queryParams = new URLSearchParams(filters).toString();
  const response = await fetch(`/api/lawyers?${queryParams}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
};

// Example usage
getAllLawyers({ 
  practiceArea: 'Corporate', 
  page: 1, 
  limit: 20 
});
```

### Public: Get Lawyers for Selection (for case assignment)
```javascript
const getLawyersForSelection = async () => {
  const response = await fetch('/api/lawyers/selection');
  return await response.json();
};

// Use in case creation form
getLawyersForSelection().then(data => {
  // Populate lawyer dropdown
  const lawyerSelect = document.getElementById('lawyer-select');
  data.lawyers.forEach(lawyer => {
    const option = document.createElement('option');
    option.value = lawyer._id;
    option.textContent = `${lawyer.name} - ${lawyer.practiceArea}`;
    lawyerSelect.appendChild(option);
  });
});
```

### Admin: Get Lawyer with Statistics
```javascript
const getLawyerWithStats = async (lawyerId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`/api/lawyers/${lawyerId}/stats`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
};

// Use for lawyer profile page
getLawyerWithStats('lawyer_id').then(data => {
  // Display lawyer info and statistics
  console.log('Cases:', data.lawyer.statistics.totalCases);
  console.log('Active Cases:', data.lawyer.statistics.activeCases);
  console.log('Blogs:', data.lawyer.statistics.totalBlogs);
});
```

## Usage Notes

1. **Admin Dashboard**: Full lawyer management capabilities
2. **Email Uniqueness**: System prevents duplicate email addresses
3. **Password Security**: All passwords are automatically hashed
4. **Public Endpoints**: Lawyer selection available for case/appointment creation
5. **Statistics**: Comprehensive lawyer performance tracking
6. **Filtering**: Multiple filter options for finding specific lawyers
7. **Pagination**: Large lawyer lists are paginated for performance
8. **Practice Area Search**: Easy filtering by legal specialization

## Integration with Other Systems

- **Case Management**: Lawyers are assigned to cases
- **Appointment System**: Clients can select lawyers for appointments
- **Blog System**: Lawyers can create blogs (linked via blogIds)
- **Authentication**: Lawyers can login and access their dashboard
