"use strict";

const express = require("express");

const NotificationController = require("../../controllers/notification.controller");
const { asyncHandler, authenticationV2 } = require("../../auth/checkAuth");
const { authentication } = require("../../auth/checkAuth");

const router = express.Router();

router.get("/", asyncHandler(NotificationController.getListNotiByUser));

// authentication
router.use(authenticationV2);
///////////////////////////

module.exports = router;
