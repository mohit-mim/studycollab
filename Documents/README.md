# StudyCollab

A collaborative virtual learning platform with an integrated code editor, real-time collaboration features, and project management capabilities.

## Features

- 🎨 **Code Editor**: Monaco-based editor with syntax highlighting for multiple languages
- 💾 **Project Management**: Create, save, and manage coding projects
- 👥 **Study Groups**: Collaborate with peers in study groups
- 📁 **File Management**: Organize files within projects
- 🔐 **Authentication**: Secure user authentication with JWT
- ☁️ **Cloud Storage**: MongoDB Atlas for data persistence

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript
- Monaco Editor
- Responsive design

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/studycollab.git
cd studycollab
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Configure environment variables:
```bash
# Copy the example env file
cp .env.example .env

# Edit .env and add your MongoDB Atlas connection string
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
```

4. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5001`

5. Open the frontend:
- Open `mohit-proj1.html` in your browser
- Or use Live Server extension in VS Code

## Project Structure

```
studycollab/
├── backend/                 # Backend server
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── server.js           # Entry point
│   └── package.json
├── mohit-proj1.html        # Code editor page
├── mohit-proj.html         # Dashboard
├── my-projects.html        # Projects list
├── .vscode/
│   └── login.html          # Login page
├── api.js                  # API client
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get all user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Files
- `GET /api/projects/:projectId/files` - Get project files
- `POST /api/projects/:projectId/files` - Create file
- `PUT /api/files/:id` - Update file
- `DELETE /api/files/:id` - Delete file

### Groups
- `GET /api/groups` - Get user's groups
- `POST /api/groups` - Create group
- `POST /api/groups/join` - Join group with code

## Deployment

### Backend (Render)

1. Create account on [Render](https://render.com/)
2. Create new Web Service
3. Connect your GitHub repository
4. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables (MONGODB_URI, JWT_SECRET, etc.)

See [RENDER_DEPLOYMENT.md](backend/RENDER_DEPLOYMENT.md) for detailed instructions.

### Frontend (GitHub Pages / Vercel / Netlify)

The frontend can be deployed to any static hosting service:
- GitHub Pages
- Vercel
- Netlify

Update `api.js` with your production backend URL.

## Environment Variables

Create a `.env` file in the `backend` directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/studycollab
JWT_SECRET=your-secret-key-here
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://127.0.0.1:5500
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgments

- Monaco Editor for the code editor component
- MongoDB Atlas for cloud database hosting
- Render for backend hosting

## Contact

For questions or support, please open an issue in the GitHub repository.
