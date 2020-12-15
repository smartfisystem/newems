const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
// const Authmodel = mongoose.model("Auth");
var blog = require('../model/meterdata.model');
var water = require('../model/watertank.modal');
var meterconfig = require('../model/meterconfig.model');
var auth = require('../model/auth.model');

var meterdata = []

/* 
This function parses the req and populate info and return to the caller
Input:
   body:  Request body
   Returns data object having parsed info
*/
function parse_req(body) {

    let row = body.split("&");
    let data = {};
    let error_code = 0
    data.created_date = new Date();
    data.blockdata = [];
    somedata = [];

    for (let i = 0; i < row.length; i++) {
        // Extract all key value pair like ID, DT, G etc
        let key = row[i].split("=")[0];
        let val = row[i].split("=")[1];
        let data1 = {
            [key]: val
        }
        Object.assign(data, data1)
    }

    if (data && data.ID) {
        // Extract ID info
        data.clientId = parseInt(data.ID.substring(0, 4), 16);
        data.deviceId = parseInt(data.ID.substring(4, 8), 16);
    }

    if (data && data.G) {
        // Parse each of Gateway data (G) and keep in blockData data structure
        data.G.slice(0, -1);
        let temp = data.G.split('/');
        for (let j = 0; j < temp.length; j++) {
            let arr = [];
            let encoded = temp[j].substring(10).match(/.{1,8}/g);
            if (encoded) {
                for (let k = 0; k < encoded.length; k++) {
                    arr.push((encoded[k]))

                }
            }

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
    }
    return data;
}

/* 
This function validates mandatory fields in data
Input:
   data:  Parsed data
   Returns false if mandatory data is missing, else true
*/

function valid_req(data){
    if(!(data && data.clientId && data.deviceId)){
        // TODO: handle this
        return false;
    }
    return true;
}

/* 
This function removes inappropriate values in data.G
Input:
    to_remove: Indices of inappropriate values
   data:  data
   Return: None. It trims the data
*/
function trim_data(to_remove,data){
    for(let index of to_remove){
        data.blockdata[index] = null
    }
    let length = data.blockdata.length;
    for(let k = length -1; k>=0; --k){
        if (data.blockdata[k] == null){
            data.blockdata.splice(k,1);
            data.length = data.length - 1;    
        }
   
    }
    return;
}

function send_response(res, value){
    res.send({
        message: value,
    })
}

/* 
This function filters out inappropriate values in data.G and keeps other info
Input:
   data:  data
   Returns data after throwing out invalid data
Assumption: input data is valid and parsed
*/
function filter_data(req, res, data){
    if (!data.G) {
        response(true,res);
        return
    }
    let count = data.blockdata.length;
    let to_remove = new Set();
    for (let k = 0; k < data.blockdata.length; k++) {
        // Run the query for each G datablock
        let query = {
            address: data.blockdata[k].starting_address.toString(),
            modbus_code: data.blockdata[k].modbus_code.toString(),
            // slave: data.blockdata[k].slaveId.toString(),
            // no_register:temp1.data_length/2,
            data_length: data.blockdata[k].data_length
        }
        if(query.data_length == null){
            to_remove.add(k);
            --count;
            continue;
        }
        else {
            meterconfig.find(query, (err, success) => {
                if (err || success == null || success.length == 0) {
                    to_remove.add(k);
                }
                else{
                    if (success && success.length > 0 && success[0].parameterlink) {
                        datamani(success[0].parameterlink.parameterlink, success[0].type_conversion, data.blockdata.length, k, data.blockdata[k].actualdata);
                    }
                }
                --count;
                if (count == 0){
                    if(to_remove.size != 0){
                        trim_data(to_remove, data);
                    }
                    
                        saveindatabase(req, res, data);
                    
                }
            });
        }

    }

}


router.post("/postmeterdata", (req, res) => {
    data = parse_req(req.body);
    if (! valid_req(data)){
        //TODO: return NCK
    }
    filter_data(req, res, data);
})

function response(is,res) {
    if(is) {
        //send ACK
        res.send({
            message:'ACK'
        })
    }
    else {
        //SEND NCK
        res.send({
            message:'NCK'
        })
    }
}

function saveindatabase(req, res, data) {
    if (data.blockdata.length <= 0){
        response(false,res);
        return
    }
    
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
                    let water1 = new water(temp[j] );
                    // console.log(water1)
                    water1.userId = results[0]._id;
                    water1.created_date = new Date();

                    // water1.deviceId = 101
                    // water1.slaveId = 1

                    // console.log(water1)

                    water1.save((err, success) => {

                        if (err && j == temp.length - 1) {
                            console.log(err)
                            response(false,res);
                            meterdata = []

                        }
                        else if (!err && j == temp.length - 1) {
                            meterdata = []
                            response(true,res);
                        }
                    })


                }
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
function datamani(data, type, totaldata, index, arr) {
    // console.log(data,type)

    data.forEach((element, i) => {
        element.value = floattohex(arr[i], type).toFixed(2);
        // console.log(element)
    })

    if (data.length > 0) {
        meterdata.push(data);
    }
    if (totaldata == index + 1) {
        return true;
    }
}
router.get('/getmeterdataall/:id/:device/:slave', (req, res) => {
    let data = {
        userId: req.params.id,
        deviceId:req.params.device,
        slaveId:req.params.slave
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

