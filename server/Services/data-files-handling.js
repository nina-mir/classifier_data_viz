const directory_name = require("../env.json").name;
// Import the filesystem module
const fs = require('fs');
const path = require('path');



// Function to get current filenames in directory
function get_filenames(){
    let filenames = fs.readdirSync(directory_name);
    // console.log("\nFilenames in directory:");
    // filenames.forEach((file) => {
    //     console.log("File:", file);
    // });
    // console.log(filenames, 'ninaaa');
    return filenames;
}

function read_file(file_name){
    var modelPath = path.join(__dirname, '..', directory_name, file_name);
    // console.log(modelPath);
    fs.readFile(modelPath, 'utf8' , (err, data) => {
        if (err) {
          console.error(err)
          return
        }
        var output = JSON.parse(data);
        // console.log(typeof(output));
        return output;
        // console.log(Object.keys(output));
    })    
}

module.exports = {
    get_filenames,
    read_file,
    directory_name
}



