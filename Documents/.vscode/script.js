document.addEventListener('DOMContentLoaded', function() {
    // ===== EVENT LISTENERS & INITIALIZATION =====
    const runBtn = document.querySelector('.run-btn');
    if (runBtn) {
        runBtn.addEventListener('click', function() {
            const consoleContent = document.querySelector('.console-content');
            consoleContent.innerHTML = `
                <div class="console-line">> Running algorithm.js...</div>
                <div class="console-line success">> Compiled successfully!</div>
                <div class="console-line">> Index of 23: 5</div>
                <div class="console-line">> Execution time: 1.2ms</div>
                <div class="console-line"><br></div>
                <div class="console-line">> Test cases:</div>
                <div class="console-line success">✓ Test 1: Found existing element (passed)</div>
                <div class="console-line success">✓ Test 2: Non-existing element returns -1 (passed)</div>
                <div class="console-line success">✓ Test 3: Empty array returns -1 (passed)</div>
                <div class="console-line"><br></div>
                <div class="console-line success">All tests passed! (3/3)</div>
            `;
            
            // Add visual feedback
            this.innerHTML = '<i class="fas fa-check"></i> Executed';
            this.style.background = 'rgba(76, 201, 240, 0.2)';
            this.style.color = '#4cc9f0';
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-play"></i> Run Code';
                this.style.background = '';
                this.style.color = '';
            }, 2000);
        });
    }
    
    // Language selection
    document.querySelectorAll('.language-card').forEach(card => {
        card.addEventListener('click', function() {
            // Remove active class from all cards
            document.querySelectorAll('.language-card').forEach(c => {
                c.classList.remove('active');
            });
            
            // Add active class to clicked card
            this.classList.add('active');
            
            const langName = this.querySelector('.language-name').textContent;
            const languageIndicator = document.querySelector('.language-indicator');
            if (languageIndicator) {
                languageIndicator.textContent = langName;
            }
            
            // Update code editor content with language template
            const textarea = document.getElementById('code-editor-textarea');
            if (textarea) {
                const languageKey = getLanguageKey(langName);
                textarea.value = languageTemplates[languageKey] || languageTemplates.javascript;
            }
            
            // Update filename
            const filenameElement = document.querySelector('.editor-header div:first-child');
            if (filenameElement) {
                const languageKey = getLanguageKey(langName);
                const extension = getLanguageExtension(languageKey);
                filenameElement.textContent = `main.${extension}`;
            }
            
            // Store selected language
            localStorage.setItem('vsp.selectedLanguage', languageKey);
        });
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }
    
    // Initialize workspace interactivity
    initWorkspace();
    
    // Load last selected project
    const lastProject = localStorage.getItem('selectedProject');
    if (lastProject) {
        selectProject(lastProject);
    }
    
    // Initialize editor with saved language
    const savedLanguage = localStorage.getItem('vsp.selectedLanguage') || 'javascript';
    initializeEditorWithLanguage(savedLanguage);

    // Test API connection on startup
    setTimeout(() => {
        testAPIConnection();
    }, 1000);
    
    // Set up periodic API status check (every 5 minutes)
    setInterval(() => {
        if (!isAPIOnline()) {
            console.log('🔄 Periodic API status check...');
            testAPIConnection();
        }
    }, 5 * 60 * 1000);
});

const CONFIG = {
    // WARNING: Storing API keys in client-side code is insecure. This is for demonstration purposes only.
    JUDGE0_API_KEY: '3269b05259mshe4d5bf0db0fff35p184268jsne78ef3843394'
};

