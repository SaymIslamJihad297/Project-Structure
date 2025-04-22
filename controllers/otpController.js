const userModels = require("../models/user.models");

const generateOTP = require('../utils/generateOTP');
const sendOTPEmail = require('../services/mailService');
const otpStore = require('../utils/otpStore');

module.exports.forgetPassword = async (req, res)=>{
    const {email} = req.body;

    if(!email) return res.status(403).json({message: "Email address is required"});
    
    const user = await userModels.findOne({email});

    if(user.googleId) return res.json({message: "this mail is linked with a google account!"});

    
    if(!user) return res.json({message: "There is no account with this email address"});
    
    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    otpStore[email] = {otp, expiresAt};

    try{
        await sendOTPEmail(email, otp);
        res.status(200).json({message: "OTP sent, please check your inbox and spam folder"});
    }catch(err){
        res.status(500).json({message: "Error sending OTP", error: err.message});
    }
}


module.exports.verifyOtp = async(req, res)=>{
    const {email, otp: inputOtp} = req.body;

    const record = otpStore[email];

    if(!record) return res.status(400).json({message: "No OTP Found"});

    const {otp, expiresAt} = record;

    if(Date.now() > expiresAt) return res.status(400).json({message: "OTP Expired"});

    if(otp !=inputOtp) return res.status(400).json({message: "Invalid OTP"});

    delete otpStore[email];
    res.status(200).json({message: "OTP Verified SuccessFully"});
}