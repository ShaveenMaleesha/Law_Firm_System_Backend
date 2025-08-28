# Lawyer Profile Picture Upload API

## Overview
This document describes how lawyers can upload and update their profile pictures using base64 encoded images through the regular profile update endpoint.

## Endpoint

### Update Profile (Including Profile Picture)
- **URL**: `PUT /api/lawyers/me`
- **Authentication**: Required (Lawyer token)
- **Content-Type**: `application/json`

#### Request
- **Headers**:
  ```
  Authorization: Bearer <lawyer_jwt_token>
  Content-Type: application/json
  ```

- **Body** (JSON):
  ```json
  {
    "profilePicture": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
  }
  ```

#### Profile Picture Requirements
- **Format**: Base64 data URL
- **Allowed image types**: JPEG, JPG, PNG, GIF, WEBP
- **Maximum file size**: 5MB (approximate check on base64 size)
- **Format pattern**: `data:image/{type};base64,{base64_data}`

#### Response

**Success (200 OK)**:
```json
{
  "message": "Profile updated successfully",
  "lawyer": {
    "_id": "lawyer_id",
    "name": "John Doe",
    "email": "john.doe@lawfirm.com",
    "practiceArea": ["Corporate Law", "Criminal Law"],
    "address": "123 Legal Street",
    "contactNo": "+1234567890",
    "profilePicture": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...",
    "blogIds": [],
    "caseIds": []
  }
}
```

**Error (400 Bad Request - Invalid base64)**:
```json
{
  "message": "profilePicture must be a base64 encoded string"
}
```

**Error (400 Bad Request - Invalid format)**:
```json
{
  "message": "profilePicture must be a valid base64 image data URL (jpeg, jpg, png, gif, webp)"
}
```

**Error (400 Bad Request - File too large)**:
```json
{
  "message": "Profile picture is too large. Maximum size is 5MB."
}
```

**Error (401 Unauthorized)**:
```json
{
  "message": "Access denied. No token provided."
}
```

**Error (403 Forbidden)**:
```json
{
  "message": "Access denied. Lawyer access required."
}
```

### Remove Profile Picture

To remove a profile picture, send a PUT request with `profilePicture: null`:

```json
{
  "profilePicture": null
}
```

**Success Response**:
```json
{
  "message": "Profile updated successfully",
  "lawyer": {
    "_id": "lawyer_id",
    "name": "John Doe",
    "email": "john.doe@lawfirm.com",
    "practiceArea": ["Corporate Law", "Criminal Law"],
    "address": "123 Legal Street",
    "contactNo": "+1234567890",
    "profilePicture": null,
    "blogIds": [],
    "caseIds": []
  }
}
```

## Frontend Implementation Example

```typescript
async uploadProfilePicture(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Image = reader.result as string;
        const response = await api.put('/lawyers/me', {
          profilePicture: base64Image
        });
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

// To remove profile picture
async removeProfilePicture(): Promise<any> {
  const response = await api.put('/lawyers/me', {
    profilePicture: null
  });
  return response.data;
}
```

## Data Storage
- Profile pictures are stored as base64 encoded strings directly in the MongoDB database
- No file system storage is required
- Base64 data includes the MIME type prefix (e.g., `data:image/jpeg;base64,`)

## Security Considerations
- Only authenticated lawyers can update their profile pictures
- Base64 format validation prevents invalid data
- File type validation through MIME type checking
- File size limit prevents excessive database storage
- Direct database storage eliminates file system security concerns

## Database Changes
The Lawyer model has been updated to include a `profilePicture` field:

```javascript
{
  // ... other fields
  profilePicture: { type: String }, // Base64 encoded image data
  // ... other fields
}
```

## Accessing Profile Pictures
Profile pictures are stored as base64 data URLs in the database and can be used directly in HTML:

```html
<img src="${lawyer.profilePicture}" alt="Profile Picture" />
```
