const socket = io();

let username = '';

function login() {
    const inputUsername = document.getElementById('username');
    const loginContainer = document.querySelector('.login-container');
    const chatContainer = document.querySelector('.chat-container');
    const currentUser = document.getElementById('current-user');

    username = inputUsername.value.trim();
    if (username === '') return;

    loginContainer.style.display = 'none';
    chatContainer.style.display = 'block';
    currentUser.textContent = username;
}

function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const messages = document.getElementById('messages');

    const message = messageInput.value.trim();
    if (message === '') return;

    socket.emit('chat message', { username, message });
    messageInput.value = '';
}

function logout() {
    const loginContainer = document.querySelector('.login-container');
    const chatContainer = document.querySelector('.chat-container');
    
    username = '';
    loginContainer.style.display = 'block';
    chatContainer.style.display = 'none';
}

socket.on('chat message', (data) => {
    const messages = document.getElementById('messages');
    const messageItem = document.createElement('li');
    messageItem.textContent = `${data.username}: ${data.message}`;
    messages.appendChild(messageItem);
});
