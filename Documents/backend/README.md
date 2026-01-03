# StudyCollab Backend

Backend server for StudyCollab virtual learning platform with Node.js, Express, and MongoDB.

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── models/
│   ├── User.js               # User schema
│   ├── Project.js            # Project schema
│   ├── File.js               # File schema
│   └── Assignment.js         # Assignment schema
├── routes/
│   ├── auth.js               # Authentication routes
│   ├── projects.js           # Project CRUD routes
│   └── files.js              # File management routes
├── middleware/
│   ├── auth.js               # JWT authentication
│   └── errorHandler.js       # Global error handler
├── .env                      # Environment variables (create this!)
├── .env.example              # Environment template
├── server.js                 # Main server file
└── package.json              # Dependencies
```

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file** (copy from `.env.example`)

3. **Add your MongoDB Atlas connection string** to `.env`

4. **Start the server:**
   ```bash
   npm start
   ```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Projects
- `GET /api/projects` - Get all user projects (Protected)
- `GET /api/projects/:id` - Get single project (Protected)
- `POST /api/projects` - Create project (Protected)
- `PUT /api/projects/:id` - Update project (Protected)
- `DELETE /api/projects/:id` - Delete project (Protected)

### Files
- `GET /api/projects/:projectId/files` - Get all files in project
- `GET /api/files/:id` - Get single file
- `POST /api/projects/:projectId/files` - Create file
- `PUT /api/files/:id` - Update file
- `DELETE /api/files/:id` - Delete file

## 🔒 Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## ⚙️ Environment Variables

Required variables in `.env`:
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **helmet** - Security headers
- **nodemon** - Auto-restart  (dev)

## 🛠️ Development

```bash
# Start with auto-restart
npm run dev

# Production start
npm start
```

## 📝 License

ISC
