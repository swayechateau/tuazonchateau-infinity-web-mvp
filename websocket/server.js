const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const { saveMessage } = require('./data');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname+"/public"));

io.on('connection', socket => {
    console.log('A user connected');
    socket.on('username', user => {
        console.log(user)
    })

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('chat message', message => {
        message.content = message.message
        delete message.message
        message.sent = Date.now()
        message.username = message.username.toLowerCase()
        saveMessage({
            channel_id: 1,
            message:message
        })
        io.emit('chat message', message);
    });
});

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});

