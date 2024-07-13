const express = require("express");
const router = express.Router();
const {
  getAllsignupData,
  registerUser,
  userLogin,
  forgetPassword,
  resetPassword,
} = require("../controllers/signupControllers");

//get all signup-data
router.get("/getdata", getAllsignupData);

//user registration
router.post("/post", registerUser);

//user login
router.post("/login", userLogin);

// forget password route
router.post("/send-email", forgetPassword);

//reset-password route
router.post("/reset-password", resetPassword);

module.exports = router;
