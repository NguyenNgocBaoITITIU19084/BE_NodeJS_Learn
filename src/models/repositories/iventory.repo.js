"use strict";

const inventoryModel = require("../../models/inventory.model");
const { convertToObjectIdMongoose } = require("../../utils/index");

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unknow",
}) => {
  return await inventoryModel.create({
    inven_productId: productId,
    inven_shopId: shopId,
    inven_stock: stock,
    inven_location: location,
  });
};

const conversationInventory = async ({ productId, cartId, quantity }) => {
  const filter = {
    inven_productId: convertToObjectIdMongoose(productId),
    inven_stock: { $gt: quantity },
  };
  const update = {
    $inc: { inven_stock: -quantity },
    $push: { inven_reservations: { cartId, quantity, createOn: new Date() } },
  };
  const option = { new: true };
  return await inventoryModel.findOneAndUpdate(filter, update, option);
};

module.exports = { insertInventory, conversationInventory };
