"use strict";

const { Types } = require("mongoose");

const {
  clothing,
  furniture,
  product,
  electronic,
} = require("../../models/product.model");

const findAllDraftsForShop = async ({ query, skip, limit }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ createAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const publicProductByShop = async ({ product_shop, product_id }) => {
  const filter = { product_shop: product_shop, _id: product_id };
  const update = { $set: { isDraft: false, isPublic: true } };
  const option = { new: true };

  const result = await product.updateOne(filter, update, option);
  return result;
};

module.exports = {
  findAllDraftsForShop,
  publicProductByShop,
};
