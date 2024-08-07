"use strict";

const express = require("express");

const { apiKey, permission } = require("../auth/checkAuth");

const router = express.Router();

// checking apiKey
router.use(apiKey);

// checking permission
router.use(permission("0000"));

router.use("/v1/api/cart", require("./cart/index.js"));
router.use("/v1/api/product", require("./product/index"));
router.use("/v1/api", require("./access/index"));

module.exports = router;
