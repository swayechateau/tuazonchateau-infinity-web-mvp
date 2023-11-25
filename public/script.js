const socket = io();


let username = '';
const msgInput = document.getElementById('message-input')
const messages = document.getElementById('messages');

async function fetchData() {
    try {
        const response = await fetch('http://localhost:3000/api'); // Replace with your API URL
        const data = await response.json();
        
        // Display the JSON response in a pre element
        data.messages.forEach(m => addMessage(m));
        
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


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
    fetchData()
}

function sendMessage() {
    const messageInput = msgInput
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
    addMessage(data)
});

msgInput.addEventListener("keydown", e => {
    if (e.code === "Enter") {  //checks whether the pressed key is "Enter"
        sendMessage(e);
    }
});

function addMessage(data) {
    const messages = document.getElementById('messages');
    const messageItem = document.createElement('li');
    messageItem.textContent = `${data.username}: ${data.content}`;
    messages.appendChild(messageItem);
}