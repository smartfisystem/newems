
const mongoose =require("mongoose");

var Meterconfig=mongoose.Schema({
    meter_manufacture:{
        type : String,
        required: true
    },
    meter_model:{
        type : String,
        required: true
    },
    address:{
        type : String,
        required: true
    },
    data_length:{
        type : String,
        required: true
    },
    no_parameter:{
        type : String,
        required: true
    },
    parameter:{
        type : Object,
        required: true
    },
    userId:{
        type:String,
        required: true
    },
    
})
var Meterconfig=mongoose.model("Meterconfig", Meterconfig);
module.exports=Meterconfig;