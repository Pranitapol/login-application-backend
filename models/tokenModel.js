const mongoose= require('mongoose');
const signupModel=require('../models/signupModel');
const Schema = mongoose.Schema;

const tokenSchema=new mongoose.Schema({

    userId:{
        type: Schema.Types.ObjectId,
       // required:true,
        ref:'signup-data'
    },
    token:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now,
        expires:500
    }
},
{collection:'tokens'}
)
module.exports=mongoose.model('tokens',tokenSchema)