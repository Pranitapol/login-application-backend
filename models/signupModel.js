const mongoose = require('mongoose');
const signupSchema=new mongoose.Schema({
    username:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    confirmPassword:{
        type:String
    }
},
{collection:'signup-data'}
)

module.exports=mongoose.model('signup-data',signupSchema)