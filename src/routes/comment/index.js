"use strict";

const express = require("express");

const commentController = require("../../controllers/comment.controller");
const {
  asyncHandler,
  authenticationV2,
  permission,
} = require("../../auth/checkAuth");

const router = express.Router();

// authentication
router.use(authenticationV2);
///////////////////////////

router.post("/create", asyncHandler(commentController.createComment));

// permission middeware
router.use(permission("0000"));
// ///////////////////////////

module.exports = router;
