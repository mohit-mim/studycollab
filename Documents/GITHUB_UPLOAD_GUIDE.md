# Upload StudyCollab to GitHub - Complete Guide

## Step 1: Install Git (If Not Already Installed)

### Download and Install Git

1. Go to [git-scm.com/download/win](https://git-scm.com/download/win)
2. Download the installer (64-bit recommended)
3. Run the installer
4. Use default settings (just click "Next" through the installation)
5. Restart your terminal/PowerShell after installation

### Verify Installation

Open PowerShell and run:
```bash
git --version
```

You should see something like: `git version 2.43.0`

---

## Step 2: Configure Git (First Time Only)

Set your name and email (used for commits):

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## Step 3: Create GitHub Repository

1. Go to [GitHub.com](https://github.com/)
2. Sign in (or create account if you don't have one)
3. Click the **"+"** icon in top right → **"New repository"**
4. Repository settings:
   - **Repository name**: `studycollab` (or your choice)
   - **Description**: `Collaborative virtual learning platform with code editor`
   - **Visibility**: Choose **Public** or **Private**
   - **DO NOT** check "Initialize with README" (we already have one)
   - Click **"Create repository"**

5. **Copy the repository URL** shown on the next page:
   - Should look like: `https://github.com/YOUR_USERNAME/studycollab.git`

---

## Step 4: Initialize Git and Upload

### Open PowerShell in Your Project Directory

```bash
cd C:\Users\mohit\Documents
```

### Initialize Git Repository

```bash
# Initialize git
git init

# Add all files to staging
git add .

# Create first commit
git commit -m "Initial commit: StudyCollab project with backend and frontend"
```

### Connect to GitHub

Replace `YOUR_USERNAME` with your actual GitHub username:

```bash
# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/studycollab.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Enter Credentials

When prompted:
- **Username**: Your GitHub username
- **Password**: Use a **Personal Access Token** (not your GitHub password)

#### How to Create Personal Access Token:
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: `StudyCollab Upload`
4. Select scopes: Check **repo** (full control of private repositories)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)
7. Use this token as your password when pushing

---

## Step 5: Verify Upload

1. Go to your GitHub repository page
2. Refresh the page
3. You should see all your files uploaded!

---

## Step 6: Update for Render Deployment

Now that your code is on GitHub, deploying to Render is easier:

### In Render:
1. Create Web Service
2. Choose **"Connect a repository"**
3. Select your `studycollab` repository
4. Render will automatically detect it's a Node.js project
5. Set root directory to `backend`
6. Configure and deploy!

---

## Quick Reference Commands

### After Making Changes

```bash
# Check what changed
git status

# Add all changes
git add .

# Commit changes
git commit -m "Description of what you changed"

# Push to GitHub
git push
```

### View Repository Info

```bash
# See remote URL
git remote -v

# See commit history
git log --oneline
```

---

## Troubleshooting

### "Git is not recognized"
- Restart PowerShell after installing Git
- Or restart your computer

### Authentication Failed
- Make sure you're using a Personal Access Token, not your password
- Token must have `repo` scope

### Files Not Uploading
- Check `.gitignore` - some files are intentionally excluded
- `.env` file is NOT uploaded (this is correct - it contains secrets!)

### Large Files Warning
- If you get warnings about large files, it's likely `node_modules`
- Make sure `.gitignore` includes `node_modules/`

---

## What Gets Uploaded

✅ **Included:**
- All source code (.html, .js, .css)
- Backend code (server.js, routes, models, etc.)
- Configuration files (package.json, render.yaml)
- Documentation (README.md, deployment guides)

❌ **Excluded (via .gitignore):**
- `node_modules/` (dependencies - will be installed on Render)
- `.env` (secrets - you'll add these in Render dashboard)
- Log files
- IDE settings

---

## Next Steps After Upload

1. ✅ Verify files on GitHub
2. ✅ Deploy backend to Render (using GitHub connection)
3. ✅ Deploy frontend to GitHub Pages/Vercel/Netlify (optional)
4. ✅ Update `api.js` with production URL
5. ✅ Test your live application!

---

## Need Help?

If you encounter issues:
1. Check the error message carefully
2. Make sure Git is installed: `git --version`
3. Verify you're in the correct directory: `pwd`
4. Check GitHub repository exists and URL is correct

---

## Summary

```bash
# One-time setup
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Upload to GitHub
cd C:\Users\mohit\Documents
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/studycollab.git
git branch -M main
git push -u origin main
```

**That's it!** Your project is now on GitHub and ready for deployment! 🎉
