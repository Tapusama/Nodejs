const mongoose = require("mongoose");

const fileDocumentDataSchema = new mongoose.Schema({
  customID: { type: Number, unique: true, required: true }, // Custom sequential ID field
  
    // Other fields in your schema
  petDetails: {
    petName: { type: String, required: true },
    breed: { type: String, required: true },
    color: { type: String, required: true },
    age: { type: Number, required: true },
    petCategory: { type: String, required: true },
    OwnerName: { type: String, required: true },
    OwnerNumber: { type: String, required: true },
    petFoodType: { type: String, required: true },
    petFoodBrand: { type: String, required: true },
    neutered: { type: Boolean, required: true },
  },
  petImages: [
    {
      filename: String,
      originalname: String,
      mimetype: String,
      size: Number,
      path: String,
      uploadDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model("petdatas", fileDocumentDataSchema);
