import mongoose from "mongoose";

const mobileOtpSchema=new mongoose.Schema({
    mobile:{
        type:Number,
        unique:true,
        required: true
    },
    otp:{
        type:String,
        unique:true,
        required: true
    }

})

module.exports=mongoose.model("otpsMobile",mobileOtpSchema)