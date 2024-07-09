const multer = require("multer");
const petModel = require("../models/fileWithDataSchema");
const fs = require("fs");

const savePetDetails = async (req, res) => {
  try {
    //getting data from request
    const {
      petName,
      breed,
      color,
      age,
      petCategory,
      OwnerName,
      OwnerNumber,
      petFoodType,
      petFoodBrand,
      neutered,
    } = JSON.parse(req.body.data); // Access petName from the form data
    console.log("Received data:", req.body.data); // Log the received data for debugging
    console.log("petName:", petName);
    const images = req.files.doc || [];

    // setting file into schemas
    const Docs = images.map((e, i) => {
      return {
        filename: e.filename,
        originalname: e.originalname,
        mimetype: e.mimetype,
        size: e.size,
        path: e.path,
      };
    });

    const petList = await petModel.find();
    console.log(petList);
    let newId = petList.length + 1;

    //setting data into schemas
    const petDetails = new petModel({
      customID: newId,
      petDetails: {
        petName,
        breed,
        color,
        age,
        petCategory,
        OwnerName,
        OwnerNumber,
        petFoodType,
        petFoodBrand,
        neutered,
      },
      petImages: Docs,
    });

    await petDetails.save();
    res.status(200).json({
      success: true,
      message: "pet details saves successfully!",
      data: petDetails,
    });
  } catch (err) {
    console.log(err);
  }
};

const getPetList = async (req, res) => {
  try {
    const petList = await petModel.find();
    console.log(petList);
    let response = {
      msg: "list of all pets found!",
      data: petList,
      count: petList.length,
    };
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

const getPetDetails = async (req, res) => {
  try {
    const { OwnerNumber, petName } = req.body;
    try {
      const pet = await petModel.find({
        "petDetails.petName": petName,
        "petDetails.OwnerNumber": OwnerNumber,
      });

      if (pet) {
        console.log("Pet found:", pet);
        const response = {
          message: "Pet found",
          data: pet,
        };

        res.status(200).json(response);
      } else {
        console.log("No pet found with the given name.");
        return res.status(404).json({
          message: "Pet details not found",
        });
      }
    } catch (err) {
      console.error("Error in getPetDetails:", err);
    }
  } catch (error) {
    console.error("Error in getPetDetails:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getPetListByParams = async (req, res) => {};

const updatePetDetails = async (req, res) => {
  try {
    const { customID } = req.body;
    console.log("customID:", req.body);
    const pet = await petModel.find({ customID });
    console.log(pet);
  } catch (error) {
    console.error("Error in getPetDetails:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deletePetDetails = async (req, res) => {};

module.exports = {
  savePetDetails,
  getPetDetails,
  updatePetDetails,
  deletePetDetails,
  getPetListByParams,
  getPetList,
};

// instead of exporting all the controllers one by one just put export before every controller function
