const express = require('express');
const router = express.Router();
const signupModel=require('../models/signupModel')
const jwt=require('jsonwebtoken');
const nodeMailer=require('nodemailer')
const bcrypt=require('bcryptjs');
const crypto=require('crypto');
const tokenModel=require('../models/tokenModel');


router.get('/getdata',async(req,res)=>{
    try{
        const data= await signupModel.find({}).sort({id:1});
        res.json(data);
        console.log(data)
        console.log('something else.....');
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
})
//user registration
router.post('/post',async(req,res)=>{
   let hashedPassword;
   //to hash the password to save to db
    bcrypt.hash(req.body.password,10,(err,hash)=>{
        console.log('hashing',hash);
        hashedPassword=hash;
        })

    signupModel.find({"email":req.body.email}).then(async (result)=>{
        console.log(result.length);
        // try{
        if (result.length !== 0) { 
            res.status(400).json({message:'Email Already exists'})
        }else{
            const data= new signupModel({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword,
            confirmPassword:hashedPassword
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

//user login 
router.post('/login',(req,res)=>{

    signupModel.findOne({'email':req.body.email}).then( (result)=>{
    
        let dbpassword = result?.password;
        let userpassword = req.body.password;
            //to compare user entered password with existing stored password
        bcrypt.compare(userpassword,dbpassword).then((response)=>{
        
            if(response && result?.email === req.body.email){
                res.status(200).json({message:'Login Successful...'})
            }
            else{
                res.status(400).json({passwordErr:'Please enter correct Password...',message:'Invalid credentials..'})  
            }   
        }).catch((err)=>{
           // console.log('error',err);
           //if email doesn't exist in db error will appear
           res.status(400).json({emailErr:'Please enter correct EmailId...',message:'User Not Found'})
        });     
    
    }).catch((error)=>{
        console.log(error); 
   })
})

//method to forget password-Reset link
router.post('/send-email',async (req,res)=>{
    const email=req.body.email;
    let resetToken=crypto.randomBytes(32).toString('hex');
    const token=jwt.sign({email},resetToken,{expiresIn:'300s'})
    console.log('token..',token);
   

   const tokenModelData=  new tokenModel({
       userId: signupModel._id,
       token:token,
       createdAt:Date.now()
    })
    try{
    const saveTokenData= await tokenModelData.save();
    res.status(200).json(saveTokenData)
    }catch(error){
        res.status(400).json({message:'error saving token'})
    }
    const LIVE_URL=`http://localhost:4200/resetPassword/${token}/${signupModel._id}}`;
    signupModel.findOne({'email':req.body.email}).then( (result)=>{
    try{
       if(result?.email){
            const transporter=nodeMailer.createTransport({
               service:'gmail',
               port:465,
               secure:true,
                auth:{
                    user: 'polp6250@gmail.com',
                    pass: 'jrin nnao tfwz dyln'
                }
            })
            const mailOptions={
                from:{
                    name:'Maddison Foo Koch ',
                    email:'polp6250@gmail.com'
                },
                to:email,
                subject:'Password reset link',
                html:`<p>please click the following link to reset your password</p>
                <p><a href=${LIVE_URL}><button> Reset Password
                </button>
                </a></p>`
            };
            transporter.sendMail(mailOptions,(err,info)=>{
                if (err) {
                    console.log(err);
                    res.send('Error sending email');
                  } else {
                    console.log(info);
                    res.status(200).json({message:"Reset Password mail sent sucessfully"});
                  }
            })
       }else{
        throw new Error('email does not exist. please check again')
       }
    }catch(err){
       // console.log(err);
        res.status(400).json({message:'email does not exist!'})
    }
    })
})

router.post('/reset-password',(req,res)=>{
    const password=req.body.password;
    jwt.verify()
})
module.exports=router