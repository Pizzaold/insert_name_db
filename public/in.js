document.addEventListener('DOMContentLoaded', () => {

document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
});

const token = localStorage.getItem('token');
if (token) {
    try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const username = decodedToken.name;
        const loggedInMessage = document.getElementById('loggedInMessage');
        loggedInMessage.textContent = `You are logged in as ${username}`;
    } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
        console.error('Token removed');
    }
} else {
    console.error('Token not found');
}
});