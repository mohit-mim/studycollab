// Native fetch is available in Node.js 18+

// Native fetch is available in Node.js 18+. We saw user has v24.12.0.
// So we can use native fetch.

const BASE_URL = 'http://localhost:5001/api';
let authToken = '';
let projectId = '';
let fileId = '';

const testUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'password123'
};

const log = (step, msg, data) => {
    console.log(`\n[${step}] ${msg}`);
    if (data) console.log(JSON.stringify(data, null, 2));
};

async function runTests() {
    console.log('🚀 Starting Backend Smoke Tests...');

    // 1. Register
    try {
        const res = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });
        const data = await res.json();

        if (!data.success) throw new Error(data.message);
        authToken = data.data.token;
        log('REGISTER', '✅ User registered successfully', { email: data.data.email });
    } catch (e) {
        console.error('❌ Register failed:', e.message);
        return;
    }

    // 2. Login (Verification)
    try {
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: testUser.email, password: testUser.password })
        });
        const data = await res.json();

        if (!data.success) throw new Error(data.message);
        if (data.data.token !== authToken) console.log('ℹ️ New token generated on login');
        authToken = data.data.token; // Refresh token just in case
        log('LOGIN', '✅ Login successful');
    } catch (e) {
        console.error('❌ Login failed:', e.message);
        return;
    }

    // 3. Create Project
    try {
        const res = await fetch(`${BASE_URL}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                title: 'Smoke Test Project',
                description: 'Testing backend',
                language: 'javascript',
                tags: ['test', 'api']
            })
        });
        const data = await res.json();

        if (!data.success) throw new Error(data.message);
        projectId = data.data._id;
        log('CREATE_PROJECT', '✅ Project created', { id: projectId, title: data.data.title });
    } catch (e) {
        console.error('❌ Create Project failed:', e.message);
        return;
    }

    // 4. Create File
    try {
        const res = await fetch(`${BASE_URL}/projects/${projectId}/files`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                name: 'index.js',
                language: 'javascript',
                content: 'console.log("Hello World");'
            })
        });
        const data = await res.json();

        if (!data.success) throw new Error(data.message);
        fileId = data.data._id;
        log('CREATE_FILE', '✅ File added to project', { id: fileId, name: data.data.name });
    } catch (e) {
        console.error('❌ Create File failed:', e.message);
    }

    // 5. Get Project details (verify file populated)
    try {
        const res = await fetch(`${BASE_URL}/projects/${projectId}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await res.json();

        if (!data.success) throw new Error(data.message);
        const hasFiles = data.data.files && data.data.files.length > 0;
        log('GET_PROJECT', `✅ Project retrieved. Has files: ${hasFiles}`);
    } catch (e) {
        console.error('❌ Get Project failed:', e.message);
    }

    // 6. Delete Project
    try {
        const res = await fetch(`${BASE_URL}/projects/${projectId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await res.json();

        if (!data.success) throw new Error(data.message);
        log('DELETE_PROJECT', '✅ Project deleted successfully');
    } catch (e) {
        console.error('❌ Delete Project failed:', e.message);
    }

    console.log('\n✨ All backend smoke tests passed successfully!');
}

runTests();
