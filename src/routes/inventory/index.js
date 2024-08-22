"use strict";

const express = require("express");

const inventoryController = require("../../controllers/inventory.controller");
const { asyncHandler, authenticationV2 } = require("../../auth/checkAuth");

const router = express.Router();

// authentication
router.use(authenticationV2);
///////////////////////////

router.post(
  "/add-stock",
  asyncHandler(inventoryController.addStockToInventory)
);

module.exports = router;
