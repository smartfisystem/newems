const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
// const Authmodel = mongoose.model("Auth");
var blog = require('../model/meterdata.model');
var water = require('../model/watertank.modal');
var meterconfig = require('../model/meterconfig.model');
var auth = require('../model/auth.model');
var test= require('../model/testtable.model')
var meterdata = []

router.post("/testmeter", (req, res) => {
    let row = req.body;
    let data={meter:row}
    var da = test(data)
    da.save((err, success) => {
        if (err) {
            res.send({
                error: true,
                message: 'NCK'
            })
        } else {
            res.send({
                error: false,
                message: 'ACK'
            })
        }
    })


});
router.post("/postmeterdata", (req, res) => {

    let row = req.body.split("&");
    let data = {};
    data.created_date = new Date();
    data.blockdata = [];
    somedata = [];
    // saving row data with bhanu wala key
    for (let i = 0; i < row.length; i++) {
        let key = row[i].split("=")[0];
        let val = row[i].split("=")[1];
        let data1 = {
            [key]: val
        }
        Object.assign(data, data1)
    }
     //Bhanu
     if (data && data.DT) {
        //check
        //if DT have all zero then use new Date()
        //else use DT values of time eg-> 5FD5CDC9 hexTouint32-> 1607847369 Unix to ISO->
    }
    //  id seperation
    if (data && data.ID) {
        data.clientId = parseInt(data.ID.substring(0, 4), 16);
        data.deviceId = parseInt(data.ID.substring(4, 8), 16);


    }
    // condition for g(data)
    if (data && data.G) {

        data.G.slice(0, -1);
        let temp = data.G.split('/');
        for (let j = 0; j < temp.length; j++) {
            let arr = [];
            let encoded = temp[j].substring(10).match(/.{1,8}/g);
            if (encoded) {
                for (let k = 0; k < encoded.length; k++) {
                    // arr.push(floattohex(encoded[k]))
                    arr.push((encoded[k]))

                }
            }
            // saving the address of indivisual blockdata
            if (parseInt(temp[j].substring(8, 10), 16) > 0) {
                let temp1 = {
                    starting_address: parseInt(temp[j].substring(0, 4), 16),
                    slaveId: parseInt(temp[j].substring(4, 6), 16),
                    modbus_code: parseInt(temp[j].substring(6, 8), 16),
                    data_length: parseInt(temp[j].substring(8, 10), 16),
                }

                temp1.actualdata = arr;
                data.blockdata.push(temp1);
            }
        }

        // findding the user of indivial block data
        let errcount = 0;
        for (let k = 0; k < data.blockdata.length; k++) {
            let query = {
                address: data.blockdata[k].starting_address.toString(),
                modbus_code: data.blockdata[k].modbus_code.toString(),
                // slave: data.blockdata[k].slaveId.toString(),
                // no_register:temp1.data_length/2,
                data_length: data.blockdata[k].data_length
            }
            if (query.data_length != null) {
                meterconfig.find(query, (err, success) => {
                    if (err || success.length == 0) {
                        // sending blank data when there is no user
                        datamani([], '', data.blockdata.length, k, []);
                        errcount++;
                        if (errcount == data.blockdata.length) {
                            saveindatabase(req, res, [])

                        }
                    }
                    else {
                        if (success && success.length > 0 && success[0].parameterlink) {
                            // sending data  when there is  user

                            let x = datamani(success[0].parameterlink.parameterlink, success[0].type_conversion, data.blockdata.length, k, data.blockdata[k].actualdata)
                            if (x) {
                                // save data when the last block if excecuted
                                saveindatabase(req, res, data)
                            }
                        }

                    }
                })
            }

        }





    }
    else {

        res.send({
            message: "ACK"
        })
    }
    // res.send({
    //     data:data
    // })
    // console.log('down')
    // console.log(somedata);


})

