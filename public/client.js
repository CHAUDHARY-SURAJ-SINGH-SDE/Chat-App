const socket = io();
let name;
let textarea = document.querySelector('#textarea');
let messageArea = document.querySelector('.message__area');
do {
    name = prompt('Please enter your name: ');
} while (!name);

textarea.focus();
let lastSentTime = 0;

textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        const currentTime = new Date().getTime();
        const elapsedTime = currentTime - lastSentTime;

        if (elapsedTime > 10000) { // Checking if the elapsed time is more than 10 seconds (10000 milliseconds)
            sendMessage(e.target.value);
            lastSentTime = currentTime;
        } else {
            sendMessageWithoutName(e.target.value);
        }
    }
});

function sendMessage(message) {
    let msg = {
        user: name,
        message: message.trim()
    };
    appendMessage(msg, 'outgoing');
    textarea.value = '';
    scrollToBottom();
    socket.emit('message', msg);
}

function sendMessageWithoutName(message) {
    let msg = {
        message: message.trim()
    };
    appendMessage(msg, 'outgoing');
    textarea.value = '';
    scrollToBottom();
    socket.emit('message', msg);
}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div');
    let className = type;
    mainDiv.classList.add(className, 'message');

    let markup = `
        <h4>${type === 'outgoing' ? (isWithinTimeFrame() ? '' : 'You') : (msg.user ? msg.user : '')}</h4>
        <p>${msg.message}</p>
    `;
    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv);
}

function isWithinTimeFrame() {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - lastSentTime;
    return elapsedTime <= 10000; // Within 10 seconds (10000 milliseconds)
}

// Receive messages
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming');
    scrollToBottom();
});

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight;
}
