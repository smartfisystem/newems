
const mongoose =require("mongoose");

var Parameterlink=mongoose.Schema({
    link_name:{
        type:String,
        required:true
    },
    parameterlink:{
        type : Object,
        required: true
    },
    
    
    
})
var Parameterlink=mongoose.model("Parameterlink", Parameterlink);
module.exports=Parameterlink;