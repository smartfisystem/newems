const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
// const Authmodel = mongoose.model("Auth");
var parameter = require('../model/parameterlink.model');


router.post('/addparameterlink', (req, res) => {
let data=req.body;
console.log(data)
    var para = parameter(data)
                para.save((err, success) => {
                    if (err) {
                        res.send({
                            error: true,
                            message: err.message
                        })
                    } else {
                        res.send({
                            error: false,
                            result: success,
                            message: 'Data created successfully'
                        })
                    }
                })
})


router.get('/getparameterlink', (req, res) => {
    parameter.find((err,success)=>{
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
                result:successs
            })
        }
    })



})

router.get('/getparameterlink/:id',(req,res)=>{
    let id=req.params.id;
    console.log(id);
    if(id){
        parameter.findById(id,(err,success)=>{
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



router.put('/updateparameter/:id',(req,res)=>{
    let _id=req.params.id;
    console.log(req.body);
    if(_id){
        parameter.findById(_id,(err,success)=>{
            if(err|| success==null){
                res.send({
                    error:true,
                    result:err
                })
            }
            else{
                console.log(success)
                success.link_name = req.body.link_name ? req.body.link_name : success.link_name;
                success.parameterlink = req.body.parameterlink ? req.body.parameterlink : success.parameterlink;


                parameter.updateOne({_id:_id},success,(err, success1) => {
                    if (err) {
                        res.send({
                            error: true,
                            message: err.message
                        })
                    } else {
                        res.send({
                            error: false,
                            result: success,
                            message: 'parameterlink saved successfully'
                        })
                    }
                })

            }
        })
    }
})


router.delete('/deleteparameterlist/:id',(req,res)=>{
    let query={
        _id:req.params.id
    }
    
    if(query._id){
        parameter.findOneAndDelete(query,(err,success)=>{
            console.log(err)
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

module.exports = router;

