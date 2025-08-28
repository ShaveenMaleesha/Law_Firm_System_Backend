# Practice Area Migration Guide

## Overview
The `practiceArea` field in the Lawyer model has been changed from a single string to an array of strings to allow lawyers to have multiple practice areas.

## Changes Made

### 1. Model Schema Update
**Before:**
```javascript
practiceArea: { type: String, required: true }
```

**After:**
```javascript
practiceArea: [{ type: String, required: true }]
```

### 2. API Request/Response Format

#### Registration/Creation
**Before:**
```json
{
  "practiceArea": "Criminal Law"
}
```

**After:**
```json
{
  "practiceArea": ["Criminal Law", "Corporate Law"]
}
```

#### Query Operations
The system now supports finding lawyers by any of their practice areas:
- `/lawyers/practice-area/Criminal` will find lawyers who have "Criminal Law" in their practice areas
- The search is case-insensitive and uses partial matching

### 3. Database Query Updates

#### Before (String matching):
```javascript
{ practiceArea: { $regex: searchTerm, $options: 'i' } }
```

#### After (Array element matching):
```javascript
{ practiceArea: { $in: [new RegExp(searchTerm, 'i')] } }
```

### 4. Statistics Aggregation
The practice area distribution statistics now use `$unwind` to handle the array:

```javascript
const practiceAreaStats = await Lawyer.aggregate([
  { $unwind: '$practiceArea' },
  {
    $group: {
      _id: '$practiceArea',
      count: { $sum: 1 }
    }
  },
  { $sort: { count: -1 } }
]);
```

## Validation Rules

### 1. Required Field
- `practiceArea` is still required
- Must be a non-empty array

### 2. Array Validation
```javascript
if (!Array.isArray(practiceArea) || practiceArea.length === 0) {
  return res.status(400).json({
    message: "practiceArea must be a non-empty array of strings"
  });
}
```

## Migration

### Automatic Migration Script
A migration script has been provided: `migrate-practice-area.js`

**To run the migration:**
```bash
node migrate-practice-area.js
```

**What it does:**
1. Finds all lawyers with string `practiceArea`
2. Converts each string to a single-element array
3. Updates the database records

**Example:**
- Before: `practiceArea: "Criminal Law"`
- After: `practiceArea: ["Criminal Law"]`

### Manual Migration (if needed)
```javascript
// MongoDB query to convert existing data
db.lawyers.updateMany(
  { practiceArea: { $type: "string" } },
  [{ $set: { practiceArea: ["$practiceArea"] } }]
);
```

## API Examples

### 1. Create Lawyer with Multiple Practice Areas
```javascript
POST /lawyers
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "practiceArea": ["Criminal Law", "Family Law", "Corporate Law"],
  "address": "123 Main St",
  "contactNo": "1234567890"
}
```

### 2. Update Practice Areas
```javascript
PUT /lawyers/me
{
  "practiceArea": ["Immigration Law", "Human Rights Law"]
}
```

### 3. Search by Practice Area
```javascript
GET /lawyers/practice-area/Criminal
// Returns all lawyers with "Criminal" in any of their practice areas
```

## Error Handling

### Validation Errors
```json
{
  "message": "practiceArea must be a non-empty array of strings"
}
```

### Migration Errors
- Check database connection
- Ensure proper permissions
- Backup data before migration

## Impact on Frontend

### Form Updates
- Change single select/input to multi-select for practice areas
- Update validation to handle arrays
- Modify display logic to show multiple practice areas

### API Calls
- Update request payloads to send arrays instead of strings
- Modify response handling to display multiple practice areas

## Testing

### Test Cases to Update
1. Lawyer creation with single practice area: `["Criminal Law"]`
2. Lawyer creation with multiple practice areas: `["Criminal Law", "Family Law"]`
3. Empty array validation: `[]` should fail
4. Search functionality with array matching
5. Statistics aggregation with unwinded arrays

### Sample Test Data
```javascript
const testLawyer = {
  name: "Test Lawyer",
  email: "test@example.com",
  password: "password123",
  practiceArea: ["Criminal Law", "Corporate Law", "Family Law"],
  address: "Test Address",
  contactNo: "1234567890"
};
```

## Backward Compatibility

### Breaking Changes
- Old API calls sending string `practiceArea` will now fail validation
- Frontend components must be updated to handle arrays
- Database queries using string matching need updating

### Migration Strategy
1. Run the migration script on production data
2. Update all API clients to send arrays
3. Update frontend to handle array display
4. Test all practice area related functionality

## Benefits

### 1. Flexibility
- Lawyers can now have multiple specializations
- Better categorization and search capabilities

### 2. Improved Search
- Find lawyers by any of their practice areas
- More accurate lawyer-client matching

### 3. Better Analytics
- More detailed practice area distribution statistics
- Understanding of lawyer specialization overlap
