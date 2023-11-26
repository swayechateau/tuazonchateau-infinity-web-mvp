const socket = io();


let username = '';

const messages = document.getElementById('messages');
let channel_data 
async function fetchData() {
    try {
        const response = await fetch('/api'); // Replace with your API URL
        const data = await response.json();
        console.log(data)
        channel_data = data
        const chan = data.channels[0]
        // Display the JSON response in a pre element
        setChannelName(chan.channel_name)
        setChannelImage(chan.channel_image, chan.channel_name)
        let meta = []
        chan.members.forEach(m => {
            meta.push(m.username)
        })
        setChannelMeta(meta.toString().replace(/,/g,", "))
        chan.messages.forEach(m => addMessage(m));
        scrollToMessage()
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

const inputUsername = document.getElementById('username');
inputUsername.addEventListener("keydown", function (e) {
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
    const message = msgInput.value.trim();
    if (message === '') return;

    socket.emit('chat message', { username, message });
    msgInput.value = '';
}

function logout() {
    username = '';
    loginContainer.classList.remove('hidden');
    chatContainer.classList.add('hidden');
}

socket.on('username', (data) => {
    console.log(data)
});

socket.on('chat message', (data) => {
    addMessage(data)
    if (isUserMsg(d)) {
        scrollToMessage()
    }
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
    let user = {
        profile_pic: "https://source.unsplash.com/random/50x50"
    }
    let pp = `
    <div class="inline-flex items-center justify-center w-12 h-12 mr-4 text-white transition-all duration-200 text-base ease-soft-in-out rounded-xl">
        <img src="${user.profile_pic}" alt="kal" class="w-full shadow-soft-2xl rounded-xl" alt="${data.username}">
    </div>
    `
    messageItem.innerHTML = `
    <div class="flex flex-wrap mb-6 -mx-3 ${isUserMsg(data) ? 'justify-end text-right' : 'justify-start'}">
        <div class="w-auto flex max-w-full px-3 flex-0">
            ${isUserMsg(data) ? '' : pp }
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

function scrollToMessage() {
    setTimeout(scrollToBottom(messages), 2000);
}

function scrollToBottom(divEl) {
    divEl.scrollTop = divEl.scrollHeight+1000
}

/**
 * page data
 */
function setChannelName(name) {
   const channel = document.getElementById("channel-name")
   channel.innerText = name.toUpperCase()
}

function setChannelMeta(m) {
    const meta = document.getElementById("channel-meta")
    meta.innerText = m
}

function setChannelImage(img, name) {
    const meta = document.getElementById("channel-image")
    meta.src = img
    meta.alt = name
}

/**
 * Time Formatter
 * @param {*} date 
 * @returns 
 */
const now = Date.now()
const rtf2 = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

function relTime(date) {
    let timeUnit = 'second'
    let timeDifference = calcSecond(now, date)
    if (timeDifference > 60) {
        timeUnit = 'minute'
        timeDifference = calcMinute(now, date)
    }

    if (timeUnit === 'minute' && timeDifference > 60) {
        timeUnit = 'hour'
        timeDifference = calcHour(now, date)
    }
    if (timeUnit === 'hour' && timeDifference > 24) {
        timeUnit = 'day'
        timeDifference = calcDay(now, date)
    }
    if (timeUnit === 'day' && timeDifference > 7) {
        timeUnit = 'week'
        timeDifference = calcWeek(now, date)
    }

    // Format the difference
    let t = rtf2.format(-timeDifference, timeUnit);

    if (timeUnit === 'week' && timeDifference > 1) {
        // stop using relative time
        // t = 
    }
    return t
}

function calcSecond(now, dateTime) {
    return Math.round((now - dateTime) / (1000))
}

function calcMinute(now, dateTime) {
    return Math.round((now - dateTime) / (1000 * 60))
}

function calcHour(now, dateTime) {
    return Math.round((now - dateTime) / (1000 * 60 * 60))
}

function calcDay(now, dateTime) {
    return Math.round((now - dateTime) / (1000 * 60 * 60 * 24))
}

function calcWeek(now, dateTime) {
    return Math.round((now - dateTime) / (1000 * 60 * 60 * 24 * 7))
}
