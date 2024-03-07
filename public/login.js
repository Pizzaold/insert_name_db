/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login as a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       401:
 *         description: Invalid username or password
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to login
 */

import { BASE_URL } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const name = formData.get('name');
        const password = formData.get('password');

        try {
            const response = await fetch(`${BASE_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, password })
            });

            if (response.ok) {
                console.log('Login successful');
                const { token } = await response.json();
                localStorage.setItem('token', token);
                window.location.href = 'in.html';
            } else {
                const data = await response.json();
                errorMessage.textContent = data.error || 'Failed to login';
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = 'in.html';
    }
});
