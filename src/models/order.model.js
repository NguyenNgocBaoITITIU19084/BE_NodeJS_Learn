"use strict";

const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

var orderSchema = new mongoose.Schema(
  {
    order_userId: { type: mongoose.Types.ObjectId, require: true },
    order_checkout: { type: Object, default: {} },
    /**
     * order_checkout = {
     *  totalPrice,
     *  totalApplyDiscount
     *  feeShip
     * }
     * */

    order_shipping: { type: Object, default: {} },
    /**
     * street,
     * city,
     * state,
     * country
     * */
    order_payment: { type: Object, default: {} },
    order_products: { type: Array, require: true }, // list products orders,
    order_trackingNumber: { type: String, default: "#000012282024" },
    order_status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivery", "cancel"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, orderSchema);
