const mongoose =require("mongoose");

var Meterdata=mongoose.Schema({
    meterdata:{
        type : Array,
        required: true
    },

    // userId:{
    //     type:String,
    //     required: true
    // },
    // userId: {
    //     sparse: true,
    //     required: true,
    //     type: schema.ObjectId,
    //     ref: 'meters',
    // },
    
})
var Meterdata=mongoose.model("Meterdata", Meterdata);
module.exports=Meterdata;