const Express = require("express")();
const { SSL_OP_PKCS1_CHECK_1 } = require("constants");
const path = require('path');
const http = require("http").Server(Express);
const socketio = require("socket.io")(http, {
    cors: {
        // origin: '*',
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
})

// location to store data files
const directory_name = require("./env").name;


require('./Services/my-sockets')(socketio);


http.listen(3005, () => {
    console.log("Listening at :3005 ... ");
})