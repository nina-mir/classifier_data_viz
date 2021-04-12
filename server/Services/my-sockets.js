var f = require('./data-files-handling'); 
var c_matrix = require('./confusion-matrix-builder'); 


module.exports = (io)=>{
    var position = 15;

    io.on("connection", socket => {
        
        socket.load_in_data_files = false;
        socket.sentMydata = false;

        socket.on("set-up-data", function(data){
            console.log(data);
            c_matrix.load_in_data_files();
            // socket.emit(data.toString());
        })
        
        socket.on("accuracy", function(){
            console.log("yo yo yo nina! boo boo!");
            var accuracy = c_matrix.get_accuracy();
            socket.emit("accuracy_data_from_server", accuracy);
        })


        // console.log(socket.id); 
        // if (!socket.load_in_data_files){
        //     c_matrix.load_in_data_files();
        //     socket.load_in_data_files = true;
        // }

        socket.emit("position", position);

        if (!socket.sentMydata) { 
            socket.emit("data_files", c_matrix.get_num_models(), (response) => {
                console.log(response.status); // ok
                console.log("yeeeha");
                // console.log(f.get_filenames());
            });
            socket.sentMydata = true;
        }

        socket.on("file-upload", function(message){
            console.log(message.data);
            console.log(message.name);
            var writer = fs.createWriteStream(path.resolve(__dirname, './tmp/'+ message.name), {
                encoding: 'base64'
            });
            writer.write(message.data);
            writer.end();
        });
    })
};


// socket.emit("data_files", f.get_filenames(), (response) => {
            //     console.log(response.status); // ok
            //     console.log("yeeeha");
            //     // console.log(f.get_filenames());
            // });