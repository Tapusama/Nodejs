const express = require("express");
const app = express();
const connectDB = require("./database/mongoose");
const jwt = require("jsonwebtoken");
// Ensure the uploads directory exists
const fs = require("fs");
const path = require("path");
const uploadDir = "uploads";
const { upload, multerErrorHandling } = require("./controler/uploadConfig");
const bodyParser = require("body-parser");
const multer = require("multer");
const {
  registerUser,
  loginUserwithoutEncript,
  loginUserwithEncript,
  changePasswordwithoutOtp,
  otpSenderViaEmail,
} = require("./controler/auth");
const {
  savePetDetails,
  getPetDetails,
  updatePetDetails,
  deletePetDetails,
  getPetListByParams,
  getPetList,
} = require("./apis/filewithData");

// Middleware for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
app.use(multerErrorHandling);


// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to my node js application." });
});
// write a middleware for this not a different route
app.get("/tokenCheck", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  console.log(token);
  //Authorization: 'Bearer TOKEN'
  if (!token) {
    res.status(200).json({
      success: false,
      message: "Error!Token was not provided.",
    });
  }
  //Decoding the token
  const decodedToken = jwt.verify(token, "secretkey");
  res.status(200).json({
    success: true,
    data: {
      password: decodedToken.password,
      email: decodedToken.email,
    },
  });
});
// make a different route handler file and include the file here , do not bulge the code 
// for reference use this https://github.com/thehumanecoder/nodebook/tree/master/main_server
app.post("/register", registerUser);
app.post("/loginwithencrypt", loginUserwithEncript);
app.post("/loginwithoutencrypt", loginUserwithoutEncript);
app.post("/changepasswordwithoutotp", changePasswordwithoutOtp);
app.post("/sendOtpViaMail", otpSenderViaEmail);
app.post(
  "/savePet",
  // upload.none(),
  upload.fields([{ name: "doc", maxCount: 10 }]),
  savePetDetails
);
// app.post("/getPetListByParams", getPetListByParams);
app.get("/getAllPets", getPetList);
app.post("/getPetdetails", getPetDetails);
app.post("/updatePetDetails", updatePetDetails);

// set port, listen for requests
// it is not an async process , by default out it in sync 
const PORT = 8080;
const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("error =>", error);
  }
};
start();
