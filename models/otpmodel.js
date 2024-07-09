import mongoose from "mongoose";

const otpSchema=new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required: true
    },
    otp:{
        type:String,
        unique:true,
        required: true
    }

})

module.exports=mongoose.model("otps",otpSchema)