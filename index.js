
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
const connection = require("./model");
const express = require("express");
const app = express();
const path = require("path");
var cors = require('cors')
var multer = require('multer');
// var upload = multer({ dest: 'uplods/' });
var fs = require('fs');

const expressHandlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var bodyParser1 = require('body-parser');

const meterdatacontroller=require('./controller/meterdata')
const authcontroller=require("./controller/auth");
const meterconfigcontroller=require("./controller/meterconfig");
const parameter=require("./controller/parameter");
const parameterlink=require("./controller//parameterlink");
const port = process.env.PORT || 3001;
// app.use(bodyparser.urlencoded({
//     extended: true
// }));


app.use(bodyParser.json());
app.use(bodyParser1.text());

app.use(cors())

app.get('/hello', (req, res) => {
    res.send('<h1>Hello world</h1>')
});
app.use("/user", authcontroller);
app.use("/meter", meterdatacontroller);
app.use("/meterconfig", meterconfigcontroller);
app.use("/parameter", parameter);
app.use("/parameterlink", parameterlink);


var file = require('./image');

//storage for files
var storage = multer.diskStorage({
    destination: function (request, file, cb) {
        cb(null, './uplods')
    },
    filename: function (request, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});



// Api for Image Upload
app.post('/upload', (request, response) => {
    var image;
    console.log("file upload");

    let imageResponse = {};

    var upload = multer({
        storage: storage,
        fileFilter: function (request, file, cb) {
            var ext = path.extname(file.originalname);
            cb(null, true)
        }
    }).single('file');

    upload(request, response, function (error) {
        console.log('......body....', request.body);
        console.log('...error....', error)
        if (error) {
            console.log('////error///', error)
            // throw error;
            imageResponse.error = true;
            imageResponse.message = `Error :` + error.message;
            response.status(500).json(imageResponse);
        }
        else if (request.file) {
            console.log(request.file);
            image = request.file;
            let resizedImagePath = 'uplods/thumb-' + image.filename;
            // console.log('resizedImagePath', resizedImagePath)

            let data = new file({
                file: image
            });
            console.log('data', data)
            data.save((error, result) => {
                console.log('......error...', error);
                console.log('......result...', result);

                if (error) {
                    imageResponse.error = true;
                    imageResponse.message = `Error :` + error.message;
                    response.status(500).json(imageResponse);
                }
                else if (result) {
                    imageResponse.error = false;
                    imageResponse.upload = result;
                    imageResponse.message = `file uploaded successful.`;
                    response.status(200).json(imageResponse);
                }
                else {
                    imageResponse.error = true;
                    imageResponse.message = `file upload unsuccessful.`;
                    response.status(500).json(imageResponse);
                }
            });
            //kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk

        }
    });
});

/* Api for get Image through their Id
*/
app.get('/getImage', (request, response) => {
    let imageResponse = {};
    console.log("image display");

    console.log(request.query);
    let select = request.query.select;

    file.findById(request.query.imageId, (error, result) => {
        console.log(result);
        console.log(error);
        if (error) {
            imageResponse.error = true;
            imageResponse.message = `Server error : ` + error.message;
            response.status(500).json(imageResponse);
        }
        else if (result) {
            console.log('result', result)
            if (select == "thumbnail") {
                response.set({
                    "Content-Disposition": 'attachment; filename="' + 'uplods/thumb-' + result.file.originalname + '"',
                    "Content-Type": result.thumbnail.mimetype
                });
                fs.createReadStream(result.thumbnail.path).pipe(response);
            }
            else {
                response.set({
                    "Content-Disposition": 'attachment; filename="' + result.file.originalname + '"',
                    "Content-Type": result.file.mimetype
                });
                fs.createReadStream(result.file.path).pipe(response);
                console.log(result.file.path);
            }
        }
        else {
            imageResponse.error = true;
            imageResponse.message = `No such image available`;
            response.status(500).json(imageResponse);
        }
    })
});







app.listen(port,() => {
    console.log(`Server running at port `+port);
  });

