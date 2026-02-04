const addNewMessage = require("./event/addNewMessage");
const getAllPrevMessage = require("./event/getAllPrevMessage");
const userDetailEvent = require("./event/userDetailEvent");
const welcomeEvent = require("./event/welcomeEvent");




// socketConnection.js
const initializeSocketConnection = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected', socket.id);

        // Welcome event
        welcomeEvent(socket);

        // User Detail event
        socket.on('userDetail', (user) => {
            getAllPrevMessage(socket,io,user)
            userDetailEvent(socket, io, user);
            addNewMessage(socket, io, user)
        });
    });
};

module.exports = initializeSocketConnection;
