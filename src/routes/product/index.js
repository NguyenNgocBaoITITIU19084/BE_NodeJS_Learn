"use strict";

const express = require("express");

const ProductController = require("../../controllers/product.controller");
const { asyncHandler, authenticationV2 } = require("../../auth/checkAuth");
const { authentication } = require("../../auth/checkAuth");

const router = express.Router();

router.get("", asyncHandler(ProductController.getListAllProducts));
router.get(
  "/search/:keySearch",
  asyncHandler(ProductController.getListSearchProducts)
);
router.get("/:product_id", asyncHandler(ProductController.findProduct));

// authentication
router.use(authenticationV2);
///////////////////////////

router.post("", asyncHandler(ProductController.createProductV2));

// QUERY //
router.get("/draft/all", asyncHandler(ProductController.getAllDaftsForShop));
router.get(
  "/public/all",
  asyncHandler(ProductController.getAllPublicProductsForShop)
);

// //////////////////////

// PATCH
router.patch(
  "/public/:id",
  asyncHandler(ProductController.publicProductForShop)
);

router.patch(
  "/un-public/:id",
  asyncHandler(ProductController.unPublicProductForShop)
);
////////////////////

module.exports = router;
