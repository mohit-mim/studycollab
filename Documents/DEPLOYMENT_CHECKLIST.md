# Complete Deployment Checklist

Follow these steps in order to deploy your StudyCollab application online.

## Phase 1: Database Setup (15 minutes)

### MongoDB Atlas
- [ ] Create MongoDB Atlas account at https://www.mongodb.com/cloud/atlas/register
- [ ] Create free M0 cluster
- [ ] Create database user with strong password
- [ ] Add IP whitelist: `0.0.0.0/0` (allow from anywhere)
- [ ] Get connection string
- [ ] Replace `<password>` with actual password
- [ ] Add `/studycollab` database name before `?`
- [ ] Save final connection string

**Example connection string:**
```
mongodb+srv://studycollab-user:MyPass123@cluster0.xxxxx.mongodb.net/studycollab?retryWrites=true&w=majority
```

📖 **Detailed guide:** [MONGODB_ATLAS_SETUP.md](file:///C:/Users/mohit/Documents/backend/MONGODB_ATLAS_SETUP.md)

---

## Phase 2: Backend Deployment (20 minutes)

### Render Setup
- [ ] Create Render account at https://render.com/
- [ ] Click "New +" → "Web Service"
- [ ] Choose deployment method (GitHub or manual)
- [ ] Configure service:
  - Name: `studycollab-backend`
  - Environment: `Node`
  - Build Command: `npm install`
  - Start Command: `npm start`
  - Instance Type: `Free`

### Environment Variables
Add these in Render dashboard:

- [ ] `NODE_ENV` = `production`
- [ ] `MONGODB_URI` = Your MongoDB Atlas connection string
- [ ] `JWT_SECRET` = Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- [ ] `FRONTEND_URL` = `*` (or your frontend URL)
- [ ] `PORT` = `5000`

### Deploy
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (2-5 minutes)
- [ ] Copy your backend URL (e.g., `https://studycollab-backend.onrender.com`)

📖 **Detailed guide:** [RENDER_DEPLOYMENT.md](file:///C:/Users/mohit/Documents/backend/RENDER_DEPLOYMENT.md)

---

## Phase 3: Frontend Configuration (5 minutes)

### Update API URL
- [ ] Open `api.js` in your editor
- [ ] Find line 12: `PRODUCTION_URL: 'https://studycollab-backend.onrender.com/api'`
- [ ] Replace with YOUR actual Render URL
- [ ] Save the file

**Example:**
```javascript
PRODUCTION_URL: 'https://your-app-name.onrender.com/api',
```

> [!NOTE]
> The frontend automatically detects if you're running locally or in production and uses the appropriate URL.

---

## Phase 4: Testing (15 minutes)

### Backend Health Check
- [ ] Open browser
- [ ] Visit: `https://your-app-name.onrender.com/api/health`
- [ ] Verify you see: `{"success": true, "message": "StudyCollab API is running!"}`

### Full Application Test
- [ ] Open your frontend (local HTML file or hosted)
- [ ] Open browser console (F12)
- [ ] Check for API mode message: `🌐 API Mode: PRODUCTION` or `LOCAL`
- [ ] Register a new user account
- [ ] Login with credentials
- [ ] Create a new project
- [ ] Create and edit files
- [ ] Save changes
- [ ] Refresh page
- [ ] Verify data persists

### Cross-Device Test
- [ ] Open application on different device/browser
- [ ] Login with same credentials
- [ ] Verify all projects and files are accessible

---

## Phase 5: Optional - Frontend Hosting

If you want your frontend also hosted online (not just local files):

### Option A: GitHub Pages (Free)
1. Create GitHub repository
2. Push your frontend files
3. Enable GitHub Pages in repository settings
4. Access at: `https://yourusername.github.io/repo-name`

### Option B: Vercel (Free)
1. Go to https://vercel.com/
2. Import your GitHub repository
3. Deploy
4. Access at: `https://your-app.vercel.app`

### Option C: Netlify (Free)
1. Go to https://www.netlify.com/
2. Drag and drop your frontend folder
3. Deploy
4. Access at: `https://your-app.netlify.app`

---

## Troubleshooting

### Backend not responding
- Check Render logs for errors
- Verify MongoDB connection string is correct
- Ensure all environment variables are set
- Note: Free tier spins down after 15 min inactivity (first request takes 30-60s)

### Frontend can't connect
- Verify `api.js` has correct production URL
- Check browser console for CORS errors
- Ensure backend `FRONTEND_URL` allows your frontend domain

### Database connection failed
- Verify IP whitelist includes `0.0.0.0/0`
- Check username and password in connection string
- Ensure database name is included: `/studycollab`

---

## Success Criteria ✅

Your deployment is successful when:
- ✅ Backend health endpoint returns success
- ✅ You can register and login from frontend
- ✅ Projects and files persist across sessions
- ✅ Application works from any device with internet
- ✅ No console errors in browser

---

## Next Steps After Deployment

1. **Monitor your application:**
   - Check Render dashboard for logs and metrics
   - Monitor MongoDB Atlas for database usage

2. **Share your application:**
   - Share frontend URL with users
   - Backend URL should remain private (only frontend uses it)

3. **Future improvements:**
   - Add custom domain
   - Upgrade to paid tier for better performance
   - Add monitoring and analytics
   - Implement CI/CD for automatic deployments

---

## Quick Reference

| Service | URL | Purpose |
|---------|-----|---------|
| MongoDB Atlas | https://cloud.mongodb.com | Database hosting |
| Render | https://render.com | Backend hosting |
| Frontend | Local files or GitHub Pages | User interface |

**Need help?** Check the detailed guides:
- [MongoDB Atlas Setup](file:///C:/Users/mohit/Documents/backend/MONGODB_ATLAS_SETUP.md)
- [Render Deployment](file:///C:/Users/mohit/Documents/backend/RENDER_DEPLOYMENT.md)
