# Render Deployment Guide

This guide will walk you through deploying your StudyCollab backend to Render.

## Prerequisites

✅ MongoDB Atlas cluster created and connection string ready
✅ Backend code prepared for production

## Step 1: Create Render Account

1. Go to [Render](https://render.com/)
2. Click **"Get Started"** or **"Sign Up"**
3. Sign up with GitHub (recommended) or email
4. Verify your email if needed

## Step 2: Create New Web Service

1. From your Render dashboard, click **"New +"** button
2. Select **"Web Service"**

## Step 3: Connect Repository

You have two options:

### Option A: Deploy from GitHub (Recommended)

1. Click **"Connect GitHub"** and authorize Render
2. Select your repository (or create a new one and push your code)
3. Click **"Connect"** on the repository

### Option B: Deploy from Local (Quick Start)

1. Click **"Public Git repository"**
2. We'll use manual deployment for now
3. Skip to Step 4

> [!TIP]
> For Option B, you'll need to create a GitHub repository later. For now, we can deploy manually.

## Step 4: Configure Web Service

Fill in the following details:

**Basic Settings:**
- **Name**: `studycollab-backend` (or your choice)
- **Region**: Choose closest to you (e.g., Singapore, Oregon, Frankfurt)
- **Branch**: `main` (if using Git)
- **Root Directory**: Leave empty (or `backend` if your backend is in a subdirectory)
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Instance Type:**
- Select **"Free"** plan

## Step 5: Add Environment Variables

Scroll down to **"Environment Variables"** section and add:

1. Click **"Add Environment Variable"**
2. Add each of these:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Generate a secure random string* |
| `PORT` | `5000` (Render will override this automatically) |
| `FRONTEND_URL` | `*` (or your specific frontend URL) |

**To generate JWT_SECRET:*
- Open terminal/PowerShell
- Run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Copy the output

> [!IMPORTANT]
> Make sure your `MONGODB_URI` includes:
> - Correct username and password
> - Database name (`/studycollab`)
> - Full connection string with `?retryWrites=true&w=majority`

## Step 6: Deploy

1. Click **"Create Web Service"** button
2. Render will start building and deploying your app
3. Wait for deployment to complete (2-5 minutes)

You'll see logs showing:
```
==> Building...
==> Deploying...
==> Your service is live 🎉
```

## Step 7: Get Your Backend URL

1. Once deployed, you'll see your service URL at the top:
   ```
   https://studycollab-backend.onrender.com
   ```
2. **Copy this URL** - you'll need it for frontend configuration

## Step 8: Test Your Backend

1. Open your browser and visit:
   ```
   https://your-app-name.onrender.com/api/health
   ```
2. You should see:
   ```json
   {
     "success": true,
     "message": "StudyCollab API is running!",
     "timestamp": "2026-01-02T..."
   }
   ```

3. Also test the root endpoint:
   ```
   https://your-app-name.onrender.com/
   ```

> [!NOTE]
> Free tier services on Render spin down after 15 minutes of inactivity. The first request after inactivity may take 30-60 seconds to respond while the service spins up.

## Troubleshooting

### Build Failed
- Check the build logs for errors
- Verify `package.json` has all required dependencies
- Ensure Node.js version is compatible

### Application Error
- Check the logs in Render dashboard
- Verify all environment variables are set correctly
- Check MongoDB connection string is correct

### Cannot Connect to Database
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check database username and password
- Ensure connection string format is correct

## Updating Your Deployment

When you make changes to your code:

**If using GitHub:**
1. Push changes to your repository
2. Render will automatically redeploy

**If manual deployment:**
1. Go to Render dashboard
2. Click "Manual Deploy" → "Deploy latest commit"

---

## Next Steps

After successful deployment:
1. ✅ Copy your backend URL
2. ✅ Update frontend `api.js` with new URL
3. ✅ Test complete application flow
4. ✅ Celebrate! 🎉

Your backend is now live and accessible from anywhere!
