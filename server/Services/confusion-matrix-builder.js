// Import the filesystem module
const fs = require('fs');
const path = require('path');

const directory_name = require("../env.json").name;
var ground_input = {};
var accuracy_flag = false;
// composite confusion matrix object that includes confusion matrix of all models 
// (key, value) = "model-i": [TP, TN, FP, FN]
// each TP, TN, FP and FN are arrays of num_classes' size
var cm_object={};
var accuracy_object={};
var precision_object={};

function get_accuracy(){
    return accuracy_object;
}

function get_precision(){
    return precision_object;
}


var groundPath = path.join(__dirname, '..', directory_name, 'ground-truth.json');

// number of classes
var num_classes = 1000;
let filenames = fs.readdirSync(path.join(__dirname, '..', directory_name));

function _path(fileName){
    return path.join(__dirname, '..', directory_name, fileName);
}

function get_num_models(){
    return filenames.slice(1);
}

// read all data files' promise array
var promises= filenames.map(function(_path){
    return new Promise(function(_path, resolve, reject){
        var modelPath = path.join(__dirname, '..', directory_name, _path);
        // console.log(modelPath);
        fs.readFile(modelPath, 'utf8', function(err, data){
            if(err){
               console.log(err);
               reject("");    //following the same code flow
            }else{
               resolve(data);
            }
        });
    }.bind(this, _path));
});


function load_in_data_files(){
    fs.readFile(groundPath, 'utf8' , (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        ground_input = JSON.parse(data);
        // console.log( Object.keys(empty_confusion_matrix(1000)).length);
    
        Promise.all(promises).then(function(results){
            //Put your callback logic here
            results.forEach(function(content, i){
                if (i > 0) {
                    var row = Array(num_classes).fill(0);
                    var row_p = Array(num_classes).fill(0);
                    var input_json = JSON.parse(content);
                    // console.log(input_json["img-1012"], Object.keys(ground_input).length);
                    var matrix = confusion_matrix_builder(ground_input, input_json, num_classes);
                    var results = confusion_matrix_analyzer(matrix, num_classes);
                    var name = "model-" + i; 
                    cm_object[name] = results;
    
                    var TP = results.TP;
                    var TN = results.TN;
                    var FP = results.FP; 
                    var FN = results.FN;
                    
                    fs.writeFile(i+'.txt', JSON.stringify(results, null, 2), function(err) {
                        if(err) {
                            console.log(err);
                        }
                    })

                    for (let class_index = 0; class_index < num_classes; class_index++) {
                        row[class_index] = (TP[class_index] + TN[class_index]) /(TP[class_index] + TN[class_index] + FP[class_index] + FN[class_index]);
                        row_p[class_index] = TP[class_index]/(TP[class_index] + FP[class_index] );
                    }
                    accuracy_object[name] = row;
                    precision_object[name] = row_p;
                    fs.writeFile(i+'-accuracy.JSON', JSON.stringify(row, null, 2), function(err) {
                        if(err) {
                            console.log(err);
                        }
                    });
                    fs.writeFile(i+'-precision.JSON', JSON.stringify(row_p, null, 2), function(err) {
                        if(err) {
                            console.log(err);
                        }
                    })
                }
            });

        })
        
    })
    // console.log(Object.keys(cm_object), '80-cf-bulder')  ;
    // console.log(Object.keys(accuracy_object), '93-cf-bulder')  ;

}


// .then(function(){
        //     if (!accuracy_flag){
        //         fs.writeFile('accuracy.json', JSON.stringify(accuracy_object, null, 2), function(err) {
        //             if(err) {
        //                 console.log(err);
        //             }
        //         })
        //         accuracy_flag = true;
        //     }
        // });

    // setTimeout(() =>  
    //         function(){
                // fs.writeFile('ACCURACY.json', JSON.stringify(accuracy_object, null, 2), function(err) {
                //     if(err) {
                //         console.log(err);
                //     }
    //             })
    //     }, 100);


// var p = new Promise(function(resolve, reject) {
	
// 	// Do an async task async task and then...
//      setTimeout(() =>  
//             function(){
//                 fs.writeFile('ACCURACY.json', JSON.stringify(accuracy_object, null, 2), function(err) {
//                     if(err) {
//                         console.log(err);
//                     }
//                 })
//         }, 10000);

// 	if(accuracy_flag) {
// 		resolve('Success!');
// 	}
// 	else {
// 		reject('Failure!');
// 	}
// });


load_in_data_files();


// p.then(function(data) { 
// 	/* do something with the result */
//    console.log(data);
// }).catch(function(data) {
// 	console.log(data);
// })



// ===========================================
// confusion_matrix('model-1.json');

function getData(fileName) {
    return new Promise(function(resolve, reject){
        var modelPath = path.join(__dirname, '..', directory_name, fileName);
        fs.readFile(modelPath, 'utf8', (err, data) => {
            err ? reject(err) : resolve(data);
        });
    });
}