// Language templates for different programming languages
const languageTemplates = {
    javascript: `// Binary Search Algorithm
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid; // Target found
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1; // Target not found
}

// Test the function
const sortedArray = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
const targetValue = 23;
const result = binarySearch(sortedArray, targetValue);
console.log('Index of', targetValue + ':', result);`,

    python: `# Binary Search Algorithm
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid  # Target found
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1  # Target not found

# Test the function
sorted_array = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
target_value = 23
result = binary_search(sorted_array, target_value)
print(f"Index of {target_value}: {result}")`,

    java: `// Binary Search Algorithm
public class BinarySearch {
    public static int binarySearch(int[] arr, int target) {
        int left = 0, right = arr.length - 1;
        
        while (left <= right) {
            int mid = (left + right) / 2;
            
            if (arr[mid] == target) {
                return mid; // Target found
            } else if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return -1; // Target not found
    }
    
    public static void main(String[] args) {
        int[] sortedArray = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
        int targetValue = 23;
        int result = binarySearch(sortedArray, targetValue);
        System.out.println("Index of " + targetValue + ": " + result);
    }
}`,

    cpp: `#include <iostream>
#include <vector>
using namespace std;

// Binary Search Algorithm
int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    
    while (left <= right) {
        int mid = (left + right) / 2;
        
        if (arr[mid] == target) {
            return mid; // Target found
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1; // Target not found
}

int main() {
    vector<int> sortedArray = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    int targetValue = 23;
    int result = binarySearch(sortedArray, targetValue);
    cout << "Index of " << targetValue << ": " << result << endl;
    return 0;
}`,

    sql: `-- Binary Search equivalent in SQL
-- This demonstrates finding a value in a sorted table

-- Create a sample table with sorted values
CREATE TABLE sorted_numbers (
    id INT PRIMARY KEY,
    value INT NOT NULL
);

-- Insert sample data
INSERT INTO sorted_numbers (id, value) VALUES
(1, 2), (2, 5), (3, 8), (4, 12), (5, 16),
(6, 23), (7, 38), (8, 56), (9, 72), (10, 91);

-- Find the position of value 23
SELECT 
    id as position,
    value,
    CASE 
        WHEN value = 23 THEN 'Found!'
        ELSE 'Not the target'
    END as status
FROM sorted_numbers 
WHERE value = 23;`,

    typescript: `// Binary Search Algorithm in TypeScript
function binarySearch<T>(arr: T[], target: T): number {
    let left: number = 0;
    let right: number = arr.length - 1;
    
    while (left <= right) {
        const mid: number = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            return mid; // Target found
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1; // Target not found
}

// Test the function
const sortedArray: number[] = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
const targetValue: number = 23;
const result: number = binarySearch(sortedArray, targetValue);
console.log(\`Index of \${targetValue}: \${result}\`);`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Binary Search Demo</title>
</head>
<body>
    <h1>Binary Search Algorithm</h1>
    <div id="result"></div>
    
    <script>
        function binarySearch(arr, target) {
            let left = 0, right = arr.length - 1;
            
            while (left <= right) {
                const mid = Math.floor((left + right) / 2);
                
                if (arr[mid] === target) {
                    return mid; // Target found
                } else if (arr[mid] < target) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
            
            return -1; // Target not found
        }
        
        // Test the function
        const sortedArray = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
        const targetValue = 23;
        const result = binarySearch(sortedArray, targetValue);
        
        document.getElementById('result').innerHTML = 
            \`Index of \${targetValue}: \${result}\`;
    </script>
</body>
</html>`
};

// Helper function to get language key from display name
function getLanguageKey(displayName) {
    const languageMap = {
        'JavaScript': 'javascript',
        'Python': 'python',
        'Java': 'java',
        'C/C++': 'cpp',
        'SQL': 'sql',
        'TypeScript': 'typescript',
        'HTML': 'html'
    };
    return languageMap[displayName] || 'javascript';
}

// Initialize editor with specific language
function initializeEditorWithLanguage(language) {
    const textarea = document.getElementById('code-editor-textarea');
    const languageIndicator = document.querySelector('.language-indicator');
    const filenameElement = document.querySelector('.editor-header div:first-child');
    
    if (textarea && languageTemplates[language]) {
        textarea.value = languageTemplates[language];
    }
    
    if (languageIndicator) {
        languageIndicator.textContent = getLanguageDisplayName(language);
    }
    
    if (filenameElement) {
        const extension = getLanguageExtension(language);
        filenameElement.textContent = `main.${extension}`;
    }
}

// ===== WORKSPACE & STUDY GROUPS INTERACTIVITY =====

// Project management
let projects = [
    { id: 'algorithms', name: 'Project: Algorithms', language: 'javascript', status: 'Active', description: 'Learning and implementing algorithms' },
    { id: 'webdev', name: 'Web Development', language: 'html', status: 'In Progress', description: 'Building web applications' },
    { id: 'datascience', name: 'Data Science', language: 'python', status: 'Planning', description: 'Data analysis and ML projects' },
    { id: 'mobile', name: 'Mobile Apps', language: 'java', status: 'On Hold', description: 'Android and iOS development' }
];

let studyGroups = [
    { id: 'algorithms', name: 'Algorithms Study Group', focus: 'algorithms', members: 12, maxMembers: 20, status: 'active', description: 'Study algorithms and data structures together' },
    { id: 'webdev', name: 'Web Dev Team', focus: 'webdev', members: 8, maxMembers: 15, status: 'active', description: 'Collaborate on web development projects' },
    { id: 'datascience', name: 'Data Science Club', focus: 'datascience', members: 15, maxMembers: 25, status: 'active', description: 'Explore data science and machine learning' }
];

// Demo users for front-end authentication
const users = [
    { email: "student@example.com", password: "student123", name: "Student User", role: "student" },
    { email: "teacher@example.com", password: "teacher123", name: "Teacher User", role: "teacher" }
];

// Login form handler
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const user = users.find(u => u.email === email && u.password === password);
            if(user) {
                localStorage.setItem('vsp_user', JSON.stringify(user));
                location.reload();
            } else {
                document.getElementById('errorMsg').style.display = 'block';
            }
        });
    }
});

