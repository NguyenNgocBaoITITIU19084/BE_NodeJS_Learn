"use strict";

const cartModel = require("../../models/cart.model");

const findOneCart = async ({ filter, model }) => {
  return await model.findOne(filter).lean();
};

const createUserCart = async ({ userId, product }) => {
  const query = { cart_userId: userId };
  const InsertOrUpdate = {
    $addToSet: { cart_products: product },
  };
  const option = { new: true, upsert: true };

  return await cartModel.findOneAndUpdate(query, InsertOrUpdate, option);
};

const findCartAndUpdate = async ({
  filter,
  update,
  option = { upsert: true, new: true },
}) => {
  return await cartModel.findOneAndUpdate(filter, update, option);
};

module.exports = {
  findOneCart,
  createUserCart,
  findCartAndUpdate,
};
