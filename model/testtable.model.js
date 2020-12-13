const mongoose =require("mongoose");

var Test=mongoose.Schema({
    meter:{
        type : Object,
        required: true
    },
  
    
    // meterId: {
    //     sparse: true,
    //     required: true,
    //     type: schema.ObjectId,
    //     ref: 'meters',
    // },
    
})
var Test=mongoose.model("Test", Test);
module.exports=Test;