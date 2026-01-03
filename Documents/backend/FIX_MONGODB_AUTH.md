# Fix MongoDB Atlas Authentication Error

You're getting **Error Code 8000** which is an authentication error. This means MongoDB Atlas is rejecting the connection.

## Step-by-Step Fix

### Step 1: Check Network Access (Most Common Issue)

![Network Access Configuration](C:/Users/mohit/.gemini/antigravity/brain/72cb63a9-ec01-43c6-a81f-66620c694cbd/mongodb_network_access_1767365629720.png)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click **"Network Access"** in the left sidebar (under Security)
3. Check if `0.0.0.0/0` is in the IP Access List
4. If NOT present:
   - Click **"Add IP Address"** button
   - Click **"Allow Access from Anywhere"**
   - Or manually enter: `0.0.0.0/0`
   - Description: `Allow from anywhere`
   - Click **"Confirm"**
5. Wait 1-2 minutes for changes to take effect

---

### Step 2: Verify Database User

![Database Access Configuration](C:/Users/mohit/.gemini/antigravity/brain/72cb63a9-ec01-43c6-a81f-66620c694cbd/mongodb_database_access_1767365647618.png)

1. Click **"Database Access"** in the left sidebar (under Security)
2. Verify user **`mohitmohanbarick24_db_user`** exists
3. Check that it has **"Read and write to any database"** privileges
4. If the user doesn't exist or you're unsure about the password:
   - Click **"Edit"** next to the user
   - Click **"Edit Password"**
   - Set a new simple password (e.g., `StudyCollab2026`)
   - Click **"Update User"**
   - **IMPORTANT:** Remember this new password!

---

### Step 3: Test Connection Again

After making changes above, wait 1-2 minutes, then run:

```bash
cd C:\Users\mohit\Documents\backend
node test-connection.js
```

**Expected Success Output:**
```
✅ SUCCESS! MongoDB Atlas Connected!
Host: cluster0-shard-00-00.9xqzknx.mongodb.net
Database: studycollab
🎉 Your MongoDB Atlas is working perfectly!
```

---

## If Still Not Working

### Option: Create a New Database User

1. Go to **Database Access**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `studycollab_admin`
5. Password: `StudyCollab2026` (or your choice - no special characters)
6. Database User Privileges: **"Read and write to any database"**
7. Click **"Add User"**
8. Wait 1-2 minutes

Then update your `.env` file:
```bash
MONGODB_URI=mongodb+srv://studycollab_admin:StudyCollab2026@cluster0.9xqzknx.mongodb.net/studycollab?retryWrites=true&w=majority&appName=Cluster0
```

Test again with `node test-connection.js`

---

## Quick Checklist

- [ ] Network Access has `0.0.0.0/0` whitelisted
- [ ] Database user exists with correct username
- [ ] Password is correct (no special characters recommended)
- [ ] Waited 1-2 minutes after making changes
- [ ] Tested with `node test-connection.js`

---

## After Successful Connection

Once you see the success message, you can:
1. Start your backend server: `npm start`
2. Proceed with Render deployment
3. Your data will now be stored in MongoDB Atlas cloud database!
