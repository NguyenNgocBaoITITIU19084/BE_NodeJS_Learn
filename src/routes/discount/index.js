"use strict";

const express = require("express");

const DiscountController = require("../../controllers/discount.controller");
const { asyncHandler, authenticationV2 } = require("../../auth/checkAuth");

const router = express.Router();

// authentication
router.use(authenticationV2);
///////////////////////////

router.post("/", asyncHandler(DiscountController.createDiscount));

module.exports = router;
