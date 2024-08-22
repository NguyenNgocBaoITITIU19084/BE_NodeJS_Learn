"use strict";

const { CREATED, SuccessResponse } = require("../cores/success.response");
const inventoryService = require("../services/inventory.service");

class InventoryController {
  addStockToInventory = async (req, res) => {
    const { inven_productId, location, stock, inven_shopId } = req.body;
    console.log(`::[P]::addStockToInventory::`, {
      inven_productId,
      location,
      stock,
      inven_shopId,
    });
    new CREATED({
      message: "addStockToInventory success!",
      metadata: await inventoryService.addStockInventory({
        inven_productId,
        location,
        stock,
        inven_shopId,
      }),
    }).send(res);
  };
}

module.exports = new InventoryController();