// save in db
function saveindatabase(req, res, data) {

    if (data.length!=0) {


        for (let i = 0; i < data.blockdata.length; i++) {
            if (meterdata[i]) {
                data.blockdata[i].actualdata = meterdata[i];
            }
        }
        // let data1 = { meter: data };
        let temp = []
        for (let i = 0; i < data.blockdata.length; i++) {
            let a = {
                deviceId: data.deviceId,
                clientId: data.clientId,
                ID: data.ID,
                G: data.G,
                DT: data.DT,
                starting_address: data.blockdata[i].starting_address,
                slaveId: data.blockdata[i].slaveId,
                modbus_code: data.blockdata[i].modbus_code,
                data_length: data.blockdata[i].data_length,
            }
            temp.push(a);
            temp[i].array = data.blockdata[i].actualdata

        }

        // console.log(temp);


        // console.log(water1);



        // console.log('////////////////////////////////////////////////////////////////////////////////');
        // res.send({
        //     data: water1,
        // })

        let query = auth.find({ clientId: temp[0]['clientId'] });
        query.exec(function (err, results) {
            if (err) {
                res.send({
                    message: "NO METER LINKING",
                })
                meterdata = [];
            }
            else {
                // console.log('result',results);
                if (results.length > 0) {
                    for (let j = 0; j < temp.length; j++) {
                        let water1 = new water(temp[j]);
                        // console.log(water1)
                        water1.userId = results[0]._id;
                        water1.created_date = new Date();

                        // water1.deviceId = 101
                        // water1.slaveId = 1

                        // console.log(water1)

                        water1.save((err, success) => {

                            if (err && j == temp.length - 1) {
                                console.log(err)
                                res.send({
                                    message: "NCK",
                                })
                                meterdata = []

                            }
                            else if (!err && j == temp.length - 1) {
                                meterdata = []
                                res.send({
                                    message: "ACK",
                                    // data: success
                                })
                            }
                            // else{
                            //     meterdata = []
                            //     res.send({
                            //         message: "NCK, not all data recorded",
                            //     })
                            // }
                        })


                    }
                    // console.log(water1)
                    // water1.save((err, success) => {
                    //     if (err) {
                    //         res.send({
                    //             message: "NCK",
                    //         })
                    //         meterdata = []

                    //     }
                    //     else {
                    //         meterdata = []
                    //         res.send({
                    //             message: "ACK",
                    //         })
                    //     }
                    // })
                }
                else {
                    res.send({
                        message: "NO METER LINKING",
                    })
                    meterdata = [];
                }

            }
        })
    }
    else {

        res.send({
            message: "NCK",
        })
    }
}
// format data in for db

function datamani(data, type, totaldata, index, arr) {

    if (data.length > 0) {
        data.forEach((element, i) => {
            element.value = floattohex(arr[i], type).toFixed(2);
            // console.log(element)
        })

        meterdata.push(data);
    }
    if (totaldata == index + 1) {
        return true;
    }

}
router.get('/getmeterdataall/:id/:device/:slave', (req, res) => {
    let data = {
        userId: req.params.id,
        deviceId: req.params.device,
        slaveId: req.params.slave
    }

    console.log(data);
    let query;
    if (data.deviceId == 78364) {
        query = water.find().sort({ $natural: -1 }).limit(100);
    }
    else {
        //  query = water.find({userId: {$elemMatch: {_id:req.params.id}}});
        query = water.find(data).sort({ $natural: -1 }).limit(20);
    }
    query.exec(function (err, results) {
        if (err || results == null) {
            res.send({
                error: true,
                result: err
            })
        }

        else {
            // let successs=results.reverse()
            res.send({
                error: false,
                result: results
            })
            // results.reverse(); // put the results into the desired order
            // results.forEach(function(result) {
            // do something with each result
            // });
        }
    });
    // water.find((err,success)=>{
    //     if(err|| success==null){
    //         res.send({
    //             error:true,
    //             result:err
    //         })
    //     }
    //     else{
    //         let successs=success.reverse()
    //         res.send({
    //             error:false,
    //             result:successs.slice(0,20)
    //         })
    //     }
    // })

})

