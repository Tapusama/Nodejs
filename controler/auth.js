const User = require("../models/userSchrema");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { body, validationResult } = require("express-validator");
let jwt = require("jsonwebtoken");
const otpFunction = require("../utils/otpgeneratorFunction");
const mailSender = require("../utils/emailSender");

//resister the new user
const registerUser = async (req, res) => {
  //check if there is error in req.body
  let error = validationResult(req.body);

  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }
  const { email, password, name, mobile } = req.body;
  console.log(email, password, name, mobile);
  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      email,
      password: hashedPassword,
      //password: password,
      name,
      mobile,
    });

    let result = await user.save();
    res.send({
      data: result,
      status: 201,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

const loginUserwithoutEncript = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    res.send({
      data: user,
      status: 200,
      message: "Logged in successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

const loginUserwithEncript = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    let token;
    try {
      token = jwt.sign(
        {
          email: user.email,
          password: user.password,
        },
        "secretkey",
        { expiresIn: "1h" }
      );
    } catch (err) {
      console.log(err);
    }
    res.send({
      data: user,
      token: `Bearer ${token}`,
      status: 200,
      message: "Logged in successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

const changePasswordwithoutOtp = async (req, res) => {
  try {
    const { email, password, newPassword, confirmPassword } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      let json = res.status(400).json({ message: "Email not found!!" });
      res.send(json);
    }

    let ismatch = await bcrypt.compare(password, user.password);
    if (!ismatch) {
      let json = res.status(400).json({ message: "invalid password!" });
      res.send(json);
    }

    let token;
    try {
      token = jwt.sign(
        {
          email: user.email,
        },
        "secretkey",
        { expiresIn: "1h" }
      );
    } catch (err) {
      console.log(err);
    }

    if (newPassword === confirmPassword) {
      let salt = await bcrypt.genSalt(10);
      let hashpashword = await bcrypt.hash(confirmPassword, salt);
      user.password = hashpashword;
      await user.save();

      // Only include necessary user data in the response
      const userResponse = {
        id: user._id,
        email: user.email,
      };

      res.send({
        data: userResponse,
        token: `Bearer ${token}`,
        status: 201,
        message: "password changed successfully",
      });
    } else {
      res.send({
        status: 400,
        message: "password doesnot match!!",
      });
    }
  } catch (err) {
    console.error(err);
  }
};

const changePasswordwithOtp = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      let json = res.status(400).json({ message: "Email not found!!" });
      res.send(json);
    }
  } catch (err) {
    console.error(err);
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;
};

const otpSenderViaEmail = async (req, res) => {
  try {
    const { email,password} = req.body;
    let recipientEmail = email;

    let user = await User.findOne({ email });
    if (!user) {
      let json = res.status(400).json({ message: "Email not found!!" });
      res.send(json);
    }

    let otp = otpFunction();
    await mailSender(email, otp, recipientEmail,password);
  } catch (err) {
    console.error(err);
  }
};

const otpGeneratorFormobile = () => {};

module.exports = {
  registerUser,
  loginUserwithoutEncript,
  loginUserwithEncript,
  changePasswordwithoutOtp,
  otpSenderViaEmail
};
