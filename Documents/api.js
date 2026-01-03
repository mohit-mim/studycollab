/**
 * StudyCollab API Client - Production Ready
 * Automatically detects environment and uses appropriate API URL
 */

// Environment detection
const isLocalFile = window.location.protocol === 'file:';
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// API Configuration
const API_CONFIG = {
    // IMPORTANT: Update this with your Render backend URL after deployment
    PRODUCTION_URL: 'https://studycollab-backend.onrender.com/api',

    // Local development URL
    LOCAL_URL: 'http://localhost:5001/api',

    // Timeout for requests (milliseconds)
    TIMEOUT: 10000 // 10 seconds for production (Render free tier can be slow on cold start)
};

// Determine which API URL to use
const API_BASE_URL = (isLocalFile || isLocalhost) ? API_CONFIG.LOCAL_URL : API_CONFIG.PRODUCTION_URL;

console.log(`🌐 API Mode: ${(isLocalFile || isLocalhost) ? 'LOCAL' : 'PRODUCTION'}`);
console.log(`📡 API URL: ${API_BASE_URL}`);

const API = {
    // Helper for making requests with auth token
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('vsp_token');

        const headers = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...options.headers
        };

        const config = {
            ...options,
            headers
        };

        try {
            // Add timeout to prevent hanging when backend is offline
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...config,
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            const data = await response.json();

            if (!response.ok) {
                // Handle 401 Unauthorized (token expired/invalid)
                if (response.status === 401) {
                    // Check if we're in offline mode - don't logout
                    const token = localStorage.getItem('vsp_token');
                    if (token && token !== 'offline_token') {
                        API.logout();
                    } else {
                        // In offline mode, just throw error to fall back to local storage
                        throw new Error('Backend unavailable - using offline mode');
                    }
                }
                throw new Error(data.message || 'Something went wrong');
            }

            return data;
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timeout - backend may be offline or spinning up (Render free tier)');
            }
            console.error('API Error:', error);
            throw error;
        }
    },

    // --- Authentication ---

    async login(email, password) {
        try {
            const data = await this.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            if (data.success) {
                this.setSession(data.data.token, data.data);
            }
            return data;
        } catch (error) {
            console.warn('Backend login failed, attempting offline fallback:', error);
            // Fallback for offline mode / "like earlier"
            const mockUser = {
                name: 'Offline User',
                email: email,
                id: 'offline_user'
            };
            const mockToken = 'offline_token';
            this.setSession(mockToken, mockUser);

            return {
                success: true,
                data: {
                    user: mockUser,
                    token: mockToken
                },
                message: 'Logged in offline'
            };
        }
    },

    async register(name, email, password) {
        const data = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });

        if (data.success) {
            this.setSession(data.data.token, data.data);
        }
        return data;
    },

    async getCurrentUser() {
        return this.request('/auth/me');
    },

    logout() {
        localStorage.removeItem('vsp_token');
        localStorage.removeItem('vsp_user');
        window.location.href = '.vscode/login.html'; // Adjust path as needed
    },

    setSession(token, user) {
        localStorage.setItem('vsp_token', token);
        localStorage.setItem('vsp_user', JSON.stringify(user));
    },

    isLoggedIn() {
        return !!localStorage.getItem('vsp_token');
    },

    // --- Projects ---

    async getProjects() {
        return this.request('/projects');
    },

    async getProject(id) {
        return this.request(`/projects/${id}`);
    },

    async createProject(projectData) {
        return this.request('/projects', {
            method: 'POST',
            body: JSON.stringify(projectData)
        });
    },

    async updateProject(id, projectData) {
        return this.request(`/projects/${id}`, {
            method: 'PUT',
            body: JSON.stringify(projectData)
        });
    },

    async deleteProject(id) {
        return this.request(`/projects/${id}`, {
            method: 'DELETE'
        });
    },

    // --- Files ---

    async getProjectFiles(projectId) {
        return this.request(`/projects/${projectId}/files`);
    },

    async createFile(projectId, fileData) {
        return this.request(`/projects/${projectId}/files`, {
            method: 'POST',
            body: JSON.stringify(fileData)
        });
    },

    async updateFile(fileId, content) {
        return this.request(`/files/${fileId}`, {
            method: 'PUT',
            body: JSON.stringify({ content })
        });
    },

    async deleteFile(fileId) {
        return this.request(`/files/${fileId}`, {
            method: 'DELETE'
        });
    },

    // --- Groups ---

    async getMyGroups() {
        return this.request('/groups');
    },

    async createGroup(groupData) {
        return this.request('/groups', {
            method: 'POST',
            body: JSON.stringify(groupData)
        });
    },

    async joinGroup(code) {
        return this.request('/groups/join', {
            method: 'POST',
            body: JSON.stringify({ code })
        });
    },

    // --- Saved Files ---

    async getSavedFiles() {
        try {
            return await this.request('/saved-files');
        } catch (error) {
            // If backend fails, return empty array to allow fallback to local files
            console.warn('Backend unavailable for saved files, using local only');
            return { success: false, data: [], error: error.message };
        }
    },

    async getSavedFile(id) {
        return this.request(`/saved-files/${id}`);
    },

    async createSavedFile(fileData) {
        return this.request('/saved-files', {
            method: 'POST',
            body: JSON.stringify(fileData)
        });
    },

    async updateSavedFile(id, fileData) {
        return this.request(`/saved-files/${id}`, {
            method: 'PUT',
            body: JSON.stringify(fileData)
        });
    },

    async deleteSavedFile(id) {
        return this.request(`/saved-files/${id}`, {
            method: 'DELETE'
        });
    },

    async getProjectSavedFiles(projectId) {
        return this.request(`/saved-files/project/${projectId}`);
    }
};

// Export to window for global access
window.API = API;
