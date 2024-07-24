"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required
const COLLECT_NAME = "keys";
const DOCUMENT_NAME = "key";
// Declare the Schema of the Mongo model
var keySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    publicKey: {
      type: String,
      required: true,
    },
    privateKey: {
      type: String,
      required: true,
    },
    refeshToken: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECT_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, keySchema);
