const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/USERDB");
    return console.log("Connected!");
  } catch (err) {
    return console.error(err);
  }
};

module.exports = connectDB;
