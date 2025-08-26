# Appointment API Documentation

## Overview
This document describes the appointment management APIs for the Law Firm Management System. The system allows both authenticated and unauthenticated users to create appointments, while admins can manage and assign lawyers to appointments.

## Base URL
```
http://localhost:5000/api/appointments
```

## Appointment Model Structure
```javascript
{
  clientName: String (required),
  clientEmail: String (required), 
  clientPhone: String (required),
  client_id: ObjectId (optional - for authenticated users),
  lawyer_id: ObjectId (optional - assigned by admin),
  subject: String (required),
  description: String (required),
  date: Date (required),
  time: String (required),
  status: String (enum: 'pending', 'approved', 'rejected', 'completed'),
  assignedBy: ObjectId (admin who assigned lawyer),
  adminNotes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### 1. Create Appointment (Public - No Authentication Required)

```
POST /
Content-Type: application/json

{
  "clientName": "John Doe",
  "clientEmail": "john@example.com",
  "clientPhone": "1234567890",
  "client_id": "optional_client_id_if_authenticated",
  "subject": "Legal Consultation",
  "description": "Need consultation regarding property dispute",
  "date": "2025-09-01T00:00:00.000Z",
  "time": "10:00 AM"
}
```

**Response:**
```json
{
  "message": "Appointment request created successfully",
  "appointment": {
    "_id": "appointment_id",
    "clientName": "John Doe",
    "clientEmail": "john@example.com",
    "clientPhone": "1234567890",
    "subject": "Legal Consultation",
    "description": "Need consultation regarding property dispute",
    "date": "2025-09-01T00:00:00.000Z",
    "time": "10:00 AM",
    "status": "pending",
    "createdAt": "2025-08-26T12:00:00.000Z"
  }
}
```

### 2. Get All Appointments (Authentication Required)

```
GET /?status=pending&page=1&limit=10
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): Filter by status (pending, approved, rejected, completed)
- `lawyer_id` (optional): Filter by lawyer ID
- `client_id` (optional): Filter by client ID
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "appointments": [...],
  "total": 25,
  "page": 1,
  "pages": 3
}
```

### 3. Get Pending Appointments (Admin Only)

```
GET /pending
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "message": "Pending appointments retrieved successfully",
  "count": 5,
  "appointments": [...]
}
```

### 4. Get Appointment by ID

```
GET /:id
```

**Response:**
```json
{
  "_id": "appointment_id",
  "clientName": "John Doe",
  "clientEmail": "john@example.com",
  "clientPhone": "1234567890",
  "subject": "Legal Consultation",
  "description": "Need consultation regarding property dispute",
  "date": "2025-09-01T00:00:00.000Z",
  "time": "10:00 AM",
  "status": "pending",
  "client_id": {...},
  "lawyer_id": {...},
  "assignedBy": {...},
  "createdAt": "2025-08-26T12:00:00.000Z",
  "updatedAt": "2025-08-26T12:00:00.000Z"
}
```

### 5. Assign Lawyer and Approve Appointment (Admin Only)

```
PUT /:id/assign-lawyer
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "lawyer_id": "lawyer_object_id",
  "adminNotes": "Assigned to specialist in property law"
}
```

**Response:**
```json
{
  "message": "Lawyer assigned and appointment approved successfully",
  "appointment": {
    "_id": "appointment_id",
    "status": "approved",
    "lawyer_id": {...},
    "assignedBy": {...},
    "adminNotes": "Assigned to specialist in property law",
    "updatedAt": "2025-08-26T13:00:00.000Z"
  }
}
```

### 6. Reject Appointment (Admin Only)

```
PUT /:id/reject
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "adminNotes": "Insufficient information provided"
}
```

**Response:**
```json
{
  "message": "Appointment rejected successfully",
  "appointment": {
    "_id": "appointment_id",
    "status": "rejected",
    "assignedBy": {...},
    "adminNotes": "Insufficient information provided",
    "updatedAt": "2025-08-26T13:00:00.000Z"
  }
}
```

### 7. Update Appointment Status (Admin Only)

```
PUT /:id/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "completed",
  "adminNotes": "Meeting completed successfully"
}
```

### 8. Update Appointment (Authentication Required)

```
PUT /:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "date": "2025-09-02T00:00:00.000Z",
  "time": "2:00 PM",
  "description": "Updated description"
}
```

### 9. Delete Appointment (Admin Only)

```
DELETE /:id
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "message": "Appointment deleted successfully"
}
```

### 10. Get Appointments by Lawyer (Authentication Required)

```
GET /lawyer/:lawyerId?status=approved
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Lawyer appointments retrieved successfully",
  "count": 3,
  "appointments": [...]
}
```

### 11. Get Appointments by Client (Authentication Required)

```
GET /client/:clientId?status=approved
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Client appointments retrieved successfully",
  "count": 2,
  "appointments": [...]
}
```

## Status Flow

```
pending → approved (by admin with lawyer assignment)
pending → rejected (by admin)
approved → completed (by admin/lawyer)
```

## Authentication Requirements

- **Public Access**: Create appointment
- **User Access**: Get all appointments, get by ID, update appointment
- **Admin Access**: Get pending appointments, assign lawyer, approve/reject, delete, status updates

## Error Responses

### 400 - Bad Request
```json
{
  "message": "Missing required fields: clientName, clientEmail, clientPhone, subject, description, date, time"
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
  "message": "Appointment not found"
}
```

### 500 - Server Error
```json
{
  "error": "Error message details"
}
```

## Frontend Integration Examples

### Create Appointment (Public Form)
```javascript
const createAppointment = async (appointmentData) => {
  const response = await fetch('/api/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(appointmentData)
  });
  
  return await response.json();
};

// Example usage
const appointmentData = {
  clientName: "John Doe",
  clientEmail: "john@example.com",
  clientPhone: "1234567890",
  subject: "Legal Consultation",
  description: "Need help with contract review",
  date: "2025-09-01",
  time: "10:00 AM"
};

createAppointment(appointmentData);
```

### Admin: Assign Lawyer and Approve
```javascript
const assignLawyer = async (appointmentId, lawyerId, adminNotes) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`/api/appointments/${appointmentId}/assign-lawyer`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      lawyer_id: lawyerId,
      adminNotes: adminNotes
    })
  });
  
  return await response.json();
};
```

### Get Pending Appointments (Admin Dashboard)
```javascript
const getPendingAppointments = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/appointments/pending', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
};
```

## Usage Notes

1. **Public Access**: Anyone can create an appointment without authentication
2. **Admin Workflow**: Admins review pending appointments, assign lawyers, and approve/reject
3. **Status Tracking**: Complete status tracking from creation to completion
4. **Flexible Client Info**: Supports both authenticated users (with client_id) and anonymous users (with contact details)
5. **Pagination**: Large appointment lists are paginated for better performance
6. **Filtering**: Multiple filter options for finding specific appointments
