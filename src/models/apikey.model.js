const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "api_key";
const COLLECTION_NAME = "api_keys";

// Declare the Schema of the Mongo model
var keysSchema = new mongoose.Schema(
  {
    keys: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
    permission: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: [String],
      required: true,
      enum: ["0000", "0001", "0002"],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, keysSchema);