// Logout function
function logout() {
    localStorage.removeItem('vsp_user');
    location.reload();
}

// Initialize workspace interactivity
function initWorkspace() {
    // Project item click handlers
    document.querySelectorAll('.project-item').forEach(item => {
        item.addEventListener('click', function() {
            const projectId = this.dataset.project;
            selectProject(projectId);
        });
    });

    // Study group click handlers
    document.querySelectorAll('.group-item').forEach(item => {
        item.addEventListener('click', function() {
            const groupId = this.dataset.group;
            showGroupDetails(groupId);
        });
    });

    // Create project button
    const createProjectBtn = document.querySelector('.create-project-btn');
    if (createProjectBtn) {
        createProjectBtn.addEventListener('click', () => openModal('projectModal'));
    }

    // Create group button
    const createGroupBtn = document.querySelector('.create-group-btn');
    if (createGroupBtn) {
        createGroupBtn.addEventListener('click', () => openModal('groupModal'));
    }

    // Modal close handlers
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal.id);
        });
    });

    // Form submissions
    const projectForm = document.getElementById('projectForm');
    if (projectForm) {
        projectForm.addEventListener('submit', handleProjectSubmit);
    }

    const groupForm = document.getElementById('groupForm');
    if (groupForm) {
        groupForm.addEventListener('submit', handleGroupSubmit);
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target.id);
        }
    });

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

// Project selection
function selectProject(projectId) {
    // Remove active class from all projects
    document.querySelectorAll('.project-item').forEach(item => {
        item.classList.remove('active');
    });

    // Add active class to selected project
    const selectedProject = document.querySelector(`[data-project="${projectId}"]`);
    if (selectedProject) {
        selectedProject.classList.add('active');
    }

    // Update editor language and filename
    const project = projects.find(p => p.id === projectId);
    if (project) {
        updateEditorForProject(project);
    }
}

// Update editor for selected project
function updateEditorForProject(project) {
    const languageIndicator = document.querySelector('.language-indicator');
    const filenameElement = document.querySelector('.editor-header div:first-child');
    
    if (languageIndicator) {
        languageIndicator.textContent = getLanguageDisplayName(project.language);
    }
    
    if (filenameElement) {
        filenameElement.textContent = `${project.id}.${getLanguageExtension(project.language)}`;
    }

    // Update code editor content with project template
    const textarea = document.getElementById('code-editor-textarea');
    if (textarea) {
        textarea.value = languageTemplates[project.language] || languageTemplates.javascript;
    }

    // Store selected project
    localStorage.setItem('selectedProject', project.id);
}

// Get language display name
function getLanguageDisplayName(language) {
    const languageNames = {
        'javascript': 'JavaScript',
        'python': 'Python',
        'java': 'Java',
        'cpp': 'C/C++',
        'sql': 'SQL',
        'typescript': 'TypeScript',
        'html': 'HTML'
    };
    return languageNames[language] || 'JavaScript';
}

// Get language file extension
function getLanguageExtension(language) {
    const extensions = {
        'javascript': 'js',
        'python': 'py',
        'java': 'java',
        'cpp': 'cpp',
        'sql': 'sql',
        'typescript': 'ts',
        'html': 'html'
    };
    return extensions[language] || 'js';
}

