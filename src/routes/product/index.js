"use strict";

const express = require("express");

const ProductController = require("../../controllers/product.controller");
const { asyncHandler, authenticationV2 } = require("../../auth/checkAuth");
const { authentication } = require("../../auth/checkAuth");

const router = express.Router();

// authentication
router.use(authenticationV2);
///////////////////////////

router.post("", asyncHandler(ProductController.createProduct));

module.exports = router;
