"use strict";

const shopModel = require("../models/shop.model");

const findByEmail = async ({
  email,
  select = { email: 1, password: 1, roles: 1, name: 1, verify: 1, status: 1 },
}) => {
  return await shopModel.findOne({ email }).select(select).lean();
};

const findShopById = async ({ shopId }) => {
  return await shopModel.findById({ _id: shopId }).lean();
};

module.exports = {
  findByEmail,
  findShopById,
};