router.get('/hello', (req, res) => {
    res.send('<h1>Hello world</h1>')
});

router.post("/add", (req, res) => {
    let data = {
        blog: req.body.blog,
        userId: req.body.userId
    }

    if (!req.body.blog || !req.body.userId) {
        res.send({
            error: true,
            message: 'Invalid Detail'
        })
        return
    }
    else {
        let blogadd = new blog(data)
        blogadd.save((err, success) => {
            if (err) {
                res.send({
                    error: true,
                    message: "blog addition failed",
                    result: err
                })
            }
            else {
                res.send({
                    error: false,
                    message: "blog added",
                    result: success
                })
            }
        })
    }



})






router.post("/gettabledata", (req, res) => {
    let data = {
        userId: req.body.userId
    }

    if (data.userId == 78364) {
        query = water.find().sort({ $natural: -1 }).limit(20);
    }
    else {
        //  query = water.find({userId: {$elemMatch: {_id:req.params.id}}});
        query = water.find(data).sort({ $natural: -1 }).limit(100);
    }
    query.exec(function (err, results) {
        if (err || results == null) {
            res.send({
                error: true,
                result: err
            })
        }

        else {
            // let successs=results.reverse()
            res.send({
                error: false,
                result: results
            })
            // results.reverse(); // put the results into the desired order
            // results.forEach(function(result) {
            // do something with each result
            // });
        }
    });



})



router.get('/getblog/:id', (req, res) => {
    let query = {
        userId: req.params.id
    }


    if (query.userId) {
        blog.find(query, (err, success) => {
            if (err || success == null) {
                res.send({
                    error: true,
                    result: err
                })
            }
            else {
                res.send({
                    error: false,
                    result: success
                })
            }
        })
    }
})




router.get('/getsingleblog/:id', (req, res) => {
    let query = {
        _id: req.params.id
    }

    if (query._id) {
        blog.findById(query._id, (err, success) => {
            if (err || success == null) {
                res.send({
                    error: true,
                    result: err
                })
            }
            else {
                res.send({
                    error: false,
                    result: success
                })
            }
        })
    }
})


router.delete('/delsingleblog/:id', (req, res) => {
    let query = {
        _id: req.params.id
    }

    if (query._id) {
        blog.findOneAndDelete(query, (err, success) => {
            if (err || success == null) {
                res.send({
                    error: true,
                    result: err
                })
            }
            else {
                res.send({
                    error: false,
                    result: success
                })
            }
        })
    }
})


router.put('/updateblog/:id', (req, res) => {
    let _id = req.params.id;
    if (_id) {
        blog.findById(_id, (err, success) => {
            if (err || success == null) {
                res.send({
                    error: true,
                    result: err
                })
            }
            else {
                success.blog = req.body.blog ? req.body.blog : success.blog;
                blog.updateOne({ _id: _id }, success, (err, success) => {
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

function floattohex(str, type) {
    if (type == 'inverse') {
        let msb = (str.substring(0, 4));
        let lsb = (str.substring(4, 8));
        str = lsb + msb;
    }

    if (str != '00000000') {
        str = '0x' + str
    }
    else {
        return 0.00
    }
    var float = 0, sign, order, mantiss, exp,
        int = 0, multi = 1;
    if (/^0x/.exec(str)) {
        int = parseInt(str, 16);
    } else {
        for (var i = str.length - 1; i >= 0; i -= 1) {
            if (str.charCodeAt(i) > 255) {
                return false;
            }
            int += str.charCodeAt(i) * multi;
            multi *= 256;
        }
    }
    sign = (int >>> 31) ? -1 : 1;
    exp = (int >>> 23 & 0xff) - 127;
    mantissa = ((int & 0x7fffff) + 0x800000).toString(2);
    for (i = 0; i < mantissa.length; i += 1) {
        float += parseInt(mantissa[i]) ? Math.pow(2, exp) : 0;
        exp--;
    }
    return float * sign;
}

module.exports = router;

