# Blog API Documentation

## Overview

The Blog API provides comprehensive blog management functionality for the Law Firm Management System with role-based access control:

- **Lawyers**: Can create, view, update, and delete their own blogs
- **Admins**: Can view all blogs, approve/reject blogs, and access statistics
- **Public**: Can view approved blogs without authentication

## Blog Model Structure

```javascript
{
  title: String (required),
  content: String (required),
  topic: String (required),
  practiceArea: String (required),
  image: String (optional - URL or path),
  lawyer_id: ObjectId (ref: "Lawyer", required),
  approved: Boolean (default: false),
  approvedBy: ObjectId (ref: "Admin"),
  approvedAt: Date,
  status: String (enum: ['pending', 'approved', 'rejected'], default: 'pending'),
  rejectionReason: String,
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

## Authentication

Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## API Endpoints

### Public Endpoints (No Authentication Required)

#### Get Approved Blogs
- **GET** `/api/blogs/public`
- **Description**: Get all approved blogs with filtering and pagination
- **Query Parameters**:
  - `practiceArea` (string): Filter by practice area
  - `topic` (string): Filter by topic
  - `lawyer_id` (string): Filter by lawyer ID
  - `page` (number): Page number (default: 1)
  - `limit` (number): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "blogs": [
      {
        "_id": "blog_id",
        "title": "Understanding Corporate Law",
        "content": "Blog content...",
        "topic": "Corporate Law",
        "practiceArea": "Corporate",
        "image": "https://example.com/image.jpg",
        "lawyer_id": {
          "_id": "lawyer_id",
          "name": "John Doe",
          "practiceArea": "Corporate"
        },
        "status": "approved",
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "total": 25,
    "page": 1,
    "pages": 3
  }
}
```

#### Get Single Approved Blog
- **GET** `/api/blogs/public/:id`
- **Description**: Get a single approved blog by ID

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "blog_id",
    "title": "Understanding Corporate Law",
    "content": "Detailed blog content...",
    "topic": "Corporate Law",
    "practiceArea": "Corporate",
    "image": "https://example.com/image.jpg",
    "lawyer_id": {
      "_id": "lawyer_id",
      "name": "John Doe",
      "practiceArea": "Corporate"
    },
    "status": "approved",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Lawyer Endpoints (Lawyer Authentication Required)

#### Create Blog
- **POST** `/api/blogs/`
- **Authentication**: Required (Lawyer only)
- **Description**: Create a new blog post for admin approval

**Request Body:**
```json
{
  "title": "Understanding Corporate Law",
  "content": "Detailed content about corporate law...",
  "topic": "Corporate Law",
  "practiceArea": "Corporate",
  "image": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Blog created successfully and sent for admin approval",
  "data": {
    "_id": "blog_id",
    "title": "Understanding Corporate Law",
    "content": "Detailed content...",
    "topic": "Corporate Law",
    "practiceArea": "Corporate",
    "image": "https://example.com/image.jpg",
    "lawyer_id": "lawyer_id",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Get My Blogs
- **GET** `/api/blogs/my-blogs`
- **Authentication**: Required (Lawyer only)
- **Description**: Get all blogs created by the authenticated lawyer
- **Query Parameters**:
  - `status` (string): Filter by status (pending, approved, rejected)
  - `page` (number): Page number (default: 1)
  - `limit` (number): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "blogs": [
      {
        "_id": "blog_id",
        "title": "Understanding Corporate Law",
        "content": "Blog content...",
        "topic": "Corporate Law",
        "practiceArea": "Corporate",
        "status": "pending",
        "approvedBy": null,
        "rejectionReason": null,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "total": 5,
    "page": 1,
    "pages": 1
  }
}
```

#### Update My Blog
- **PUT** `/api/blogs/my-blogs/:id`
- **Authentication**: Required (Lawyer only)
- **Description**: Update own blog (only if status is pending)

**Request Body:**
```json
{
  "title": "Updated Corporate Law Guide",
  "content": "Updated content...",
  "topic": "Corporate Law",
  "practiceArea": "Corporate",
  "image": "https://example.com/new-image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Blog updated successfully",
  "data": {
    "_id": "blog_id",
    "title": "Updated Corporate Law Guide",
    "content": "Updated content...",
    "status": "pending",
    "updatedAt": "2024-01-15T11:30:00Z"
  }
}
```

#### Delete My Blog
- **DELETE** `/api/blogs/my-blogs/:id`
- **Authentication**: Required (Lawyer only)
- **Description**: Delete own blog (only if status is pending)

**Response:**
```json
{
  "success": true,
  "message": "Blog deleted successfully"
}
```

### Admin Endpoints (Admin Authentication Required)

