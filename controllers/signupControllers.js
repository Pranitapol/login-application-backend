const express = require("express");
const signupModel = require("../models/signupModel");
const jwt = require("jsonwebtoken");
const nodeMailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const tokenModel = require("../models/tokenModel");
require("dotenv").config();

//get all registered-user data
const getAllsignupData = async (req, res) => {
  try {
    const data = await signupModel.find({}).sort({ id: 1 });
    res.json(data);
    console.log(data);
    console.log("something else.....");
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

//user-registration
const registerUser = async (req, res) => {
  let hashedPassword;
  //to hash the password to save to db
  console.log("password", req.body.password);
  // await bcrypt.hash(req.body.password, 10, (err, hash) => {
  //   hashedPassword = hash;
  // });
  // signupModel.find({ email: req.body.email }).then(async (result) => {
  //   // console.log(result.length);
  //   // try{
  //   if (result.length !== 0) {
  //     res.status(400).json({ message: "Email Already exists" });
  //   } else {
  //     const data = new signupModel({
  //       username: req.body.username,
  //       email: req.body.email,
  //       password: hashedPassword,
  //       confirmPassword: hashedPassword,
  //     });

  //     try {
  //       const dataTosave = await data.save();
  //       console.log(dataTosave);
  //       res.status(200).json(dataTosave);
  //     } catch (err) {
  //       res.status(400).json({ message: err.message });
  //     }
  //   }
  //   //}
  //   // catch(err){
  //   //     console.log(err);
  //   // }
  // });
  let data;
  try {
    const result = await signupModel.find({ email: req.body.email });
    if (result.length !== 0) {
      res.status(400).json({ message: "Email Already exists" });
    } else {
      bcrypt.hash(req.body.password, 10, async (err, hash) => {
        data = await new signupModel({
          username: req.body.username,
          email: req.body.email,
          password: hash,
          confirmPassword: hash,
        }).save();
      });
      res.status(200).json({ msessage: "signup successfully.." });
    }
  } catch (error) {
    console.log(error);
  }
};

//user-login
const userLogin = async (req, res) => {
  signupModel
    .findOne({ email: req.body.email })
    .then((result) => {
      let dbpassword = result?.password;
      let userpassword = req.body.password;
      //to compare user entered password with existing stored password
      bcrypt
        .compare(userpassword, dbpassword)
        .then((response) => {
          if (response && result?.email === req.body.email) {
            res.status(200).json({ message: "Login Successful..." });
          } else {
            res.status(400).json({
              passwordErr: "Please enter correct Password...",
              message: "Invalid credentials..",
            });
          }
        })
        .catch((err) => {
          //if email doesn't exist in db error will appear
          res.status(400).json({
            emailErr: "Please enter correct EmailId...",
            message: "User Not Found",
          });
        });
    })
    .catch((error) => {
      console.log(error);
    });
};

//forget-password
const forgetPassword = async (req, res) => {
  const email = req.body.email;
  var id;
  let resetToken = crypto.randomBytes(32).toString("hex");
  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "300s",
  });
  console.log("jwt key..", process.env.JWT_SECRET);

  // signupModel.findOne({'email':email}).then((result)=>{
  //     if(result?.email){
  //         id=result?._id.toString();
  //         // console.log('id',result._id.toString());
  //     }else{
  //         console.log('id invalid');
  //     }
  // })
  // console.log('id',id);
  const tokenModelData = new tokenModel({
    userId: signupModel._id,
    token: token,
    createdAt: Date.now(),
  });
  try {
    const saveTokenData = await tokenModelData.save();
    res.status(200).json({ message: "Reset link has been sent to your email" });
  } catch (error) {
    res.status(400).json({ message: "error saving token" });
  }
  signupModel.findOne({ email: req.body.email }).then(async (result) => {
    try {
      if (result?.email) {
        const id = result?._id.toString();
        const LIVE_URL = `http://localhost:4200/resetPassword/${token}/${id}`;

        const transporter = nodeMailer.createTransport({
          service: "gmail",
          port: 465,
          secure: true,
          auth: {
            user: "polp6250@gmail.com",
            pass: "jrin nnao tfwz dyln",
          },
        });
        const mailOptions = {
          from: {
            name: "Maddison Foo Koch ",
            email: "polp6250@gmail.com",
          },
          to: email,
          subject: "Password reset link",
          html: `<p>please click the following link to reset your password</p>
                <p><a href=${LIVE_URL}><button> Reset Password
                </button>
                </a></p>`,
        };
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.log(err);
            res.send("Error sending email");
          } else {
            console.log(info);
            res
              .status(200)
              .json({ message: "Reset Password mail sent sucessfully" });
          }
        });
      } else {
        throw new Error("email does not exist. please check again");
      }
    } catch (err) {
      // console.log(err);
      res.status(400).json({ message: "email does not exist!" });
    }
  });
};

//reset-Password
const resetPassword = async (req, res) => {
  const password = req.body.formData.password;
  const token = req.body.token;
  const id = req.body.id;
  let hashedPassword;

  console.log(password, id);
  const result = jwt.verify(
    token,
    process.env.JWT_SECRET,
    async (err, data) => {
      if (err) {
        console.log("reset link is expired");
        res.status(404).json({ message: "reset link is expired" });
      } else {
        // console.log(data.email);
        // const result1 = await signupModel.findOne({ email: data.email });
        // console.log("result", result1);
        await bcrypt.hash(req.body.formData.password, 10, async (err, hash) => {
          console.log("hashing", hash);
          const result = await signupModel.findOneAndUpdate(
            { email: data.email },
            {
              $set: {
                password: hash,
                confirmPassword: hash,
              },
            }
          );
          res.status(200).json({ message: "password reset successfully.." });
        });
      }
    }
  );
  // , async (err, data) => {
  // if (err) {
  //   console.log("reset link is expired");
  // } else {
  //   // const salt = await bcrypt.genSalt(10);
  //   // const encryptedPassword = await bcrypt.hash(password, salt);

  //   //to hash the password to save to db
  //   try {
  //     const result = await signupModel.findOneAndUpdate(
  //       { _id: id },
  //       {
  //         $set: { password: hashedPassword, confirmPassword: hashedPassword },
  //       }
  //     );
  //     console.log("result", result);
  //     res.status(200).json({ message: "Password reset successfully..." });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  //});
  // console.log(password);
  // tokenModel.findOne({ token: token }).then(async (res) => {
  //   console.log("responsepassword", res.token, "token", token);
  //   let isValid = await bcrypt.compare(token, res.token);
  //   console.log("isvalid", isValid);
  // });
  // // console.log('passwordtoken',passwordResetToken.token,token);
  // let hashedPassword;
  // //const isValid=await bcrypt.compare(token,passwordResetToken.token)
  // bcrypt.hash(password, 10, (err, response) => {
  //   hashedPassword = response;
  // });
  // await signupModel.findByIdAndUpdate(
  //   { _id: id },
  //   { $set: { password: hashedPassword, confirmPassword: hashedPassword } }
  //   // { new: true }
  // );
  // const user = await signupModel.findById({ _id: id });
  // console.log("user", user);
};

module.exports = {
  getAllsignupData,
  registerUser,
  userLogin,
  forgetPassword,
  resetPassword,
};
