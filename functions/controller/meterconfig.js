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



module.exports = router;

