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
        });
        
        socket.on("accuracy", function(){
            console.log("yo yo yo nina! boo boo!");
            var accuracy = c_matrix.get_accuracy();
            socket.emit("accuracy_data_from_server", accuracy);
        });

        socket.on("precision", function(){
            console.log("precision precision nina! boo boo!");
            var accuracy = c_matrix.get_precision();
            socket.emit("precision_data_from_server", accuracy);
        })
        
        socket.on("recall", function(){
            console.log("recall nina! boo boo!");
            var recall = c_matrix.get_recall();
            socket.emit("recall_data_from_server", recall);
        })

        socket.on("f1-score", function(){
            console.log("f1-score !\n\n");
            var f1_score = c_matrix.get_f1();
            socket.emit("f1-score_data_from_server", f1_score);
        })

        socket.on("specificity", function(){
            console.log("specificity!\n\n");
            var specificity = c_matrix.get_specificity();
            socket.emit("specificity_data_from_server", specificity);
        })

        socket.on("fpr", function(){
            console.log("fpr!\n\n");
            var fpr = c_matrix.get_FPR();
            socket.emit("fpr_data_from_server", fpr);
        })

        socket.on("fnr", function(){
            console.log("fnr!\n\n");
            var fnr = c_matrix.get_FNR();
            socket.emit("fnr_data_from_server", fnr);
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
