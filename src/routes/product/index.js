"use strict";

const express = require("express");

const ProductController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const { authentication } = require("../../auth/checkAuth");

const router = express.Router();

// authentication
router.use(authentication);
///////////////////////////

router.post("", asyncHandler(ProductController.createProduct));

module.exports = router;
