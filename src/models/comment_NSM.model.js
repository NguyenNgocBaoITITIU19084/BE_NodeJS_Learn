"use strict";
const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Comment";
const COLLECTION_NAME = "Comments";

// Comment model is structured based on Nested Set Model algorithsm and data structured
// it is contain left and right value for each comment
// to find the nested of parent_comment, it will find value between left and right
var commentSchema = new mongoose.Schema(
  {
    comment_productId: {
      type: mongoose.Types.ObjectId,
      require: true,
      ref: "product",
    },
    comment_userId: {
      type: mongoose.Types.ObjectId,
      require: true,
      ref: "Shop",
    },
    comment_content: { type: String, require: true, default: "text" },
    comment_parentId: { type: mongoose.Types.ObjectId, ref: "Comment" },
    comment_left: { type: Number, require: true, default: 0 },
    comment_right: { type: Number, require: true, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, commentSchema);