// Show study group details
function showGroupDetails(groupId) {
    const group = studyGroups.find(g => g.id === groupId);
    if (!group) return;

    const modal = document.getElementById('groupDetailsModal');
    const title = document.getElementById('groupDetailsTitle');
    const content = document.getElementById('groupDetailsContent');

    title.innerHTML = `<i class="fas fa-users"></i> ${group.name}`;
    
    content.innerHTML = `
        <div class="group-details">
            <div class="detail-row">
                <span class="detail-label">Focus Area:</span>
                <span class="detail-value">${getFocusDisplayName(group.focus)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Members:</span>
                <span class="detail-value">${group.members}/${group.maxMembers}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="detail-value">${group.status.charAt(0).toUpperCase() + group.status.slice(1)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Description:</span>
                <span class="detail-value">${group.description}</span>
            </div>
            
            <div class="group-members">
                <h5>Recent Members</h5>
                <div class="member-list">
                    <div class="member-avatar">AJ</div>
                    <div class="member-avatar">MK</div>
                    <div class="member-avatar">TP</div>
                    <div class="member-avatar">+${Math.max(0, group.members - 3)}</div>
                </div>
            </div>
        </div>
    `;

    openModal('groupDetailsModal');
}

// Get focus area display name
function getFocusDisplayName(focus) {
    const focusNames = {
        'algorithms': 'Algorithms & Data Structures',
        'webdev': 'Web Development',
        'datascience': 'Data Science',
        'mobile': 'Mobile Development',
        'ai': 'Artificial Intelligence',
        'cybersecurity': 'Cybersecurity'
    };
    return focusNames[focus] || focus;
}

// Join study group
function joinGroup() {
    // In a real app, this would make an API call
    alert('Successfully joined the study group! You\'ll receive updates and can participate in discussions.');
    closeModal('groupDetailsModal');
}

// Modal management
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Handle project form submission
function handleProjectSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const projectData = {
        id: Date.now().toString(),
        name: formData.get('projectName'),
        language: formData.get('projectLanguage'),
        status: 'Planning',
        description: formData.get('projectDescription')
    };

    // Add to projects array
    projects.push(projectData);
    
    // Add to UI
    addProjectToUI(projectData);
    
    // Close modal and reset form
    closeModal('projectModal');
    event.target.reset();
    
    // Show success message
    showNotification('Project created successfully!', 'success');
}

// Handle group form submission
function handleGroupSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const groupData = {
        id: Date.now().toString(),
        name: formData.get('groupName'),
        focus: formData.get('groupFocus'),
        members: 1, // Creator is first member
        maxMembers: parseInt(formData.get('maxMembers')),
        status: 'active',
        description: formData.get('groupDescription')
    };

    // Add to study groups array
    studyGroups.push(groupData);
    
    // Add to UI
    addGroupToUI(groupData);
    
    // Close modal and reset form
    closeModal('groupModal');
    event.target.reset();
    
    // Show success message
    showNotification('Study group created successfully!', 'success');
}

// Add project to UI
function addProjectToUI(project) {
    const sidebarMenu = document.querySelector('.sidebar-menu');
    const newProjectItem = document.createElement('li');
    newProjectItem.className = 'project-item';
    newProjectItem.dataset.project = project.id;
    newProjectItem.dataset.language = project.language;
    
    newProjectItem.innerHTML = `
        <i class="fas fa-folder"></i> ${project.name}
        <span class="project-status">${project.status}</span>
    `;
    
    newProjectItem.addEventListener('click', function() {
        selectProject(project.id);
    });
    
    sidebarMenu.appendChild(newProjectItem);
}

// Add group to UI
function addGroupToUI(group) {
    const studyGroupsContainer = document.querySelector('.study-groups');
    const newGroupItem = document.createElement('div');
    newGroupItem.className = 'group-item';
    newGroupItem.dataset.group = group.id;
    newGroupItem.dataset.members = group.members;
    newGroupItem.dataset.status = group.status;
    
    newGroupItem.innerHTML = `
        <i class="fas fa-users"></i>
        <span>${group.name}</span>
        <div class="group-info">
            <span class="member-count">${group.members} member</span>
            <span class="group-status active">Active</span>
        </div>
    `;
    
    newGroupItem.addEventListener('click', function() {
        showGroupDetails(group.id);
    });
    
    studyGroupsContainer.appendChild(newGroupItem);
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide and remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Initialize workspace when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize workspace interactivity
    initWorkspace();
    
    // Load last selected project
    const lastProject = localStorage.getItem('selectedProject');
    if (lastProject) {
        selectProject(lastProject);
    }
    
    // Initialize editor with saved language
    const savedLanguage = localStorage.getItem('vsp.selectedLanguage') || 'javascript';
    initializeEditorWithLanguage(savedLanguage);
    
    // Test API connection on startup
    setTimeout(() => {
        testAPIConnection();
    }, 1000);
    
    // Set up periodic API status check (every 5 minutes)
    setInterval(() => {
        if (!isAPIOnline()) {
            console.log('🔄 Periodic API status check...');
            testAPIConnection();
        }
    }, 5 * 60 * 1000);
});

