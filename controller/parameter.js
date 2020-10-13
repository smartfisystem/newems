const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
// const Authmodel = mongoose.model("Auth");
var parameter = require('../model/parameter.modal');


router.post('/addparameter', (req, res) => {
    let data=req.body
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


router.get('/getparameter', (req, res) => {
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


router.put('/updateparameter/:id',(req,res)=>{
    let _id=req.params.id;
    console.log(_id);
    if(_id){
        parameter.findById(_id,(err,success)=>{
            if(err|| success==null){
                res.send({
                    error:true,
                    result:err
                })
            }
            else{
                success.parameter = req.body.parameter ? req.body.parameter : success.parameter;
               

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
                            message: 'parameter saved successfully'
                        })
                    }
                })

            }
        })
    }
})

router.put('/updateparameter',(req,res)=>{
    parameter.update((err, success1) => {
        if (err) {
            res.send({
                error: true,
                message: err.message
            })
        } else {
            res.send({
                error: false,
                result: success1,
                message: 'User saved successfully'
            })
        }
    })
})


module.exports = router;

