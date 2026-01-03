# StudyCollab GitHub Upload - Quick Start

## Your Repository
https://github.com/mohit-mim/studycollab

---

## Option 1: Use the Upload Script (Easiest)

I've created an automated script for you:

1. **Close this PowerShell window**
2. **Double-click** this file: `upload-to-github.bat`
3. The script will:
   - Check Git installation
   - Initialize repository
   - Add all files
   - Commit changes
   - Push to GitHub
4. When prompted for password, use your **Personal Access Token**

---

## Option 2: Manual Commands (In New PowerShell)

1. **Open a NEW PowerShell window** (Git won't work in this one)
2. Run these commands:

```powershell
cd C:\Users\mohit\Documents

# Configure Git (first time only)
git config --global user.name "Mohit"
git config --global user.email "mohit@studycollab.com"

# Initialize and upload
git init
git add .
git commit -m "Initial commit: StudyCollab project"
git remote add origin https://github.com/mohit-mim/studycollab.git
git branch -M main
git push -u origin main
```

---

## Authentication

When prompted for credentials:
- **Username**: `mohit-mim`
- **Password**: Use a **Personal Access Token** (NOT your GitHub password)

### Create Personal Access Token:
1. Go to: GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Name: `StudyCollab Upload`
4. Scope: Check **repo**
5. Generate and copy the token
6. Use this token as your password

---

## What Will Be Uploaded

✅ **Included:**
- All frontend files (.html, .js, .css)
- Backend code (server.js, routes, models, etc.)
- package.json, render.yaml
- README.md and documentation

❌ **Excluded (Protected):**
- `node_modules/` (too large, will be installed on Render)
- `.env` file (contains your MongoDB password - NEVER upload this!)
- Log files

---

## After Upload

1. Go to: https://github.com/mohit-mim/studycollab
2. Verify your files are there
3. Proceed with Render deployment using GitHub connection

---

## Troubleshooting

### "Git is not recognized"
- You MUST open a NEW PowerShell window
- Or restart your computer
- Current PowerShell session won't recognize Git

### Authentication Failed
- Make sure you're using Personal Access Token, not password
- Token must have `repo` scope

### Permission Denied
- Check repository URL is correct
- Verify you're logged into GitHub as `mohit-mim`

---

## Next Steps

After successful upload:
1. ✅ Verify files on GitHub
2. ✅ Deploy backend to Render (connect GitHub repository)
3. ✅ Update frontend API URL
4. ✅ Your app is live!

---

**Recommended: Use the `upload-to-github.bat` script - it's the easiest way!**
