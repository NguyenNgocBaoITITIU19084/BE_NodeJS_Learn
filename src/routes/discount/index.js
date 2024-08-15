"use strict";

const express = require("express");

const DiscountController = require("../../controllers/discount.controller");
const {
  asyncHandler,
  authenticationV2,
  permission,
} = require("../../auth/checkAuth");

const router = express.Router();

router.get("/", asyncHandler(DiscountController.getDiscounts));

// authentication
router.use(authenticationV2);
///////////////////////////
router.post(
  "/getDiscountAmount",
  asyncHandler(DiscountController.getDiscountAmount)
);

router.patch("/update", asyncHandler(DiscountController.updateDiscount));

router.post("/", asyncHandler(DiscountController.createDiscount));

// permission middeware
router.use(permission("0000"));
// ///////////////////////////

router.patch("/cancel", asyncHandler(DiscountController.cancelDiscount));
router.patch("/active", asyncHandler(DiscountController.activeDiscount));

module.exports = router;
