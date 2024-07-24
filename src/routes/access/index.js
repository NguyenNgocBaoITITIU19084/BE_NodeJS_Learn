"use strict";

const express = require("express");

const AccessControllers = require("../../controllers/access.controller");

const router = express.Router();

router.post("/shop/sign-up", AccessControllers.signUp);

module.exports = router;
