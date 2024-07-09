const nodemailer = require("nodemailer");

const mailSender = async (email, otp,recipientEmail,password) => {
  const transportOptions = {
    service: "gmail",
    auth: {
      user: "tapaswinimishra132@gmail.com",
      pass: "jtdpnwjmxjzyfhwj",
    },
  };

  const transporter = nodemailer.createTransport(transportOptions);

  const mailOptions = {
    from: "tapaswinimishra132@gmail.com",
    to: recipientEmail,
    subject: "YOUR OTP FOR VERIFICATION",
    text: `your otp is ${otp}`,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.log(error);
  }
};

module.exports=mailSender
