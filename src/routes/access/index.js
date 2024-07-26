"use strict";

const express = require("express");

const AccessControllers = require("../../controllers/access.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const { authentication } = require("../../auth/checkAuth");

const router = express.Router();

router.post("/shop/login", asyncHandler(AccessControllers.logIn));
router.post("/shop/sign-up", asyncHandler(AccessControllers.signUp));

// authentication
router.use(authentication);
///////////////////////////

router.post("/shop/authen", (req, res) => {
  return res.json({ message: "hello" });
});

module.exports = router;
