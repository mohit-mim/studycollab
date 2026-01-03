# Authentication Middleware Documentation

## Overview
The authentication middleware provides three functions to secure your routes and control access based on user authentication and roles.

## Middleware Functions

### 1. `protect` - Require Authentication
Ensures the user is logged in with a valid JWT token.

**Usage:**
```javascript
const { protect } = require('../middleware/auth');

// Protect a single route
router.get('/profile', protect, getUserProfile);

// Protect multiple routes
router.route('/posts')
    .get(protect, getAllPosts)
    .post(protect, createPost);
```

**What it does:**
- Checks for JWT token in `Authorization` header
- Verifies token is valid and not expired
- Fetches user from database
- Attaches user to `req.user`
- Returns 401 error if token is missing/invalid

**Client Request Example:**
```javascript
// Include token in Authorization header
fetch('/api/auth/me', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});
```

---

### 2. `authorize` - Role-Based Access Control
Restricts access to specific user roles. **Must be used after `protect` middleware.**

**Usage:**
```javascript
const { protect, authorize } = require('../middleware/auth');

// Only admins can access
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

// Admins or moderators can access
router.put('/posts/:id', protect, authorize('admin', 'moderator'), updatePost);
```

**Available Roles:**
- `user` (default)
- `moderator`
- `admin`

**What it does:**
- Checks if `req.user.role` matches allowed roles
- Returns 403 Forbidden if user doesn't have required role
- Allows request to proceed if role matches

---

### 3. `optionalAuth` - Optional Authentication
Attaches user data if token is provided, but doesn't block request if no token exists.

**Usage:**
```javascript
const { optionalAuth } = require('../middleware/auth');

// Route works for both logged-in and guest users
router.get('/projects/public', optionalAuth, getPublicProjects);
```

**Use Cases:**
- Public content that shows extra features for logged-in users
- Analytics that track authenticated vs guest users
- Preview pages that unlock full content for members

**In Your Handler:**
```javascript
const getPublicProjects = async (req, res) => {
    // Check if user is authenticated
    if (req.user) {
        // Show personalized content
        console.log(`Logged in user: ${req.user.name}`);
    } else {
        // Show public content only
        console.log('Guest user');
    }
    
    // Rest of your logic...
};
```

---

## Complete Route Examples

### Example 1: Auth Routes (Already Implemented)
```javascript
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route - requires authentication
router.get('/me', protect, getCurrentUser);

module.exports = router;
```

### Example 2: Admin-Only Routes
```javascript
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// All users can view projects
router.get('/projects', protect, getAllProjects);

// Only admins/moderators can create projects
router.post('/projects', protect, authorize('admin', 'moderator'), createProject);

// Only admins can delete projects
router.delete('/projects/:id', protect, authorize('admin'), deleteProject);

module.exports = router;
```

### Example 3: Mixed Public/Private Routes
```javascript
const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/auth');

// Public route with optional auth
router.get('/posts', optionalAuth, getAllPosts);

// Fully protected route
router.post('/posts', protect, createPost);

module.exports = router;
```

---

## Error Responses

### 401 Unauthorized (No/Invalid Token)
```json
{
    "success": false,
    "message": "Not authorized to access this route. Please log in."
}
```

### 403 Forbidden (Insufficient Permissions)
```json
{
    "success": false,
    "message": "User role 'user' is not authorized to access this route"
}
```

---

## Testing with Postman/Thunder Client

### 1. Login to Get Token
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123"
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "_id": "...",
        "name": "John Doe",
        "email": "user@example.com",
        "role": "user",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
```

### 2. Use Token in Protected Routes
```
GET http://localhost:5000/api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Security Best Practices

1. **Always use HTTPS in production** - Tokens sent over HTTP can be intercepted
2. **Store tokens securely on client** - Use httpOnly cookies or secure local storage
3. **Set appropriate token expiration** - Currently set to 30 days in `auth.js`
4. **Validate JWT_SECRET** - Use a strong, random secret in production (minimum 32 characters)
5. **Never log tokens** - Tokens should never appear in console logs or error messages

---

## Next Steps

To make the middleware functional, you'll need to:

1. ✅ Authentication middleware created
2. ✅ User model with role field
3. ✅ Auth routes updated
4. ⏳ Install dependencies: `jsonwebtoken`, `bcryptjs`
5. ⏳ Set up `.env` file with `JWT_SECRET`
6. ⏳ Connect to MongoDB
7. ⏳ Test endpoints

---

## Common Issues & Solutions

### Issue: "User not found. Token invalid."
- Token is valid but user was deleted from database
- Solution: Clear old tokens and login again

### Issue: "Token is invalid or expired"
- Token has expired (30 days by default)
- Wrong JWT_SECRET environment variable
- Solution: Login again to get new token

### Issue: "Not authorized to access this route"
- Using `authorize()` without `protect()`
- Solution: Always use `protect` before `authorize`
