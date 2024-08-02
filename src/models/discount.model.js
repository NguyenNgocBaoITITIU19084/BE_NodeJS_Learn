"use strict";

const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    discount_name: { type: String, require: true },
    discount_description: { type: String, require: true },
    discount_type: {
      type: String,
      require: true,
      enum: ["fixed_amount", "percented"],
    },
    discount_value: { type: Number, require: true },
    discount_code: { type: String, require: true },
    discount_start_date: { type: Date, require: true },
    discount_end_date: { type: Date, require: true },
    discount_max_uses: { type: Number, require: true },
    discont_used_count: { type: Number, require: true },
    discount_user_used: { type: Array, default: [] },
    discount_max_per_users: { type: Number, require: true },
    discount_min_order_value: { type: Number, require: true },
    discount_shopId: { type: mongoose.Schema.Types.ObjectId, require: true },

    discount_is_active: { type: Boolean, default: true },
    discount_applies_to: {
      type: String,
      require: true,
      enum: ["all", "specific"],
    },
    discount_product_ids: { type: Array, default: [] },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, userSchema);
