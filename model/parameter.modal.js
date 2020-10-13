
const mongoose =require("mongoose");

var Parameter=mongoose.Schema({
    parameter:{
        type : Object,
        required: true
    },    
})
var Parameter=mongoose.model("Parameter", Parameter);
module.exports=Parameter;