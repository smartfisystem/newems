const mongoose =require("mongoose");

var Meterdata=mongoose.Schema({
    meterdata:{
        type : Array,
        required: true
    },

    userId:{
        type:String,
        required: true
    },
    
})
var Meterdata=mongoose.model("Meterdata", Meterdata);
module.exports=Meterdata;