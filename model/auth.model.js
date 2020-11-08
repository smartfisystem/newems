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
    },
    usermeter:{
        type:Object
    }
    // meterId: {
    //     sparse: true,
    //     required: true,
    //     type: schema.ObjectId,
    //     ref: 'meters',
    // },
    
})
var user=mongoose.model("Auth", Auth);
module.exports=user;