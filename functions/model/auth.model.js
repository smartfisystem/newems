const mongoose =require("mongoose");

var Auth=mongoose.Schema({
    name:{
        type : String,
        required: true
    },
    email:{
        type:String,
        required: true,
        index: { unique: true }
    },
    password:{
        type: String,
        required: true,
        
    },
    role:{
        type:String,
        required: true
    },
    status:{
        type:String,
        required: true
    }
    
})
var user=mongoose.model("Auth", Auth);
module.exports=user;