"use strict";

const express = require("express");

const AccessControllers = require("../../controllers/access.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const { authentication, authenticationV2 } = require("../../auth/checkAuth");

const router = express.Router();

router.post("/shop/login", asyncHandler(AccessControllers.logIn));
router.post("/shop/sign-up", asyncHandler(AccessControllers.signUp));

// authentication
router.use(authenticationV2);
///////////////////////////

router.post("/shop/logout", asyncHandler(AccessControllers.logOut));
router.post(
  "/shop/handRefeshToken",
  asyncHandler(AccessControllers.handRefeshToken)
);

module.exports = router;
