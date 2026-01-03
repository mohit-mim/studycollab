// Using native fetch

const BASE_URL = 'http://localhost:5000/api';

async function registerUser() {
    try {
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Mohit',
                email: 'mohit12@example.com',
                password: 'mohit1234'
            })
        });

        const data = await response.json();
        console.log('Response:', data);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

registerUser();
