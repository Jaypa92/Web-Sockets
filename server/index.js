/* Imports needed for the website:
    
    Express: For its minimalistic light weight rules that allow
    more freedom along with its straightforward API.

    http: this module is used to create an HTTP server that works
    in conjunction with Socket.io

    Socket.io: it's a library that allows real time bidirectional
    communication between a client and a server using websockets.
    
    */
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

/*Websockets cannot be handled directly by an express server and
doesn't have built in Websocket handling which is the reason 
express is initiated, then http uses its createServer method
because express doesn't work directly with Websockets.*/

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const rooms ={};

/* A route for testing server connection. */

app.get('/', (req, res) => {
    res.send('Chatroom server is running!');
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join room', (room) => {
        if(!room || typeof room !== 'string'){
            socket.emit('error', 'Invalid room name');
            return;
        }

        if(!rooms[room]) {
            rooms[room] = [];
        }
        rooms[room].push(socket.id);
        socket.join(room);
        console.log(`User joined room: ${room}`);
    })

    socket.on('chat message', ({room, msg}) => {
        if(!room || !msg || typeof msg !== 'string'){
            socket.emit('error', 'Invalid message or room');
            return;
        }
        io.to(room).emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');

        for(let room in rooms){
            rooms[room] = rooms[room].filter(id => id !== socket.id);
        }
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})