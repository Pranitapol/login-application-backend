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

    signupModel.find({"email":req.body.email}).then(async (result)=>{
        console.log(result.length);
        // try{
        if (result.length !== 0) {
            
            res.status(400).json({message:'Email Already exists'})
        }else{
            const data= new signupModel({
            username:req.body.username,
            email:req.body.email,
            password:req.body.password,
            confirmPassword:req.body.confirmPassword
        })
        try{
            const dataTosave = await data.save();
            res.status(200).json(dataTosave)
        }catch(err){
            res.status(400).json({message:err.message})
        }
        }
    //}
    // catch(err){
    //     console.log(err);
    // }
    })

})

 
module.exports=router