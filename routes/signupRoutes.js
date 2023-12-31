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

router.post('/login',async(req,res)=>{
   
    signupModel.findOne({'email':req.body.email}).then((result)=>{
        if(result?.password === req.body.password && result?.email === req.body.email){
            console.log(result);
            res.status(200).json({message:'Login Successful...'})
            // res.status(200).json({result})
        }else{
            if(result?.email === req.body.email && result?.password !== req.body.password){
                res.status(400).json({passwordErr:'Please enter correct Password...',message:'Invalid credentials..'})
            }
           else{
            res.status(400).send({emailErr:'Please enter correct EmailId...',message:'Invalid credentials..'})
           }
        }
   }).catch((error)=>{
    console.log(error);
    res.status(400).send({message:'Invalid email'})
   })

    
    
})
 
module.exports=router