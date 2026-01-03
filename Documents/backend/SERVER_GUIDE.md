# How to Run the StudyCollab Backend

If you see a **"Failed to fetch"** error, it almost always means your **Backend Server is not running**.

The frontend (what you see in the browser) needs the backend (the invisible logic) to be running in the background to handle logins, save files, etc.

## 🚀 How to Start the Server

1.  **Open a Terminal** (Command Prompt or PowerShell).
2.  **Navigate to the backend folder**:
    ```powershell
    cd c:\Users\mohit\Documents\backend
    ```
3.  **Start the server**:
    ```powershell
    npm start
    ```
    *OR, for development (restarts automatically when you save files):*
    ```powershell
    npm run dev
    ```

4.  **Wait for the Success Message**:
    You should see something like:
    ```
    ✅ MongoDB Connected
    📡 Server running on port 5001
    ```

5.  **⚠️ IMPORTANT: LEAVE THE WINDOW OPEN**
    Do not close this terminal window! If you close it, the server stops, and your app will break again. You can minimize it, but don't close it.

## ❌ Troubleshooting "Failed to fetch"

If you started the server but still get errors:

1.  **Check the Port:**
    Make sure the server says it's running on port **5001**.
    If it says 5000 or something else, the frontend won't find it.
    *   *Fix:* Check `backend/.env` and ensure `PORT=5001`.

2.  **Check MongoDB:**
    If the server crashes immediately with a "MongoDB Connection Error":
    *   Make sure your MongoDB is running (if local).
    *   Check your internet connection (if using MongoDB Atlas).

3.  **Port Already in Use:**
    If you see "EADDRINUSE", it means the server is *already* running in another hidden window.
    *   *Fix:* Close all other terminals, or restart your computer.