// =========================================
function confusion_matrix_builder(ground_truth_json, model_json, num_classes){
    var cm = empty_confusion_matrix(num_classes);
    var counter = 0;
    for (const [key, value] of Object.entries(model_json)) {
        var index = String(key).slice(4);
        // console.log(index, '  index');
        // console.log(key, value);
        // console.log(cm["row" + index].length);
        // console.log(`${key}: ${value}`);
        if (model_json[key] == ground_truth_json[key]) {
            // counter++;
            cm["row" + value][value-1]++; 
            // console.log(typeof(key), typeof(value));
        } else {
            cm["row"+ value][ground_truth_json[key]-1]++;
        }
    }
    return cm;
}

function confusion_matrix_analyzer(cm, num_classes){
    // console.log(cm, 'cm');
    // var sum_total = 0;
    var  TP = Array(num_classes).fill(0)
        ,TN = Array(num_classes).fill(0)
        ,FP = Array(num_classes).fill(0)
        ,FN = Array(num_classes).fill(0);

    for (const [key, value] of Object.entries(cm)) {
        var index = Number(key.slice(3)) - 1;
    // compute TP
        TP[index] = cm[key][index]
   
    // compute FP
         var sum = value.reduce(function(a, b){
            return a + b;
        }, 0);
        FP[index] = sum - TP[index];
    
    // compute FN
        for (let step = 0; step < value.length; step++) {
            if (step != index){
                FN[step] = FN[step] + value[step];
            }            
        }
    // compute TN
        for (let step = 0; step < value.length; step++) {
            TN[step] = TN[step] + sum;          
        }
    }
    for (let step = 0; step < TN.length; step++) {
        TN[step] = TN[step] - TP[step] - FP[step] -FN[step];
    }

    return {
        TP, 
        TN,
        FP,
        FN
    };
}

function empty_confusion_matrix(num_classes){
    var jsonObj = {};
    // var sample_classes = range(1, 1000);
    for (let step = 1; step <= num_classes; step++) {
        var row_name = "row" + String(step);
        jsonObj[row_name]=Array(num_classes).fill(0);
    }
    // console.log(jsonObj);
    // console.log(Object.keys(jsonObj));
    return jsonObj;
}

function accuracy_per_each_class(cm_object){
    model_names = Object.keys(cm_object);
    num_models = model_names.length;

    for (let step = 1; step <= num_models; step++) {
        var row = Array(num_classes).fill(0);
        var name = model_names[step-1];
        var TP = cm_object.name.TP; 
        var TN = cm_object.name.TN;
        var FP = cm_object.name.FP; 
        var FN = cm_object.name.FN;

        for (let class_index = 0; class_index < num_classes; class_index++) {
            row[class_index] = TP[class_index] + TN[class_index] /(TP[class_index] + TN[class_index] + FP[class_index] + FN[class_index]);
        }
        accuracy_object[name] = row;
    }
    fs.writeFile('accuracy.json', JSON.stringify(accuracy_object, null, 2), function(err) {
        if(err) {
            console.log(err);
        }
    })

}



// var model_input = f.read_file('model-1.json');

function range(start, end) {
  return Array(end - start + 1).fill().map((_, idx) => start + idx)
}
// var result = range(9, 18); // [9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
// console.log(result);



   // for (const [key, value] of Object.entries(model_json)) {
    //     var index = Number(String(key).slice(3));
        // TP[index - 1] = model_json[key][index - 1]
        // console.log(typeof(cm[key]));

    
                    // console.log(TP[0], 'TP');
    
                    // console.log(TN[0], 'TN');
    
                    // console.log(FP[0], 'FP');
    
                    // console.log(FN[0], 'FN');
    
                    // for (let step = 0; step < num_classes; step++) {
                    //     console.log("step. ", step);
                    //     console.log(TP[step], 'TP');
                    //     console.log(TN[step], 'TN');
                    //     console.log(FP[step], 'FP'); 
                    //     console.log(FN[step], 'FN');
                    //     console.log("--------------------------------------")                
                    // }

   
        // console.log(typeof(output));
        
        // console.log(Object.keys(output));

    // console.log(counter);
    // console.log(typeof(key), typeof(value));
// var initial_row = Array(1000).fill(0);


// let cm_object_promise = new Promise(function(myResolve, myReject) {
  
//   // The producing code (this may take some time)
//     if (cm_object) {
//         myResolve();
//     } else {
//         myReject("cm_object is empty or undefined");
//     }
// });


// cm_object_promise.then()
//                 .catch(function display(some) {
//                     console.log(some);
//                 })
//                 .then(function(){
//                     load_in_data_files();
//                 });








module.exports = {
    load_in_data_files,
    get_num_models, 
    get_accuracy, 
    get_precision
}
        