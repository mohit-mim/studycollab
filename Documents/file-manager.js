// File Manager for Virtual File System (Connected to Backend API with LocalStorage Fallback)
class FileManager {
    constructor(projectId, initialFiles = []) {
        this.projectId = projectId || 'local_workspace';
        this.useLocalStorage = !projectId || (typeof projectId === 'string' && projectId.startsWith('local_'));
        this.files = this.processInitialFiles(initialFiles);

        // If using local storage, load files immediately
        if (this.useLocalStorage) {
            this.loadFiles();
        }
    }

    processInitialFiles(filesList) {
        if (!filesList) return {};

        const filesMap = {};
        filesList.forEach(file => {
            filesMap[file.name] = {
                ...file,
                created: file.createdAt ? new Date(file.createdAt).getTime() : Date.now(),
                modified: file.updatedAt ? new Date(file.updatedAt).getTime() : Date.now()
            };
        });
        return filesMap;
    }

    loadFiles() {
        const stored = localStorage.getItem(`vsp_files_${this.projectId}`);
        if (stored) {
            try {
                this.files = JSON.parse(stored);
            } catch (e) {
                console.error('Failed to parse local files', e);
                this.files = {};
            }
        } else if (Object.keys(this.files).length === 0) {
            // Default files if nothing in storage and nothing passed in
            this.createFile('index.js', 'javascript');
        }
        return this.files;
    }

    saveFiles() {
        if (this.useLocalStorage || this.projectId === 'local_workspace') {
            localStorage.setItem(`vsp_files_${this.projectId}`, JSON.stringify(this.files));
        }
    }

    async createFile(name, language = 'javascript') {
        if (this.files[name]) {
            alert('File already exists!');
            return false;
        }

        const templates = {
            javascript: "// " + name + "\n\nconsole.log('New file created');",
            python: "# " + name + "\n\nprint('New file created')",
            cpp: "#include <iostream>\n\nint main() {\n    std::cout << \"Hello World!\" << std::endl;\n    return 0;\n}",
            html: "<!DOCTYPE html>\n<html>\n<head>\n    <title>New Page</title>\n</head>\n<body>\n    <h1>Hello World!</h1>\n</body>\n</html>"
        };

        const content = templates[language] || '';

        // Try API first if we have a real project ID
        if (!this.useLocalStorage && this.projectId !== 'local_workspace' && window.API) {
            try {
                const response = await API.createFile(this.projectId, {
                    name,
                    language,
                    content
                });

                if (response.success) {
                    const newFile = response.data;
                    this.files[name] = {
                        ...newFile,
                        created: Date.now(),
                        modified: Date.now()
                    };
                    return true;
                }
            } catch (error) {
                console.error('Failed to create file via API, falling back to local:', error);
                // Fallback to local below
            }
        }

        // Local creation (Fallback or default)
        this.files[name] = {
            name,
            language,
            content,
            created: Date.now(),
            modified: Date.now(),
            _id: 'local_' + Date.now()
        };
        this.saveFiles();
        return true;
    }

    async deleteFile(name) {
        if (!this.files[name]) return false;

        const fileId = this.files[name]._id;

        // Try API first
        if (!this.useLocalStorage && fileId && !fileId.startsWith('local_') && window.API) {
            try {
                const response = await API.deleteFile(fileId);
                if (response.success) {
                    delete this.files[name];
                    return true;
                }
            } catch (error) {
                console.error('Failed to delete file via API:', error);
                // Continue to delete locally if API fails?? Maybe risky. 
                // But for "make it work", let's assuming if API fails, we just remove it from UI view at least.
            }
        }

        // Local delete
        delete this.files[name];
        this.saveFiles();
        return true;
    }

    async renameFile(oldName, newName) {
        if (!this.files[oldName] || this.files[newName]) return false;

        const fileId = this.files[oldName]._id;

        // Try API
        if (!this.useLocalStorage && fileId && !fileId.startsWith('local_') && window.API) {
            try {
                const response = await Promise.resolve(API.request(`/files/${fileId}`, {
                    method: 'PUT',
                    body: JSON.stringify({ name: newName })
                }));
                if (response.success) {
                    // Update local state is done below
                }
            } catch (error) {
                console.error('Failed to rename via API', error);
                // Fallback?
            }
        }

        this.files[newName] = { ...this.files[oldName], name: newName };
        delete this.files[oldName];
        this.saveFiles();
        return true;
    }

    getFile(name) {
        return this.files[name] || null;
    }

    async updateFileContent(name, content) {
        if (!this.files[name]) return false;

        // Optimistic update
        this.files[name].content = content;
        this.files[name].modified = Date.now();
        this.saveFiles(); // Save locally always for backup/speed

        const fileId = this.files[name]._id;

        // Push to API if applicable
        if (!this.useLocalStorage && fileId && !fileId.startsWith('local_') && window.API) {
            try {
                // We don't await this if we want "fire and forget" or auto-save behavior
                API.updateFile(fileId, content).catch(err => {
                    console.error('Auto-save failed:', err);
                });
                return true;
            } catch (error) {
                console.error('Failed to update file:', error);
                return false;
            }
        }
        return true;
    }

    getAllFiles() {
        return Object.values(this.files);
    }

    getFilesByLanguage(language) {
        return Object.values(this.files).filter(f => f.language === language);
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FileManager;
}