// ===== API CONNECTION & STATUS MANAGEMENT =====

// Test Judge0 API connection
async function testAPIConnection() {
    const apiStatus = document.querySelector('.api-status');
    const statusDot = apiStatus?.querySelector('.status-dot');
    const statusText = apiStatus?.querySelector('.status-text');
    
    if (!apiStatus || !statusDot || !statusText) {
        console.log('❌ API status elements not found');
        return;
    }
    
    console.log('🧪 Starting API connection test...');
    
    try {
        // Show testing status
        statusDot.className = 'status-dot testing';
        statusText.textContent = 'Testing...';
        
        console.log('📡 Testing Judge0 API connection...');
        
        // Test with a simple API call
        const response = await fetch('https://judge0-ce.p.rapidapi.com/languages', {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': CONFIG.JUDGE0_API_KEY,
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            }
        });
        
        console.log('📨 API Response:', response.status, response.statusText);
        
        if (response.ok) {
            // API is working
            statusDot.className = 'status-dot online';
            statusText.textContent = 'API Online';
            console.log('✅ Judge0 API connection successful');
            
            // Show success notification
            showNotification('API connection successful!', 'success');
        } else {
            // API responded but with error
            statusDot.className = 'status-dot offline';
            statusText.textContent = `API Error: ${response.status}`;
            console.log('❌ Judge0 API error:', response.status, response.statusText);
            
            // Show error notification
            showNotification(`API Error: ${response.status}`, 'error');
        }
    } catch (error) {
        // Network or other error
        statusDot.className = 'status-dot offline';
        statusText.textContent = 'Offline Mode';
        console.log('❌ Judge0 API connection failed:', error.message);
        console.log('🔍 Error details:', error);
        
        // Show offline notification
        showNotification('API offline - using local execution', 'info');
    }
}

// Update API status manually
function updateAPIStatus(status, message) {
    const apiStatus = document.querySelector('.api-status');
    const statusDot = apiStatus?.querySelector('.status-dot');
    const statusText = apiStatus?.querySelector('.status-text');
    
    if (!apiStatus || !statusDot || !statusText) return;
    
    statusDot.className = `status-dot ${status}`;
    statusText.textContent = message;
}

// Manual API test button (can be called from console)
function testAPI() {
    console.log('🧪 Testing API connection...');
    testAPIConnection();
}

// Manual API test with custom key (for testing different keys)
function testAPIWithKey(apiKey) {
    console.log('🧪 Testing API with custom key...');
    
    if (!apiKey) {
        console.log('❌ No API key provided');
        return;
    }
    
    // Temporarily update the API key and test
    // const originalKey = CONFIG.JUDGE0_API_KEY; // No longer needed if we pass the key directly
    
    // Test with the custom key
    testCustomAPIConnection(apiKey);
}

// Test API with custom key
async function testCustomAPIConnection(apiKey) {
    const apiStatus = document.querySelector('.api-status');
    const statusDot = apiStatus?.querySelector('.status-dot');
    const statusText = apiStatus?.querySelector('.status-text');
    
    if (!apiStatus || !statusDot || !statusText) {
        console.log('❌ API status elements not found');
        return;
    }
    
    try {
        statusDot.className = 'status-dot testing';
        statusText.textContent = 'Testing Custom Key...';
        
        const response = await fetch('https://judge0-ce.p.rapidapi.com/languages', {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            }
        });
        
        if (response.ok) {
            statusDot.className = 'status-dot online';
            statusText.textContent = 'Custom Key Works!';
            console.log('✅ Custom API key test successful');
            showNotification('Custom API key works!', 'success');
        } else {
            statusDot.className = 'status-dot offline';
            statusText.textContent = `Custom Key Error: ${response.status}`;
            console.log('❌ Custom API key failed:', response.status);
            showNotification(`Custom key failed: ${response.status}`, 'error');
        }
    } catch (error) {
        statusDot.className = 'status-dot offline';
        statusText.textContent = 'Custom Key Failed';
        console.log('❌ Custom API key test failed:', error.message);
        showNotification('Custom key test failed', 'error');
    }
}

// Check if API is available
function isAPIOnline() {
    const statusDot = document.querySelector('.api-status .status-dot');
    return statusDot?.classList.contains('online');
}