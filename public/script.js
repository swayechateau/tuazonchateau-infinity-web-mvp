const socket = io();


let username = '';

const messages = document.getElementById('messages');

async function fetchData() {
    try {
        const response = await fetch('/api'); // Replace with your API URL
        const data = await response.json();

        // Display the JSON response in a pre element
        data.messages.forEach(m => addMessage(m));

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

const inputUsername = document.getElementById('username');
inputUsername.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        login(e);
    }
})
const msgInput = document.getElementById('message-input')
msgInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        sendMessage(e);
    }
});

const loginContainer = document.querySelector('#login');
const chatContainer = document.querySelector('#chat');

function login() {
    const currentUser = document.getElementById('current-user');

    username = inputUsername.value.trim();
    if (username === '') return;

    loginContainer.classList.add('hidden');
    chatContainer.classList.remove('hidden');
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
    username = '';
    loginContainer.classList.remove('hidden');
    chatContainer.classList.add('hidden');
}

socket.on('chat message', (data) => {
    addMessage(data)
});

function addMessage(data) {
    const messages = document.getElementById('messages');
    const messageItem = messageTemplate(data)
    messages.appendChild(messageItem);
}

function messageTemplate(data) {
    const messageItem = document.createElement('div');
    el = ['flex', 'flex-wrap', 'mb-6', '-mx-3']
    if (isUserMsg(data)) {
        el.push('justify-end')
        el.push('text-right')
    } else {
        el.push('justify-start')
    }
    messageItem.classList.add(el)
    messageItem.innerHTML = `
    <div class="flex flex-wrap mb-6 -mx-3 ${isUserMsg(data) ? 'justify-end text-right' : 'justify-start'}">
        <div class="w-auto max-w-full px-3 flex-0">
            <div class="relative flex flex-col min-w-0 break-words border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border ${isUserMsg(data) ? 'bg-gray-200' : 'bg-white'}">
                <div class="flex-auto px-4 py-2">
                    ${isUserMsg(data) ? '' : '<p class="py-1 text-sm capitalize">' + data.username + '</p>'}
                    <p class="mb-1"> 
                        ${data.content}
                    </p>
                    <!-- user: justify-end -->
                    <div class="flex items-center text-sm leading-normal opacity-60 ${isUserMsg(data) ? 'justify-end' : ''}">
                        <i class="mr-1 text-sm leading-normal ni ni-check-bold"></i>
                        <small>${relTime(data.sent)}</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
    return messageItem
}

function isUserMsg(d) {
    return d.username == username.toLowerCase() ? true : false
}


function relTime(date) {
    const now = Date.now()
    const rtf2 = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

    let timeUnit = 'hour'
    let timeDifference = calcHour(now, date)

    // Format the difference
    return rtf2.format(-timeDifference, timeUnit);
}

function calcHour(now, dateTime) {
    return Math.round((now - dateTime) / (1000 * 60 * 60))
}

function calcDay(now, dateTime) {
    return Math.round((now - dateTime) / (1000 * 60 * 60 * 24))
}