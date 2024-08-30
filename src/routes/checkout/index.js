"use strict";

const express = require("express");

const checkoutController = require("../../controllers/checkout.controller");
const {
  asyncHandler,
  authenticationV2,
  permission,
} = require("../../auth/checkAuth");

const router = express.Router();

// authentication
router.use(authenticationV2);
///////////////////////////

router.get("/review", asyncHandler(checkoutController.checkoutReview));

router.get("/order", asyncHandler(checkoutController.orderByUser));

// permission middeware
router.use(permission("0000"));
// ///////////////////////////

module.exports = router;
