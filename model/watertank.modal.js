
const mongoose =require("mongoose");

var Water=mongoose.Schema({
    // meter:{
    //     type : Object,
    //     required: true
    // },

    userId:{
        type:String,
        required: true
    },
    deviceId:{
        type:String,
        required: true
    },
    slaveId:{
        type:String,
        required: true
    },





    DT:{
        type:String,
    },
    G:{
        type:String,
    },
    ID:{
        type:String,
    },
    array:{
        type:Object,
    },
    clientId:{
        type:String,
    },
    data_length:{
        type:String,
    },
    modbus_code:{
        type:String,
    },
    starting_address:{
        type:String,
    },

   


    
})
var Water=mongoose.model("Water", Water);
module.exports=Water;