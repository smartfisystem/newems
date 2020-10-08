const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
// const Authmodel = mongoose.model("Auth");
var user = require('../model/auth.model');


router.post('/signup', (req, res) => {
    let User = req.body;
    User.role='superadmin';
    User.status='active';

    console.log(User);

    if (!req.body.email || !req.body.password) {
        res.send({
            error: true,
            message: 'Invalid Detail'
        })
        return
    }

    user.findOne({
        email: User.email
    }, (err, doc) => {
        if (!err) {
            if (doc) {
                if (doc.email == User.email) {
                    res.send({
                        message: 'User Already Exists! Login or choose another user id',
                        error: true
                    })
                }
            } else {
                var newuser = user(User)
                newuser.save((err, success) => {
                    if (err) {
                        res.send({
                            error: true,
                            message: err.message
                        })
                    } else {
                        res.send({
                            error: false,
                            result: success,
                            message: 'User created successfully'
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

router.post('/newuser/signup', (req, res) => {
    let User = req.body;
    User.role="admin";
    User.status='active';
    console.log(User);

    if (!req.body.email || !req.body.password) {
        res.send({
            error: true,
            message: 'Invalid Detail'
        })
        return
    }

    user.findOne({
        email: User.email
    }, (err, doc) => {
        if (!err) {
            if (doc) {
                if (doc.email == User.email) {
                    res.send({
                        message: 'User Already Exists! Login or choose another user id',
                        error: true
                    })
                }
            } else {
                var newuser = user(User)
                newuser.save((err, success) => {
                    if (err) {
                        res.send({
                            error: true,
                            message: err.message
                        })
                    } else {
                        res.send({
                            error: false,
                            result: success,
                            message: 'User created successfully'
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

router.post("/login", (req, res) => {
    let query={
        email:req.body.email,
        password:req.body.password
    }
    user.findOne(query,(err, success) => {
        if (err || success==null) {
            res.send({
                error:true,
                message:"user login failed",
                result:err
            })
        }
        else{
            res.send({
                error:false,
                message:"user Verified",
                result:success
            })
        }
    })

})

router.get('/getuser/:id',(req,res)=>{
    let id=req.params.id;
    console.log(id);
    if(id){
        user.findById(id,(err,success)=>{
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


router.get('/getadminlist',(req,res)=>{
    let data={
        role:'admin'
    }
    if(data){
        user.find(data,(err,success)=>{
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


router.put('/updateprofile/:id',(req,res)=>{
    let _id=req.params.id;
    console.log(_id);
    if(_id){
        user.findById(_id,(err,success)=>{
            if(err|| success==null){
                res.send({
                    error:true,
                    result:err
                })
            }
            else{
                success.name = req.body.name ? req.body.name : success.name;
                success.password = req.body.password ? req.body.password : success.password;
                success.email = req.body.email ? req.body.email : success.email;
                success.status = req.body.status ? req.body.status : success.status;

                user.updateOne({_id:_id},success,(err, success1) => {
                    if (err) {
                        res.send({
                            error: true,
                            message: err.message
                        })
                    } else {
                        res.send({
                            error: false,
                            result: success,
                            message: 'User saved successfully'
                        })
                    }
                })

            }
        })
    }
})


module.exports = router;




// {
//   "functions": {
//     "predeploy": [
//       "npm --prefix \"$RESOURCE_DIR\" run lint"
//     ]
//   }
// }