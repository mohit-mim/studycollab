# MongoDB Atlas Connection Troubleshooting

## Issue: Authentication Error (Code 8000)

Your connection string has special characters in the password that need proper URL encoding.

### Current Password
`db_mohit@#123`

### URL Encoding Required
- `@` → `%40`
- `#` → `%23`

### Encoded Password
`db_mohit%40%23123`

---

## Solutions

### Option 1: Verify Current Encoding (Try First)

The `.env` file has been updated with the encoded password. Let's verify:

1. **Check MongoDB Atlas Network Access:**
   - Go to MongoDB Atlas → Network Access
   - Verify `0.0.0.0/0` is in the IP Access List
   - If not, add it

2. **Verify Database User:**
   - Go to MongoDB Atlas → Database Access
   - Check that user `mohitmohanbarick24_db_user` exists
   - Verify password is `db_mohit@#123`

3. **Test Connection:**
   ```bash
   cd backend
   node test-connection.js
   ```

### Option 2: Change Password (Recommended if Option 1 fails)

Change your MongoDB Atlas password to one WITHOUT special characters:

1. Go to MongoDB Atlas → Database Access
2. Click "Edit" on user `mohitmohanbarick24_db_user`
3. Click "Edit Password"
4. Set new password (e.g., `dbmohit123` - no special characters)
5. Click "Update User"

Then update `.env`:
```bash
MONGODB_URI=mongodb+srv://mohitmohanbarick24_db_user:dbmohit123@cluster0.mzve7wa.mongodb.net/studycollab?retryWrites=true&w=majority&appName=Cluster0
```

### Option 3: Create New Database User

1. Go to MongoDB Atlas → Database Access
2. Click "Add New Database User"
3. Username: `studycollab_user`
4. Password: Use simple password without special characters (e.g., `StudyCollab2026`)
5. Database User Privileges: "Read and write to any database"
6. Click "Add User"

Then update `.env`:
```bash
MONGODB_URI=mongodb+srv://studycollab_user:StudyCollab2026@cluster0.mzve7wa.mongodb.net/studycollab?retryWrites=true&w=majority&appName=Cluster0
```

---

## Quick Test

After making changes, test with:
```bash
cd C:\Users\mohit\Documents\backend
node test-connection.js
```

You should see:
```
✅ SUCCESS! MongoDB Connected: cluster0-shard-00-00.mzve7wa.mongodb.net
📦 Database: studycollab
```

---

## Next Steps After Successful Connection

1. Start the backend server: `npm start`
2. Verify you see "MongoDB Connected" in console
3. Test API endpoints
4. Proceed with Render deployment
