const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
// const Authmodel = mongoose.model("Auth");
var blog = require('../model/meterdata.model');
var water = require('../model/watertank.modal');
var meterconfig = require('../model/meterconfig.model');
var meterdata=[]

router.post("/postmeterdata", (req, res) => {
   
let row=req.body.split("&");
let data={};
data.created_date=new Date();
data.blockdata=[];
somedata=[]
for(let i=0;i<row.length;i++){
    let key=row[i].split("=")[0];
    let val=row[i].split("=")[1];
    let data1={
        [key]:val
    }
    Object.assign(data,data1)
}

if(data && data.ID){
    data.clientId=parseInt(data.ID.substring(0,4),16);
    data.deviceId=parseInt(data.ID.substring(4,8),16);
}
if(data && data.G){

    let temp=data.G.split('/');
        
    for(let j=0; j<temp.length;j++){
        let arr=[];
        let encoded=temp[j].substring(10).match(/.{1,8}/g);
     
        if(encoded){
            
            for(let k=0;k<encoded.length;k++){
                arr.push(floattohex(encoded[k]))
                
            }
        }
        

        let temp1={
            starting_address: parseInt(temp[j].substring(0,4),16),
            slaveId:parseInt(temp[j].substring(4,6),16),
            modbus_code:parseInt(temp[j].substring(6,8),16),
            data_length:parseInt(temp[j].substring(8,10),16),
        }
        temp1.actualdata=arr;
        data.blockdata.push(temp1);
    }



for(let k=0;k<data.blockdata.length;k++){
    let query={
        address:data.blockdata[k].starting_address.toString(),
        modbus_code:data.blockdata[k].modbus_code.toString(),
        slave:data.blockdata[k].slaveId.toString(),
        // no_register:temp1.data_length/2,
        data_length:data.blockdata[k].data_length
    }
    if(query){
        meterconfig.find(query,(err,success)=>{
            if(err|| success==null){
                // res.send({
                //     message:"NCK",
                // })
                datamani([],data.blockdata.length,k,[])

            }
            else{
                // temp1.actualdata=arr;

                if(success && success.length>0 && success[0].parameterlink){

                    // success[0].parameterlink.parameterlink.forEach((element,i)=>{
                    //     element.value=data.blockdata[k].actualdata[i];
                    // })
                    // somedata.push(success[0].parameterlink.parameterlink);
                    // somedata.push(success[0].parameterlink.parameterlink)
                    // console.log('here')
                  let x= datamani(success[0].parameterlink.parameterlink,data.blockdata.length,k,data.blockdata[k].actualdata)
                    // console.log(somedata);
                if(x){
                    saveindatabase(req,res,data)
                }
                    
                }

            }
        })
    }

}

   



}

// res.send({
//     data:data
// })
// console.log('down')
// console.log(somedata);


})


function saveindatabase(req,res,data){
    
 
    for(let i=0;i<data.blockdata.length;i++){
        if(meterdata[i]){
            data.blockdata[i].actualdata=meterdata[i];
        }
    }
    console.log(data);

    let data1={meter:data};
    // console.log(data)
    let water1= new water(data1)
    water1.save((err, success) => {
        if (err) {
            res.send({
                message:"NCK",
            })
        }
        else{
            res.send({
                message:"ACK",
            })
        }
    })
}
function datamani(data,totaldata, index,arr){

    data.forEach((element,i)=>{
        element.value=arr[i];
    })

    // console.log('here',totaldata,index)
if(data.length>0){
    meterdata.push(data);
}
    // console.log(meterdata)
    if(totaldata==index+2){
        return true;
    }
}
router.get('/getmeterdataall',(req,res)=>{
   
    
    
    
        water.find((err,success)=>{
            if(err|| success==null){
                res.send({
                    error:true,
                    result:err
                })
            }
            else{
                let successs=success.reverse()
                res.send({
                    error:false,
                    result:successs.slice(0,20)
                })
            }
        })
    
})

router.get('/hello', (req, res) => {
    res.send('<h1>Hello world</h1>')
});

router.post("/add", (req, res) => {
    let data={
        blog:req.body.blog,
        userId:req.body.userId
    }

    if (!req.body.blog || !req.body.userId) {
        res.send({
            error: true,
            message: 'Invalid Detail'
        })
        return
    }
    else{
        let blogadd= new blog(data)
        blogadd.save((err, success) => {
            if (err) {
                res.send({
                    error:true,
                    message:"blog addition failed",
                    result:err
                })
            }
            else{
                res.send({
                    error:false,
                    message:"blog added",
                    result:success
                })
            }
        })
    }



})

router.get('/getblog/:id',(req,res)=>{
    let query={
        userId:req.params.id
    }
    
    
    if(query.userId){
        blog.find(query,(err,success)=>{
            if(err|| success==null){
                res.send({
                    error:true,
                    result:err
                })
            }
            else{
                res.send({
                    error:false,
                    result:success
                })
            }
        })
    }
})




router.get('/getsingleblog/:id',(req,res)=>{
    let query={
        _id:req.params.id
    }
    
    if(query._id){
        blog.findById(query._id,(err,success)=>{
            if(err|| success==null){
                res.send({
                    error:true,
                    result:err
                })
            }
            else{
                res.send({
                    error:false,
                    result:success
                })
            }
        })
    }
})


router.delete('/delsingleblog/:id',(req,res)=>{
    let query={
        _id:req.params.id
    }
    
    if(query._id){
        blog.findOneAndDelete(query,(err,success)=>{
            if(err|| success==null){
                res.send({
                    error:true,
                    result:err
                })
            }
            else{
                res.send({
                    error:false,
                    result:success
                })
            }
        })
    }
})


router.put('/updateblog/:id',(req,res)=>{
    let _id=req.params.id;
    if(_id){
        blog.findById(_id,(err,success)=>{
            if(err|| success==null){
                res.send({
                    error:true,
                    result:err
                })
            }
            else{
                success.blog = req.body.blog ? req.body.blog : success.blog;
                blog.updateOne({_id:_id},success,(err, success) => {
                    if (err) {
                        res.send({
                            error: true,
                            message: err.message
                        })
                    } else {
                        res.send({
                            error: false,
                            result: success,
                            message: 'blog updated successfully'
                        })
                    }
                })

            }
        })
    }
})

function floattohex(str) {
    if(str!='00000000'){
        str='0x'+str
    }
    else{
        return 0.00
    }
    var float = 0, sign, order, mantiss,exp,
        int = 0, multi = 1;
    if (/^0x/.exec(str)) {
      int = parseInt(str,16);
    }else{
      for (var i = str.length -1; i >=0; i -= 1) {
        if (str.charCodeAt(i)>255) {
          return false;
        }
        int += str.charCodeAt(i) * multi;
        multi *= 256;
      }
    }
    sign = (int>>>31)?-1:1;
    exp = (int >>> 23 & 0xff) - 127;
    mantissa = ((int & 0x7fffff) + 0x800000).toString(2);
    for (i=0; i<mantissa.length; i+=1){
      float += parseInt(mantissa[i])? Math.pow(2,exp):0;
      exp--;
    }
    return float*sign;
  }

module.exports = router;

