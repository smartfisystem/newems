const mongoose =require("mongoose");
// var xx="mongodb+srv://brij:Brijnav%4020@cluster0-oku3m.mongodb.net/test?retryWrites=true&w=majority"
let yy="mongodb+srv://brij:f3uzirUIufGxLfcB@cluster0.xza4j.mongodb.net/waterems?retryWrites=true&w=majority";
let zz="mongodb://127.0.0.1/waterems"
mongoose.connect(yy,{ useNewUrlParser: true,useUnifiedTopology: true },(err)=>{
    if(!err){
        console.log('success')
    }
    else{
        console.log("some error")
    }
});
mongoose.set('useCreateIndex', true);

//Get the default connection
var db = mongoose.connection;

mongoose.connection.on('connected', () => {
    console.log('Connected to mongodb!!');
});

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


const Auth=require("./auth.model");
const Meterdata=require("./meterdata.model");
const Water=require("./watertank.modal");
const Test=require("./testtable.model");