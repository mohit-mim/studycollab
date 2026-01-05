# Virtual Study Platform

## Overview
The Virtual Study Platform is a collaborative learning environment built using the MERN stack (MongoDB, Express, React, Node.js). This platform allows users to create projects, join study groups, and collaborate on coding exercises in real-time.

## Features
- **User Authentication**: Users can register, log in, and manage their profiles.
- **Project Management**: Users can create and manage coding projects.
- **Study Groups**: Users can create and join study groups based on various topics.
- **Collaborative Code Editor**: Real-time code editing and execution.
- **Output Console**: View output and errors from code execution.
- **API Integration**: Connects to external APIs for enhanced functionality.

## Project Structure
```
virtual-study-platform
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── models
│   │   ├── routes
│   │   ├── app.js
│   │   └── config
│   ├── package.json
│   └── README.md
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── styles
│   ├── package.json
│   └── README.md
└── README.md
```

## Getting Started

### Prerequisites
- Node.js
- MongoDB

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd virtual-study-platform
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npm start
   ```

2. Start the frontend application:
   ```
   cd frontend
   npm start
   ```

### API Documentation
Refer to the backend README for detailed API endpoints and usage.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.