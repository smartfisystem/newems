const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
// const Authmodel = mongoose.model("Auth");
var meterconfig = require('../model/meterconfig.model');


router.post('/addconfig', (req, res) => {
    let data = req.body;
    

    console.log(data);

    meterconfig.findOne({
        meter_model: data.meter_model
    }, (err, doc) => {
        if (!err) {
            if (doc) {
                if (doc.meter_model == data.meter_model) {
                    res.send({
                        message: 'Data Already Exists! please choose another meter model',
                        error: true
                    })
                }
            } else {
                var meter = meterconfig(data)
                meter.save((err, success) => {
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
            }

        } else {
            res.send({
                message: 'something went wrong',
                error: true
            });

        }
    })



})


router.get('/getconfig', (req, res) => {
    meterconfig.find((err,success)=>{
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


router.get('/getconfig/:id',(req,res)=>{
    let id=req.params.id;
    console.log(id);
    if(id){
        meterconfig.findById(id,(err,success)=>{
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



router.put('/updateconfig/:id',(req,res)=>{
    let _id=req.params.id;
    console.log(_id);
    if(_id){
        meterconfig.findById(_id,(err,success)=>{
            if(err|| success==null){
                res.send({
                    error:true,
                    result:err
                })
            }
            else{
                success.meter_manufacture = req.body.meter_manufacture ? req.body.meter_manufacture : success.meter_manufacture;
                success.meter_model = req.body.meter_model ? req.body.meter_model : success.meter_model;
                success.data_length = req.body.data_length ? req.body.data_length : success.data_length;
                success.no_parameter = req.body.no_parameter ? req.body.no_parameter : success.no_parameter;
                success.parameterlink = req.body.parameterlink ? req.body.parameterlink : success.parameterlink;
                success.address = req.body.address ? req.body.address : success.address;

                success.block_no = req.body.block_no ? req.body.block_no : success.block_no;
                success.modbus_code = req.body.modbus_code ? req.body.modbus_code : success.modbus_code;
                success.no_register = req.body.no_register ? req.body.no_register : success.no_register;
                success.slave = req.body.slave ? req.body.slave : success.slave;


                meterconfig.updateOne({_id:_id},success,(err, success1) => {
                    if (err) {
                        res.send({
                            error: true,
                            message: err.message
                        })
                    } else {
                        res.send({
                            error: false,
                            result: success,
                            message: 'Data Updated successfully'
                        })
                    }
                })

            }
        })
    }
})
router.delete('/deleteconfig/:id',(req,res)=>{
    let query={
        _id:req.params.id
    }
    
    if(query._id){
        meterconfig.findOneAndDelete(query,(err,success)=>{
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

