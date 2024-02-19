document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('nameForm');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const name = formData.get('name');

        try {
            const response = await fetch('http://localhost:3000/api/name', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name })
            });

            if (response.ok) {
                console.log('Name saved successfully');
            } else {
                console.error('Failed to save name');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
