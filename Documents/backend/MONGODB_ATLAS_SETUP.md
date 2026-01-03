# MongoDB Atlas Setup Guide

Follow these steps to set up your free cloud database for StudyCollab.

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with your email or Google account
3. Complete the registration process

## Step 2: Create a Free Cluster

1. After logging in, click **"Build a Database"** or **"Create"**
2. Choose the **FREE** tier (M0 Sandbox)
   - Look for "Shared" clusters
   - Select the **M0** option (512 MB storage, free forever)
3. Choose a cloud provider and region:
   - **Provider**: AWS, Google Cloud, or Azure (any works)
   - **Region**: Choose one closest to you or your users
   - Example: `AWS / Mumbai (ap-south-1)` or `AWS / N. Virginia (us-east-1)`
4. Cluster Name: You can keep the default or name it `StudyCollab`
5. Click **"Create"** button

> [!NOTE]
> Cluster creation takes 1-3 minutes. Wait for it to complete.

## Step 3: Create Database User

1. You'll see a "Security Quickstart" screen
2. Under **"How would you like to authenticate your connection?"**
   - Choose **"Username and Password"**
3. Create credentials:
   - **Username**: `studycollab-user` (or your choice)
   - **Password**: Click "Autogenerate Secure Password" or create your own
   - **IMPORTANT**: Copy and save this password somewhere safe!
4. Click **"Create User"**

## Step 4: Configure Network Access

1. Scroll down to **"Where would you like to connect from?"**
2. Choose **"My Local Environment"**
3. Click **"Add My Current IP Address"**
4. **IMPORTANT for deployment**: Also add `0.0.0.0/0` to allow access from anywhere
   - Click **"Add IP Address"**
   - Enter IP: `0.0.0.0/0`
   - Description: `Allow from anywhere (for Render deployment)`
   - Click **"Add Entry"**
5. Click **"Finish and Close"**

> [!WARNING]
> Adding `0.0.0.0/0` allows connections from any IP address. This is necessary for cloud deployment platforms like Render, but ensure your database user has a strong password.

## Step 5: Get Connection String

1. Click **"Connect"** button on your cluster
2. Choose **"Connect your application"**
3. Select:
   - **Driver**: Node.js
   - **Version**: 5.5 or later
4. Copy the connection string - it looks like:
   ```
   mongodb+srv://studycollab-user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Replace `<password>`** with your actual database user password
6. **Add database name** before the `?`:
   ```
   mongodb+srv://studycollab-user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/studycollab?retryWrites=true&w=majority
   ```

## Step 6: Save Your Connection String

Copy your final connection string. You'll need it for:
- Local `.env` file (for testing)
- Render environment variables (for deployment)

**Example final connection string:**
```
mongodb+srv://studycollab-user:MySecurePass123@cluster0.ab1cd.mongodb.net/studycollab?retryWrites=true&w=majority
```

## Verification

Once you have your connection string:

1. Update your local `.env` file with the new `MONGODB_URI`
2. Restart your backend server
3. Check the console for "MongoDB Connected" message
4. If successful, your backend is now using the cloud database!

---

## Troubleshooting

**Connection timeout or network error:**
- Verify you added `0.0.0.0/0` to IP whitelist
- Check your password is correct (no special characters that need encoding)

**Authentication failed:**
- Verify username and password are correct
- Make sure you replaced `<password>` in the connection string

**Database not found:**
- MongoDB will create the database automatically on first write
- Make sure you added `/studycollab` before the `?` in the connection string

---

## Next Steps

After MongoDB Atlas is set up:
1. ✅ Test connection locally
2. ✅ Prepare backend for production
3. ✅ Deploy to Render
4. ✅ Update frontend API URL
