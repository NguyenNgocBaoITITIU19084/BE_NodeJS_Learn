const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "notification";
const COLLECTION_NAME = "notifications";

// Declare the Schema of the Mongo model
var notificationSchema = new mongoose.Schema(
  {
    noti_content: { type: String, required: true, required: true },
    noti_senderId: { type: mongoose.Schema.Types.ObjectId, require: true },
    noti_receiverId: { type: mongoose.Schema.Types.ObjectId, require: true },
    noti_type: { type: String, enum: ["production", "promotion", "order"] },
    noti_option: { type: Object, default: true },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, notificationSchema);
