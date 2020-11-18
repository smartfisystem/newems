
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
    // no_parameter:{
    //     type : String,
    //     required: true
    // },
    parameterlink:{
        type : Object,
        required: true
    },
    block_no:{
        type : Object,
        required: true
    },
    modbus_code:{
        type : Object,
        required: true
    },
    no_register:{
        type : Object,
        required: true
    },
    // slave:{
    //     type : Object,
    //     required: true
    // },
    type_conversion:{
        type : String,
        required: true
    }
    // userId:{
    //     type:String,
    //     required: true
    // },
    
})
var Meterconfig=mongoose.model("Meterconfig", Meterconfig);
module.exports=Meterconfig;