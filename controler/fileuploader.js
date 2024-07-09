const multer = require("multer");
const files = require("../models/fileSchema");
const fs = require("fs");
const fileSchema = require("../models/fileSchema");

//set up storage for multer
const multerdiskStorage = multer.diskStorage({
  destination: () => {},

  filename: () => {},
});

const multermemoryStorage = multer.memoryStorage({
  destination: () => {},

  filename: () => {},
});

//check if upload directory exists or not then create using 'fs'
//create a file
const uploadsDir = "uploads";
if (!fs.existsSync(files)) {
  fs.mkdirSync(uploadsDir);
}

//muler config
const multerConfig = multer({
  storage: multerdiskStorage,
  //   fileFilter: "",
  //   limits: 100000,
});

//file upload function
const uploadSingleFile = async (req, res) => {
  try {
    const file = req.file;
    const fileToSave = new fileSchema({
      fileName: file.fileName,
      size: file.size,
      mimeType: file.mimeType,
      uploadDate: file.uploadDate,
      path: file.path,
      originalName: file.originalName,
    });

    await fileToSave.save();

    res.status(200).json({
      message: "File uploaded successfully!",
      file: newFile,
    });
  } catch (err) {
    console.log(err);
  }
};

//file fetcher function
const fetchFile = async (req, res) => {
  try {
    const filedetails = req.params;
    const foundFile = await fileSchema.findOne({
      fileName: filedetails.fileName,
    });
    if (!foundFile) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    //create file path
    const filePath = path.join(__dirname, foundFile.path);
    res.sendFile(filePath);
  } catch (err) {
    res.status(500).json({
      message: "Error retrieving file",
      error: err,
    });
    console.log(err);
  }
};

const saveFileWithOtherData = async (res, res) => {};

const saveMultipleFiles = async (res, res) => {};

const updateSingleFile = async (res, res) => {};

const updateMultipleFiles = async (res, res) => {};

const updateMultipleFilesWithData = async (res, res) => {};

module.exports = {
  uploadSingleFile,
  fetchFile,
  multerConfig,
  saveFileWithOtherData,
  saveMultipleFiles,
  updateSingleFile,
  updateMultipleFiles,
  updateMultipleFilesWithData
};
