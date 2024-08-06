"use strict";

const express = require("express");

const CartController = require("../../controllers/cart.controller");
const { asyncHandler, authenticationV2 } = require("../../auth/checkAuth");

const router = express.Router();

// authentication
router.use(authenticationV2);
///////////////////////////

router.post("/", asyncHandler(CartController.addToCart));
router.get("/", asyncHandler(CartController.getCartList));
router.delete("/", asyncHandler(CartController.deleteItemCart));
router.patch(
  "/update-quantity",
  asyncHandler(CartController.updateQuantityProductInCart)
);

module.exports = router;
