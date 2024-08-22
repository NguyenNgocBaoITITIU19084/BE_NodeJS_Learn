"use strict";

const { BadRequestError } = require("../cores/error.response");
const inventoryModel = require("../models/inventory.model");

const { findProduct } = require("../models/repositories/product.repo");
const { findShopById } = require("../services/shop.service");

class InventoryService {
  static async addStockInventory({
    inven_productId,
    location,
    stock,
    inven_shopId,
  }) {
    const foundProduct = await findProduct({
      product_id: inven_productId,
      unSelect: ["__v"],
    });
    if (!foundProduct) throw new BadRequestError("Invalid Input");

    const foundShop = await findShopById({ shopId: inven_shopId });
    if (!foundShop) throw new BadRequestError("Invalid Input");

    const filter = { inven_productId, inven_shopId };
    const update = {
      $inc: { inven_stock: stock },
      $set: { inven_location: location },
    };
    const option = { upsert: true, new: true };
    return await inventoryModel.findOneAndUpdate(filter, update, option);
  }
}

module.exports = InventoryService;
