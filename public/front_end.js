document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('userForm');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const name = formData.get('name');
        const password = formData.get('password');

        try {
            const response = await fetch('http://localhost:3000/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, password })
            });

            if (response.ok) {
                console.log('User saved successfully');
            } else {
                console.error('Failed to save user');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
