"use strict";

const mongoose = require("mongoose"); // Erase if already required
const { default: slugify } = require("slugify");

const DOCUMENT_NAME = "product";
const COLLECTION_NAME = "products";

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: {
      type: String,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
      enum: ["Clothing", "Electronic", "Furniture"],
    },
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false,
    },
    isPublic: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
    },
    product_ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be above 5.0"],
    },
    product_variations: { type: Array, default: [] },
    product_slug: String,
    product_attributes: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// middlware of schema
productSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

// Define a sub class of product

const clothingSchema = new mongoose.Schema(
  {
    brand: { type: String },
    size: String,
    material: String,
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
  },
  {
    timestamps: true,
    collection: "clothings",
  }
);

const electronicSchema = new mongoose.Schema(
  {
    manufactuer: { type: String, required: true },
    model: String,
    color: String,
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
  },
  {
    timestamps: true,
    collection: "electronics",
  }
);

const furnitureSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
  },
  {
    timestamps: true,
    collection: "furnitures",
  }
);

//Export the model
module.exports = {
  product: mongoose.model(DOCUMENT_NAME, productSchema),
  electronic: mongoose.model("Electronic", electronicSchema),
  clothing: mongoose.model("Clothing", clothingSchema),
  furniture: mongoose.model("Furniture", furnitureSchema),
};
