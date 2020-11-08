
const mongoose =require("mongoose");

var Water=mongoose.Schema({
    meter:{
        type : Object,
        required: true
    },

    userId:{
        type:String,
        required: true
    },
    
})
var Water=mongoose.model("Water", Water);
module.exports=Water;