"use strict";

const express = require("express");

const { apiKey, permission } = require("../auth/checkAuth");

const router = express.Router();

// checking apiKey
router.use(apiKey);

// checking permission
router.use(permission("0002"));

router.use("/v1/api", require("./access/index"));

module.exports = router;
