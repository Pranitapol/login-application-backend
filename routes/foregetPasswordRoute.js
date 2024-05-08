
const express = require('express');
const router = express.Router();
const signupModel=require('../models/signupModel')
const jwt=require('jsonwebtoken');
const nodeMailer=require('nodemailer')

router.post('/',(req,res)=>{
    const email= req.body.email;
    console.log(email);
   // const user= await signupModel.findOne({email:email})
    if(!user){
        console.log('user not found');
        return res.status(404).json('User not found..')
        
    }
console.log('user found...');
    // const payload= {
    //     email:user.email
    // }
    // const expiryTime=500;
    // const token=jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:expiryTime});

    // const newToken=new token({
    //     userId:user._id,
    //     token:token
    // })
    // const mailTrasport=nodeMailer.createTransport({
    //     service:'gmail',
    //     auth:{}
    // });

    // let mailDetails={
    //     from:"bookPublisher.com",
    //     to:email,
    //     suject:'Reset password',
    //     html:`<html>
    //     <body>
    //     Password Reset Request.
    //         <a href=${process.env.LIVE_URL}/reset/${token}>
    //     </body>
    //     </html>`
    // }
    // mailTrasport.sendMail(mailDetails,async(err,data)=>{
    //     if(err){
    //         console.log(err);
    //         return res.send(500).json('something went wrong...')
    //     }else{
    //         await newToken.save();
    //         res.status(200).json('email send successfully')
    //     }

    // })
})

module.exports=router