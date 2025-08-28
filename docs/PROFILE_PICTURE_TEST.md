# Profile Picture Upload Test

## Test the Profile Picture Functionality

You can test the profile picture upload functionality using the following methods:

### 1. Using Frontend Code (TypeScript/JavaScript)

```typescript
async uploadProfilePicture(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Image = reader.result as string;
        const response = await api.put('/api/lawyers/me', {
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
```

### 2. Using cURL (for testing)

First, convert your image to base64:
```bash
# On Windows (PowerShell)
$imageBytes = [System.IO.File]::ReadAllBytes("path/to/your/image.jpg")
$base64String = [System.Convert]::ToBase64String($imageBytes)
$dataUrl = "data:image/jpeg;base64,$base64String"
```

Then use cURL to test:
```bash
curl -X PUT http://localhost:5000/api/lawyers/me \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "profilePicture": "data:image/jpeg;base64,YOUR_BASE64_STRING_HERE"
  }'
```

### 3. Example HTML for Testing

```html
<!DOCTYPE html>
<html>
<head>
    <title>Profile Picture Upload Test</title>
</head>
<body>
    <input type="file" id="imageInput" accept="image/*">
    <button onclick="uploadImage()">Upload Profile Picture</button>
    
    <script>
        async function uploadImage() {
            const input = document.getElementById('imageInput');
            const file = input.files[0];
            
            if (!file) {
                alert('Please select an image');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = async function(e) {
                const base64Image = e.target.result;
                
                try {
                    const response = await fetch('/api/lawyers/me', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer YOUR_JWT_TOKEN'
                        },
                        body: JSON.stringify({
                            profilePicture: base64Image
                        })
                    });
                    
                    const result = await response.json();
                    console.log('Upload result:', result);
                    alert('Profile picture uploaded successfully!');
                } catch (error) {
                    console.error('Upload error:', error);
                    alert('Failed to upload profile picture');
                }
            };
            
            reader.readAsDataURL(file);
        }
    </script>
</body>
</html>
```

## Notes

1. **Authentication Required**: You need a valid lawyer JWT token to upload profile pictures
2. **File Size Limit**: Maximum 5MB (approximate check on base64 size)
3. **Supported Formats**: JPEG, JPG, PNG, GIF, WEBP
4. **Storage**: Images are stored as base64 strings in MongoDB
5. **Usage**: The returned base64 string can be used directly in HTML `<img>` tags

## Remove Profile Picture

To remove a profile picture, send:
```json
{
  "profilePicture": null
}
```
