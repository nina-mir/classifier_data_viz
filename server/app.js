const Express = require("express")();
const { SSL_OP_PKCS1_CHECK_1 } = require("constants");
const path = require('path');
const http = require("http").Server(Express);
const socketio = require("socket.io")(http, {
    cors: {
        // origin: '*',
        origin: "http://localhost:8080",
        methods: ["GET", "POST"]
    }
})

// location to store data files
const directory_name = require("./env").name;

//require('./Services/interface')(directory_name);

require('./Services/my-sockets')(socketio);

// socketio.on("connection", socket => {
//     require('./Services/my-sockets')(socketio);

//     // socket.emit("position", position);
//     // socket.emit("data_files", filenames.length);
//     // socket.on("file-upload", function(message){
//     //     console.log(message.data);
//     //     console.log(message.name);
//     //     var writer = fs.createWriteStream(path.resolve(__dirname, './tmp/'+ message.name), {
//     //         encoding: 'base64'
//     //     });
//     //     writer.write(message.data);
//     //     writer.end();
//     // });
// })


http.listen(3000, () => {
    console.log("Listening at :3000 ... ");
})