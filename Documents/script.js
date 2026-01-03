// Only configure Monaco if require is defined (code editor pages)
if (typeof require !== 'undefined') {
    require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
}
let editorInstance;
let fileManager;
let currentFile = 'index.js';
let openTabs = [];
let autoSaveInterval;

document.addEventListener('DOMContentLoaded', function () {
    // Check for user authentication
    const user = localStorage.getItem('vsp_user');
    if (!user) {
        window.location.href = ".vscode/login.html";
        return;
    }

    const userObj = JSON.parse(user);
    const userName = userObj.name || userObj.email.split('@')[0];

    const userNameElement = document.getElementById('userName');
    if (userNameElement) userNameElement.textContent = userName;

    const welcomeNameElement = document.getElementById('welcomeName');
    if (welcomeNameElement) welcomeNameElement.textContent = userName;

    const currentPage = window.location.pathname.split('/').pop();
    if (window.location.pathname.endsWith('mohit-proj.html')) {
        initializeDashboard();
    } else if (window.location.pathname.endsWith('mohit-proj1.html')) {
        initializeEditor();
    } else if (window.location.pathname.endsWith('my-projects.html')) {
        initializeProjectsPage();
    }

    const navLinks = document.querySelectorAll('.sidebar-nav .nav-item');
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Initialize theme on page load for dashboard
    if (window.location.pathname.endsWith('mohit-proj.html')) {
        // Apply saved theme immediately
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        }
    }

    function initializeDashboard() {
        const welcomeName = document.getElementById('welcomeName');
        if (welcomeName) welcomeName.textContent = userName;

        // Theme toggle functionality for dashboard
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            // Set initial button state based on current theme
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
            } else {
                themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
            }

            // Remove any existing listeners to prevent duplicates
            const newThemeToggle = themeToggle.cloneNode(true);
            themeToggle.parentNode.replaceChild(newThemeToggle, themeToggle);

            // Add click event listener
            newThemeToggle.addEventListener('click', () => {
                document.documentElement.classList.toggle('dark');
                const isDark = document.documentElement.classList.contains('dark');
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
                newThemeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i> Light Mode' : '<i class="fas fa-moon"></i> Dark Mode';
            });
        }

        // Desktop/Mobile view toggle
        const desktopViewBtn = document.getElementById('desktop-view-btn');
        const mobileViewBtn = document.getElementById('mobile-view-btn');
        const mainContent = document.querySelector('.main-content');

        if (desktopViewBtn && mobileViewBtn && mainContent) {
            desktopViewBtn.addEventListener('click', () => {
                mainContent.style.maxWidth = 'none';
                mainContent.style.margin = 'auto';
                desktopViewBtn.classList.add('active');
                mobileViewBtn.classList.remove('active');
            });

            mobileViewBtn.addEventListener('click', () => {
                mainContent.style.maxWidth = '375px';
                mainContent.style.margin = 'auto';
                mobileViewBtn.classList.add('active');
                desktopViewBtn.classList.remove('active');
            });
        }

        // Local Projects Loading
        const localProjects = getLocalProjects();

        // Fetch projects from API
        try {
            if (window.API) {
                API.getProjects().then(response => {
                    if (response.success) {
                        const allProjects = [...response.data, ...localProjects];
                        renderProjects(allProjects);

                        // Update project count in stats
                        const projectCountEl = document.querySelector('.stat-card.projects .stat-number');
                        if (projectCountEl) projectCountEl.textContent = allProjects.length;
                    } else {
                        // API call worked but returned error/failure, fallback to local
                        renderProjects(localProjects);
                    }
                }).catch(err => {
                    console.error('Error fetching projects:', err);
                    renderProjects(localProjects);
                });
            } else {
                renderProjects(localProjects);
            }
        } catch (error) {
            console.error('Failed to initialize projects:', error);
            renderProjects(localProjects);
        }

        const startProjectBtn = document.getElementById('start-project-btn');
        if (startProjectBtn) {
            startProjectBtn.addEventListener('click', async (e) => {
                e.preventDefault();

                // 1. Get Project Details
                const title = prompt('Enter Project Title:', 'My New Project');
                if (!title) return; // User cancelled

                // Quick language selection (could be a modal in future)
                const language = prompt('Enter primary language (javascript, python, cpp, html):', 'javascript');
                const validLangs = ['javascript', 'python', 'cpp', 'html', 'java'];
                const selectedLang = validLangs.includes(language?.toLowerCase()) ? language.toLowerCase() : 'javascript';

                // 2. Try Cloud Creation
                if (window.API && document.getElementById('userName').textContent !== 'Offline User') { // Simple check
                    try {
                        const response = await API.createProject({
                            title: title,
                            description: `Created on ${new Date().toLocaleDateString()}`,
                            language: selectedLang
                        });

                        if (response.success) {
                            // 3a. Redirect to Cloud Project
                            const projectId = response.data._id;
                            window.location.href = `mohit-proj1.html?id=${projectId}`;
                            return;
                        }
                    } catch (error) {
                        console.error('Cloud creation failed:', error);
                        alert('Failed to connect to cloud. Creating local project instead.');
                    }
                }

                // 3b. Fallback to Local
                const localId = 'local_' + Date.now();
                // Optionally save metadata about this local project so it appears in list with correct name
                // (This part relies on `script.js` logic for `renderProjects` reading from localStorage keys)
                // We'll write a small marker file or just let the editor handle it.
                // For better UX, we can save the project metadata to localStorage here:
                const projectMeta = {
                    _id: localId,
                    title: title,
                    language: selectedLang,
                    isLocal: true,
                    createdAt: new Date().toISOString()
                };
                // We use a specific key format that `getLocalProjects` might expect or we assume editor handles it.
                // Looking at `getLocalProjects`, it scans `vsp_files_local_`.
                // It derives title from ID. Let's stick to simple redirect for now to match strict fallback.

                window.location.href = `mohit-proj1.html?id=${localId}`;
            });
        }

        // Groups Logic
        if (window.API) {
            initGroups();

            const createGroupBtn = document.getElementById('create-group-btn');
            if (createGroupBtn) {
                createGroupBtn.addEventListener('click', async () => {
                    const name = prompt('Enter Group Name:');
                    if (!name) return;
                    const description = prompt('Enter Group Description (optional):');

                    try {
                        const response = await API.createGroup({ name, description });
                        if (response.success) {
                            showNotification('Group created successfully!');
                            initGroups();
                        }
                    } catch (error) {
                        console.error(error);
                        showNotification('Failed to create group');
                    }
                });
            }

            const joinGroupBtn = document.getElementById('join-group-btn');
            if (joinGroupBtn) {
                joinGroupBtn.addEventListener('click', async () => {
                    const code = prompt('Enter Group Code:');
                    if (!code) return;

                    try {
                        const response = await API.joinGroup(code);
                        if (response.success) {
                            showNotification('Joined group successfully!');
                            initGroups();
                        }
                    } catch (error) {
                        console.error(error);
                        showNotification(error.message || 'Failed to join group');
                    }
                });
            }
        }
    }

    async function initGroups() {
        if (!window.API) return;
        try {
            const response = await API.getMyGroups();
            if (response.success) {
                const groups = response.data;
                const groupsCountEl = document.querySelector('.stat-card.groups .stat-number');
                if (groupsCountEl) groupsCountEl.textContent = groups.length;
            }
        } catch (error) {
            console.error('Failed to fetch groups:', error);
        }
    }

    function getLocalProjects() {
        const projects = [];
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('vsp_files_local_')) {
                    const id = key.replace('vsp_files_', '');
                    // Create a mock project object
                    projects.push({
                        _id: id,
                        title: 'Local Project ' + id.split('_')[1].slice(-4),
                        description: 'Offline project stored in browser',
                        tags: ['local'],
                        isLocal: true,
                        language: 'javascript' // Default
                    });
                }
            }
        } catch (e) {
            console.error('Error reading local projects:', e);
        }
        // Also check for the generic workspace
        if (localStorage.getItem('vsp_files_local_workspace')) {
            projects.push({
                _id: 'local_workspace',
                title: 'Default Workspace',
                description: 'Default offline workspace',
                tags: ['local'],
                isLocal: true
            });
        }
        return projects;
    }

    function renderProjects(projects) {
        const projectList = document.querySelector('.project-list');
        if (!projectList) return;

        projectList.innerHTML = '';

        if (projects.length === 0) {
            projectList.innerHTML = '<div style="padding:1rem; color:var(--text-secondary);">No projects found. Start a new one!</div>';
            return;
        }

        projects.forEach(project => {
            const projectItem = document.createElement('div');
            projectItem.className = 'project-item';
            const mainTag = project.tags && project.tags.length > 0 ? project.tags[0] : (project.language || 'javascript');
            const isLocal = project.isLocal ? '<span class="tag" style="background:#555; color:white; font-size:0.7rem; margin-left:0.5rem;">OFFLINE</span>' : '';

            projectItem.innerHTML = `
                <div class="project-info">
                    <h4>${project.title} ${isLocal} <span class="tag ${mainTag}">${mainTag}</span></h4>
                    <p>${project.description || 'No description'}</p>
                </div>
                <a href="mohit-proj1.html?id=${project._id}" class="project-link"><i class="fas fa-external-link-alt"></i></a>
            `;

            projectList.appendChild(projectItem);
        });
    }

    async function initializeProjectsPage() {
        const projectListEl = document.getElementById('all-projects-list') || document.querySelector('.project-list');
        if (!projectListEl) return;

        projectListEl.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-secondary);">Loading saved files...</div>';

        try {
            let allSavedFiles = [];

            // 1. Get Saved Files from Backend
            if (window.API) {
                try {
                    const response = await API.getSavedFiles();
                    // Handle both success and graceful failure from API
                    if (response && response.data && response.data.length > 0) {
                        allSavedFiles = [...response.data];
                        console.log(`Loaded ${allSavedFiles.length} files from backend`);
                    }
                } catch (err) {
                    console.error('Failed to load saved files from backend', err);
                }
            }

            // 2. Get Local Saved Files (from localStorage as fallback)
            const localSavedFiles = getLocalSavedFiles();
            allSavedFiles = [...allSavedFiles, ...localSavedFiles];

            // 3. Render
            renderSavedFiles(allSavedFiles);

            // 4. Search Filter
            const searchInput = document.getElementById('project-search');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    const term = e.target.value.toLowerCase();
                    const filtered = allSavedFiles.filter(f =>
                        f.name.toLowerCase().includes(term) ||
                        (f.description && f.description.toLowerCase().includes(term)) ||
                        (f.language && f.language.toLowerCase().includes(term))
                    );
                    renderSavedFiles(filtered);
                });
            }

        } catch (error) {
            console.error('Error initializing projects page:', error);
            projectListEl.innerHTML = '<div style="padding:1rem; color:red;">Failed to load saved files.</div>';
        }
    }

    function getLocalSavedFiles() {
        const files = [];
        try {
            // Check for saved files in localStorage with 'vsp_saved_file_' prefix
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('vsp_saved_file_')) {
                    try {
                        const fileData = JSON.parse(localStorage.getItem(key));
                        files.push({
                            _id: key.replace('vsp_saved_file_', ''),
                            name: fileData.name || 'Untitled',
                            language: fileData.language || 'javascript',
                            content: fileData.content || '',
                            description: fileData.description || 'Local saved file',
                            isLocal: true,
                            createdAt: fileData.createdAt || new Date().toISOString()
                        });
                    } catch (e) {
                        console.error('Error parsing local saved file:', e);
                    }
                }
            }
        } catch (e) {
            console.error('Error reading local saved files:', e);
        }
        return files;
    }

    function renderSavedFiles(files) {
        const projectListEl = document.getElementById('all-projects-list') || document.querySelector('.project-list');
        if (!projectListEl) return;

        projectListEl.innerHTML = '';

        if (files.length === 0) {
            projectListEl.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color:var(--text-secondary);">No saved files found. Start coding and save your work!</div>';
            return;
        }

        files.forEach(file => {
            const fileCard = document.createElement('div');
            fileCard.className = 'project-item';

            const languageIcons = {
                javascript: 'fab fa-js',
                python: 'fab fa-python',
                cpp: 'fas fa-code',
                html: 'fab fa-html5',
                java: 'fab fa-java',
                css: 'fab fa-css3-alt'
            };

            const icon = languageIcons[file.language] || 'fas fa-file-code';
            const isLocal = file.isLocal ? '<span class="tag" style="background:#555; color:white; font-size:0.7rem; margin-left:0.5rem;">OFFLINE</span>' : '';
            const date = new Date(file.createdAt || file.updatedAt).toLocaleDateString();

            fileCard.innerHTML = `
                <div class="project-info">
                    <h4>
                        <i class="${icon}" style="margin-right: 0.5rem; color: var(--primary-accent);"></i>
                        ${file.name} ${isLocal}
                        <span class="tag ${file.language}">${file.language}</span>
                    </h4>
                    <p>${file.description || 'No description'}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem; font-size: 0.75rem; color: var(--text-secondary);">
                        <span><i class="fas fa-calendar"></i> ${date}</span>
                        <span><i class="fas fa-code"></i> ${file.content ? file.content.split('\\n').length : 0} lines</span>
                    </div>
                </div>
                <a href="mohit-proj1.html?file=${file._id}" class="project-link"><i class="fas fa-external-link-alt"></i></a>
            `;

            projectListEl.appendChild(fileCard);
        });
    }

    async function initializeEditor() {
        if (!document.getElementById('editor')) return;

        // Get Project ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('id') || urlParams.get('project');

        // Initialize logic wrapped in function to allow async
        try {
            if (projectId && window.API && !projectId.startsWith('local_')) {
                // Fetch project details including files
                const response = await API.getProject(projectId);

                if (response.success) {
                    const projectData = response.data;
                    // Update Header
                    const projectNameEl = document.querySelector('.logo');
                    if (projectNameEl) projectNameEl.textContent = `${projectData.title} | StudyCollab`;

                    // Initialize file manager with API data
                    fileManager = new FileManager(projectId, projectData.files);
                } else {
                    throw new Error('Project load failed');
                }
            } else {
                // No project ID or API, use local workspace
                console.log('Initializing local workspace...');
                fileManager = new FileManager(projectId, []);
            }

        } catch (error) {
            console.error('Editor initialization failed (falling back to local):', error);
            // Fallback to local instead of alerting
            fileManager = new FileManager(null, []);
            showNotification('Running in local/offline mode');
        }

        // Render file list
        renderFileList();

        // Setup file explorer event listeners
        setupFileExplorerEvents();

        // Setup output tabs
        setupOutputTabs();

        require(['vs/editor/editor.main'], function () {
            // Load the first file (default to index.js if present, or first available)
            const files = fileManager.getAllFiles();
            const firstFile = files.find(f => f.name === 'index.js') || files[0];

            if (firstFile) {
                currentFile = firstFile.name;

                // Only push to openTabs if not already there
                if (!openTabs.includes(currentFile)) {
                    openTabs.push(currentFile);
                }

                const file = fileManager.getFile(currentFile);
                editorInstance = monaco.editor.create(document.getElementById('editor'), {
                    value: file ? file.content : "// Welcome to StudyCollab Code Editor!\n",
                    language: file ? file.language : 'javascript',
                    theme: 'vs-dark',
                    automaticLayout: true,
                    fontSize: 14,
                    minimap: { enabled: true },
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    bracketPairColorization: { enabled: true }
                });
            } else {
                // No files? Create one or show empty
                // Ideally we should prompt to create a file
                editorInstance = monaco.editor.create(document.getElementById('editor'), {
                    value: "// No files in this project. Create one to start coding!",
                    language: 'javascript',
                    theme: 'vs-dark'
                });
                // Update status bar when cursor position changes
                editorInstance.onDidChangeCursorPosition((e) => {
                    const position = editorInstance.getPosition();
                    document.getElementById('status-position').textContent = `Ln ${position.lineNumber}, Col ${position.column}`;
                });

                // Track content changes for auto-save
                let changeTimeout;
                editorInstance.onDidChangeModelContent(() => {
                    clearTimeout(changeTimeout);
                    changeTimeout = setTimeout(() => {
                        saveCurrentFile();
                    }, 1000); // Auto-save after 1 second of inactivity
                });

                monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
                    noSemanticValidation: false,
                    noSyntaxValidation: false
                });
            }

            // Setup editor interaction listeners AFTER editor is created
            const languageSelect = document.getElementById('language-select');
            const runBtn = document.getElementById('run-btn');
            const saveBtn = document.getElementById('save-btn');
            const clearOutputBtn = document.getElementById('clear-output-btn');
            const downloadOutputBtn = document.getElementById('download-output-btn');
            const copyOutputBtn = document.getElementById('copy-output-btn');
            const templatesBtn = document.getElementById('templates-btn');

            // Update language select to match current file
            if (firstFile) {
                languageSelect.value = firstFile.language;
                document.getElementById('status-language').textContent = firstFile.language.charAt(0).toUpperCase() + firstFile.language.slice(1);
            }

            languageSelect.addEventListener('change', () => {
                if (!editorInstance) return;
                const language = languageSelect.value;
                monaco.editor.setModelLanguage(editorInstance.getModel(), language);

                // Update file language
                const file = fileManager.getFile(currentFile);
                if (file) {
                    file.language = language;
                    fileManager.saveFiles();
                }

                document.getElementById('status-language').textContent = language.charAt(0).toUpperCase() + language.slice(1);
            });

            saveBtn.addEventListener('click', async () => {
                saveCurrentFile();

                // Also save to backend saved files collection
                if (window.API && currentFile) {
                    try {
                        const file = fileManager.getFile(currentFile);
                        const language = languageSelect.value;

                        // Check if this file is already saved
                        const savedFileId = localStorage.getItem(`vsp_saved_file_map_${currentFile}`);

                        if (savedFileId) {
                            // Update existing saved file
                            await API.updateSavedFile(savedFileId, {
                                name: currentFile,
                                language: language,
                                content: editorInstance.getValue(),
                                description: `Last updated: ${new Date().toLocaleString()}`
                            });
                            showNotification('File updated in My Projects!');
                        } else {
                            // Create new saved file
                            const response = await API.createSavedFile({
                                name: currentFile,
                                language: language,
                                content: editorInstance.getValue(),
                                description: `Created: ${new Date().toLocaleString()}`,
                                tags: [language]
                            });

                            if (response.success) {
                                // Store mapping for future updates
                                localStorage.setItem(`vsp_saved_file_map_${currentFile}`, response.data._id);
                                showNotification('File saved to My Projects!');
                            }
                        }
                    } catch (error) {
                        console.error('Failed to save to backend:', error);
                        // Fallback to local storage
                        const fileData = {
                            name: currentFile,
                            language: languageSelect.value,
                            content: editorInstance.getValue(),
                            description: `Saved locally: ${new Date().toLocaleString()}`,
                            createdAt: new Date().toISOString()
                        };
                        localStorage.setItem(`vsp_saved_file_${Date.now()}`, JSON.stringify(fileData));
                        showNotification('File saved locally!');
                    }
                } else {
                    showNotification('File saved successfully!');
                }
            });

            templatesBtn.addEventListener('click', () => {
                showTemplateModal();
            });

            runBtn.addEventListener('click', async () => {
                saveCurrentFile();
                const code = editorInstance.getValue();
                const language = languageSelect.value;
                const outputBox = document.getElementById('output');

                // Clear previous output
                outputBox.textContent = `> Preparing to execute ${language} code...\n`;

                // Client-side execution for JavaScript
                if (language === 'javascript') {
                    outputBox.textContent += `> Running JavaScript locally...\n`;

                    const originalLog = console.log;
                    const originalError = console.error;
                    const originalWarn = console.warn;
                    const logs = [];

                    // Override console methods to capture output
                    console.log = (...args) => {
                        logs.push(args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(' '));
                        originalLog.apply(console, args);
                    };
                    console.error = (...args) => {
                        logs.push('[Error] ' + args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(' '));
                        originalError.apply(console, args);
                    };
                    console.warn = (...args) => {
                        logs.push('[Warn] ' + args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(' '));
                        originalWarn.apply(console, args);
                    };

                    try {
                        // Execute code safely
                        // We wrap it in an async function to allow await usage if user writes async code
                        const result = await eval(`(async () => { ${code} })()`);

                        if (result !== undefined) {
                            logs.push('[Return] ' + (typeof result === 'object' ? JSON.stringify(result) : result));
                        }

                        outputBox.textContent = logs.join('\n');
                        if (logs.length === 0) outputBox.textContent += "Code executed successfully (no output).";

                    } catch (error) {
                        outputBox.textContent += `\nRuntime Error:\n${error.message}\n${error.stack || ''}`;
                    } finally {
                        // Restore console
                        console.log = originalLog;
                        console.error = originalError;
                        console.warn = originalWarn;
                        outputBox.textContent += `\n\n> Execution finished.`;
                    }
                    return;
                }

                // Client-side preview for HTML
                if (language === 'html') {
                    outputBox.textContent += `> Opening HTML preview in new window...\n`;
                    const newWindow = window.open();
                    if (newWindow) {
                        newWindow.document.write(code);
                        newWindow.document.close();
                        outputBox.textContent += `> HTML Preview opened successfully.\n\n> Execution finished.`;
                    } else {
                        outputBox.textContent += `> Error: Pop-up blocked. Please allow pop-ups for this site.`;
                    }
                    return;
                }

                // API execution for other languages (Python, C++)
                console.log('[Code Execution] Starting remote execution for:', language);
                const languageMap = {
                    'cpp': 54,
                    'python': 71, // Python (3.8.1)
                    'c': 50,
                    'java': 62
                };

                const langId = languageMap[language];
                if (!langId) {
                    outputBox.textContent += `> Error: Language '${language}' execution not supported locally or remotely.\n`;
                    return;
                }

                const submissionData = {
                    source_code: code,
                    language_id: langId,
                    stdin: "",
                    redirect_stderr_to_stdout: true
                };

                outputBox.textContent += `> Submitting to remote runner (Judge0)...\n`;

                fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=false', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-RapidAPI-Key': '3269b05259mshe4d5bf0db0fff35p184268jsne78ef3843394',
                        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
                    },
                    body: JSON.stringify(submissionData)
                })
                    .then(response => {
                        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                        return response.json();
                    })
                    .then(data => {
                        if (!data.token) throw new Error('No token received');
                        const token = data.token;

                        const pollResult = () => {
                            fetch(`https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false`, {
                                method: 'GET',
                                headers: {
                                    'X-RapidAPI-Key': '3269b05259mshe4d5bf0db0fff35p184268jsne78ef3843394',
                                    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
                                }
                            })
                                .then(res => res.json())
                                .then(result => {
                                    if (result.status.id <= 2) { // In Queue or Processing
                                        setTimeout(pollResult, 1000);
                                    } else {
                                        if (result.stdout) {
                                            outputBox.textContent = result.stdout;
                                        } else if (result.compile_output) {
                                            outputBox.textContent = `Compilation Error:\n${result.compile_output}`;
                                        } else if (result.stderr) {
                                            outputBox.textContent = `Runtime Error:\n${result.stderr}`;
                                        } else {
                                            outputBox.textContent = `Program finished with no output.`;
                                        }
                                        outputBox.textContent += `\n\n> Execution finished.`;
                                    }
                                })
                                .catch(err => {
                                    outputBox.textContent = `Error polling result: ${err.message}`;
                                });
                        };
                        pollResult();
                    })
                    .catch(err => {
                        console.error('[Code Execution] Submission error:', err);
                        outputBox.textContent += `\nRemote Execution Failed: ${err.message}\nNote: Remote execution uses a shared key that may be rate-limited. JavaScript and HTML run locally.`;
                    });
            });

            clearOutputBtn.addEventListener('click', () => {
                document.getElementById('output').textContent = "Click 'Run' to execute your code";
                document.getElementById('console-output').textContent = "Console output will appear here...";
                document.getElementById('problems-output').textContent = "No problems detected";
            });

            downloadOutputBtn.addEventListener('click', () => {
                const outputText = document.getElementById('output').textContent;
                const blob = new Blob([outputText], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'output.txt';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });

            copyOutputBtn.addEventListener('click', () => {
                const outputText = document.getElementById('output').textContent;
                navigator.clipboard.writeText(outputText).then(() => {
                    showNotification('Output copied to clipboard!');
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                });
            });
        });

        renderTabs();
    }

    function saveCurrentFile() {
        if (!editorInstance || !currentFile) return;
        const content = editorInstance.getValue();
        fileManager.updateFileContent(currentFile, content);
    }

    function renderFileList() {
        const fileList = document.getElementById('file-list');
        if (!fileList) return;

        fileList.innerHTML = '';
        const files = fileManager.getAllFiles();

        files.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item' + (file.name === currentFile ? ' active' : '');
            fileItem.innerHTML = `
                <i class="fas fa-file-code"></i>
                <span class="file-name">${file.name}</span>
                <div class="file-actions">
                    <button class="file-action-btn" onclick="deleteFile('${file.name}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            fileItem.addEventListener('click', () => switchToFile(file.name));
            fileList.appendChild(fileItem);
        });
    }

    function switchToFile(fileName) {
        saveCurrentFile();

        const file = fileManager.getFile(fileName);
        if (!file || !editorInstance) return;

        currentFile = fileName;
        editorInstance.setValue(file.content);
        monaco.editor.setModelLanguage(editorInstance.getModel(), file.language);

        if (!openTabs.includes(fileName)) {
            openTabs.push(fileName);
        }

        document.getElementById('language-select').value = file.language;
        document.getElementById('status-language').textContent = file.language.charAt(0).toUpperCase() + file.language.slice(1);

        renderFileList();
        renderTabs();
    }

    function renderTabs() {
        const tabsContainer = document.getElementById('editor-tabs');
        if (!tabsContainer) return;

        tabsContainer.innerHTML = '';
        openTabs.forEach(fileName => {
            const tab = document.createElement('button');
            tab.className = 'editor-tab' + (fileName === currentFile ? ' active' : '');
            tab.innerHTML = `
                <i class="fas fa-file-code"></i>
                <span>${fileName}</span>
                <span class="close-tab" onclick="closeTab(event, '${fileName}')">×</span>
            `;
            tab.addEventListener('click', (e) => {
                if (!e.target.classList.contains('close-tab')) {
                    switchToFile(fileName);
                }
            });
            tabsContainer.appendChild(tab);
        });
    }

    window.closeTab = function (event, fileName) {
        event.stopPropagation();
        const index = openTabs.indexOf(fileName);
        if (index > -1) {
            openTabs.splice(index, 1);
        }

        if (fileName === currentFile && openTabs.length > 0) {
            switchToFile(openTabs[0]);
        } else if (openTabs.length === 0) {
            const files = fileManager.getAllFiles();
            if (files.length > 0) {
                switchToFile(files[0].name);
            }
        }

        renderTabs();
    };

    window.deleteFile = function (fileName) {
        if (confirm(`Are you sure you want to delete ${fileName}?`)) {
            fileManager.deleteFile(fileName);
            closeTab(new Event('click'), fileName);
            renderFileList();
        }
    };

    function setupFileExplorerEvents() {
        const addFileBtn = document.getElementById('add-file-btn');
        if (addFileBtn) {
            addFileBtn.addEventListener('click', () => {
                const fileName = prompt('Enter file name (e.g., script.js, main.py):');
                if (!fileName) return;

                const ext = fileName.split('.').pop().toLowerCase();
                const langMap = {
                    'js': 'javascript',
                    'py': 'python',
                    'cpp': 'cpp',
                    'c': 'cpp',
                    'html': 'html',
                    'htm': 'html'
                };
                const language = langMap[ext] || 'javascript';

                if (fileManager.createFile(fileName, language)) {
                    renderFileList();
                    switchToFile(fileName);
                    showNotification(`File ${fileName} created successfully!`);
                }
            });
        }
    }

    function setupOutputTabs() {
        const outputTabs = document.querySelectorAll('.output-tab');
        outputTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');

                // Update active tab
                document.querySelectorAll('.output-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Update active content
                document.querySelectorAll('.output-content').forEach(c => c.classList.remove('active'));
                document.querySelector(`[data-content="${tabName}"]`).classList.add('active');

                // Update title
                document.getElementById('output-title').textContent = tab.textContent;
            });
        });
    }

    function showTemplateModal() {
        console.log('[Templates] Opening template modal');

        // Check if CodeTemplates is defined
        if (typeof CodeTemplates === 'undefined') {
            console.error('[Templates] CodeTemplates is not defined! Make sure templates.js is loaded.');
            showNotification('Error: Templates not loaded. Please refresh the page.');
            return;
        }

        const languageSelect = document.getElementById('language-select');
        if (!languageSelect) {
            console.error('[Templates] Language select not found');
            return;
        }

        const language = languageSelect.value;
        console.log('[Templates] Current language:', language);

        const templates = CodeTemplates[language] || {};
        const templateCount = Object.keys(templates).length;
        console.log('[Templates] Found', templateCount, 'templates for', language);

        if (templateCount === 0) {
            showNotification(`No templates available for ${language}`);
            return;
        }

        let templateHTML = '<div id="template-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 10000; display: flex; align-items: center; justify-content: center;" onclick="this.remove()">';
        templateHTML += '<div style="background: var(--card-bg); padding: 2rem; border-radius: 12px; max-width: 600px; max-height: 80vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.5);" onclick="event.stopPropagation()">';
        templateHTML += `<h2 style="margin-bottom: 1rem; color: var(--text-primary);">Code Templates - ${language}</h2>`;

        Object.keys(templates).forEach(templateName => {
            const template = templates[templateName];
            // Escape backticks and backslashes properly
            const escapedCode = template.code.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
            templateHTML += `
                <div style="margin-bottom: 1rem; padding: 1rem; background: var(--bg-color); border-radius: 8px; cursor: pointer; transition: all 0.2s ease;" 
                     onmouseover="this.style.transform='scale(1.02)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.2)';" 
                     onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none';" 
                     onclick="insertTemplate(\`${escapedCode}\`); document.getElementById('template-modal').remove(); console.log('[Templates] Template inserted: ${templateName}');">
                    <h4 style="color: var(--primary-accent); margin-bottom: 0.5rem;">${templateName}</h4>
                    <p style="color: var(--text-secondary); font-size: 0.875rem;">${template.description}</p>
                </div>
            `;
        });

        templateHTML += '<button onclick="document.getElementById(\'template-modal\').remove()" style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: var(--primary-accent); color: white; border: none; border-radius: 6px; cursor: pointer; width: 100%;">Close</button>';
        templateHTML += '</div></div>';

        document.body.insertAdjacentHTML('beforeend', templateHTML);
        console.log('[Templates] Modal inserted into DOM');
    }

    window.insertTemplate = function (code) {
        if (editorInstance) {
            editorInstance.setValue(code);
            saveCurrentFile();
        }
    };

    window.showNotification = function (message) {
        const notification = document.createElement('div');
        notification.style.cssText = 'position: fixed; bottom: 2rem; right: 2rem; background: var(--primary-accent); color: white; padding: 1rem 1.5rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 1000; animation: slideIn 0.3s ease;';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    };
});

// Global toggle theme function (called from HTML onclick)
function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i> Light Mode' : '<i class="fas fa-moon"></i> Dark Mode';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('vsp_user');
    window.location.href = ".vscode/login.html";
}

// Add slide animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);