#### Get All Blogs
- **GET** `/api/blogs/admin/all`
- **Authentication**: Required (Admin only)
- **Description**: Get all blogs with filtering and pagination
- **Query Parameters**:
  - `status` (string): Filter by status
  - `lawyer_id` (string): Filter by lawyer ID
  - `practiceArea` (string): Filter by practice area
  - `topic` (string): Filter by topic
  - `page` (number): Page number (default: 1)
  - `limit` (number): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "blogs": [
      {
        "_id": "blog_id",
        "title": "Understanding Corporate Law",
        "content": "Blog content...",
        "topic": "Corporate Law",
        "practiceArea": "Corporate",
        "lawyer_id": {
          "_id": "lawyer_id",
          "name": "John Doe",
          "email": "john@example.com",
          "practiceArea": "Corporate"
        },
        "status": "pending",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "total": 15,
    "page": 1,
    "pages": 2
  }
}
```

#### Approve Blog
- **PATCH** `/api/blogs/admin/:id/approve`
- **Authentication**: Required (Admin only)
- **Description**: Approve a pending blog

**Response:**
```json
{
  "success": true,
  "message": "Blog approved successfully",
  "data": {
    "_id": "blog_id",
    "title": "Understanding Corporate Law",
    "status": "approved",
    "approved": true,
    "approvedBy": {
      "_id": "admin_id",
      "username": "admin"
    },
    "approvedAt": "2024-01-15T12:00:00Z"
  }
}
```

#### Reject Blog
- **PATCH** `/api/blogs/admin/:id/reject`
- **Authentication**: Required (Admin only)
- **Description**: Reject a pending blog

**Request Body:**
```json
{
  "rejectionReason": "Content needs more legal citations and references"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Blog rejected successfully",
  "data": {
    "_id": "blog_id",
    "title": "Understanding Corporate Law",
    "status": "rejected",
    "approved": false,
    "approvedBy": {
      "_id": "admin_id",
      "username": "admin"
    },
    "rejectionReason": "Content needs more legal citations and references",
    "approvedAt": "2024-01-15T12:00:00Z"
  }
}
```

#### Get Blog Statistics
- **GET** `/api/blogs/admin/statistics`
- **Authentication**: Required (Admin only)
- **Description**: Get comprehensive blog statistics

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 50,
    "approved": 35,
    "pending": 10,
    "rejected": 5,
    "practiceAreaBreakdown": [
      {
        "_id": "Corporate",
        "count": 15
      },
      {
        "_id": "Criminal",
        "count": 12
      }
    ],
    "topBloggers": [
      {
        "_id": "lawyer_id",
        "lawyerName": "John Doe",
        "count": 8
      }
    ]
  }
}
```

### Protected Endpoints (Admin or Lawyer)

#### Get Blog by ID
- **GET** `/api/blogs/:id`
- **Authentication**: Required (Admin or Lawyer)
- **Description**: Get blog by ID with role-based access control
- **Access Control**: 
  - Admins can access any blog
  - Lawyers can only access their own blogs

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "blog_id",
    "title": "Understanding Corporate Law",
    "content": "Detailed content...",
    "topic": "Corporate Law",
    "practiceArea": "Corporate",
    "image": "https://example.com/image.jpg",
    "lawyer_id": {
      "_id": "lawyer_id",
      "name": "John Doe",
      "email": "john@example.com",
      "practiceArea": "Corporate"
    },
    "status": "approved",
    "approvedBy": {
      "_id": "admin_id",
      "username": "admin"
    },
    "approvedAt": "2024-01-15T12:00:00Z",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Title, content, topic, and practice area are required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Blog not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Error creating blog",
  "error": "Database connection failed"
}
```

## Blog Workflow

1. **Lawyer Creates Blog**: Lawyer submits a blog with status "pending"
2. **Admin Review**: Admin reviews the blog content
3. **Admin Decision**: 
   - **Approve**: Blog status becomes "approved" and is visible to public
   - **Reject**: Blog status becomes "rejected" with optional reason
4. **Public Access**: Only approved blogs are accessible to the public
5. **Lawyer Management**: Lawyers can only edit/delete blogs with "pending" status

## Image Support

- Blogs can include an optional image field
- Image should be a URL or file path to the image
- Image handling (upload/storage) should be implemented separately
- Consider using services like AWS S3, Cloudinary, or local file storage

## Best Practices

1. **Validation**: Always validate required fields before submission
2. **Image Optimization**: Compress and resize images before storage
3. **Content Moderation**: Implement content filtering for inappropriate content
4. **SEO**: Use descriptive titles and topics for better search visibility
5. **Performance**: Implement caching for frequently accessed approved blogs
6. **Security**: Sanitize blog content to prevent XSS attacks
