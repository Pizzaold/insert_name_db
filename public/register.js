import { BASE_URL } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('userForm');
    const errorMessage = document.getElementById('errorMessage');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const name = formData.get('name');
        const password = formData.get('password');
        const password2 = formData.get('password2');

        if (password !== password2) {
            errorMessage.textContent = 'Passwords do not match';
            return;
        } else {
            errorMessage.textContent = ''
        }

        try {
            const response = await fetch(`${BASE_URL}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, password })
            });
        
            if (response.ok) {
                console.log('User saved successfully');
                const { token } = await response.json();
                localStorage.setItem('token', token);
                window.location.href = 'in.html';
            } else {
                const data = await response.json();
                if (data.error === 'Username already taken') {
                    errorMessage.textContent = 'Username already taken';
                } else {
                    console.error('Failed to save user');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            console.log('Response Text:', await response.text());
        }        
    });
});
