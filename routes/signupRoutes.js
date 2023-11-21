const express = require('express');
const router = express.Router();
const signupModel=require('../models/signupModel')

router.get('/getdata',async(req,res)=>{
    try{
        const data= await signupModel.find({}).sort({id:1});
        res.json(data);
        console.log(data)
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
})

router.post('/post',async(req,res)=>{
    // validateEmailAccessibility(req.body.email).then(function(result) {
    //     console.log('exist',result);
    //     if (result.email===req.body.email) {
    //       console.log("Email does exist");
    //     } else {
    //       console.log("Email not exist");
    //     }
    //   });
    signupModel.find({"email":req.body.email}).then((result)=>{
        console.log(result.length);
        if (result.length !== 0) {
            res.json({
                message: 'Email already exists',
                status: false
            })
        }else{
            res.json({
                message: 'Email does not exists',
            }) 
        }
    })
//    const data= new signupModel({
//     username:req.body.username,
//     email:req.body.email,
//     password:req.body.password,
//     confirmPassword:req.body.confirmPassword
//    })
//    try{
//     const dataTosave = await data.save();
//     res.status(200).json(dataTosave)
//    }catch(err){
//     res.status(400).json({message:err.message})
//    }
})

function validateEmailAccessibility(email){

    return signupModel.findOne({email: email}).then(function(result){
        console.log('result',result); 
        return result;
    });
 }
 
module.exports=router