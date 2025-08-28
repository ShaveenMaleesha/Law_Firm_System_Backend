# Lawyer Profile Management API

## Overview
This API allows lawyers to manage their own profile details. Only authenticated lawyers can access and modify their own profile information.

## Authentication
All endpoints require:
- JWT token in Authorization header: `Bearer <token>`
- User role must be 'lawyer'

## Endpoints

### Get Lawyer's Own Details
**GET** `/api/lawyers/me`

**Description:** Retrieves the current lawyer's profile details

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "message": "Lawyer details retrieved successfully",
  "lawyer": {
    "_id": "lawyer_id",
    "name": "John Doe",
    "email": "john.doe@lawfirm.com",
    "practiceArea": ["Criminal Law", "Corporate Law"],
    "address": "123 Law Street",
    "contactNo": "+1234567890",
    "blogIds": [...],
    "caseIds": [...],
    "statistics": {
      "totalCases": 15,
      "successfulCases": 8,
      "activeCases": 5,
      "pendingCases": 1,
      "onHoldCases": 1,
      "totalClients": 12,
      "totalBlogs": 5,
      "approvedBlogs": 4
    }
  }
}
```

### Update Lawyer's Own Details
**PUT** `/api/lawyers/me`

**Description:** Updates the current lawyer's profile details

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "practiceArea": ["Corporate Law", "Family Law"],
  "address": "456 New Street",
  "contactNo": "+9876543210"
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "lawyer": {
    "_id": "lawyer_id",
    "name": "John Doe Updated",
    "email": "john.doe@lawfirm.com",
    "practiceArea": ["Corporate Law", "Family Law"],
    "address": "456 New Street",
    "contactNo": "+9876543210",
    "blogIds": [...],
    "caseIds": [...],
    "statistics": {
      "totalCases": 15,
      "successfulCases": 8,
      "activeCases": 5,
      "pendingCases": 1,
      "onHoldCases": 1,
      "totalClients": 12,
      "totalBlogs": 5,
      "approvedBlogs": 4
    }
  }
}
```

## Security Notes

1. **Restricted Fields:** The following fields cannot be updated by lawyers themselves:
   - `password` (use separate password change endpoint)
   - `role`
   - `_id`
   - `blogIds`
   - `caseIds`

2. **Email Validation:** If email is being updated, the system checks for uniqueness

3. **Authentication:** Lawyer ID is extracted from JWT token (`req.user.userId`)

## Error Responses

**401 Unauthorized:**
```json
{
  "message": "No token, authorization denied"
}
```

**403 Forbidden:**
```json
{
  "message": "Access denied. Lawyer role required."
}
```

**404 Not Found:**
```json
{
  "message": "Lawyer profile not found"
}
```

**400 Bad Request (Email exists):**
```json
{
  "message": "Email already exists. Please use a different email address."
}
```

**400 Bad Request (Invalid practiceArea):**
```json
{
  "message": "practiceArea must be a non-empty array of strings"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Error message"
}
```
