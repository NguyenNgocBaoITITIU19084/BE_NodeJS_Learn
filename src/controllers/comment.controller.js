"use strict";

const { CREATED, SuccessResponse } = require("../cores/success.response");
const commentService = require("../services/comment.service");

class DiscountController {
  createComment = async (req, res) => {
    const { productId, parentCommentId = null, content } = req.body;
    console.log(`::[P]::createComment::`, {
      userId: req.user.userId,
      productId,
      parentCommentId,
      content,
    });
    new CREATED({
      message: "Success createComment by user!",
      metadata: await commentService.createComment({
        userId: req.user.userId,
        productId,
        parentCommentId,
        content,
      }),
    }).send(res);
  };

  getListComments = async (req, res) => {
    const { productId } = req.body;
    console.log(`::[P]::getListComments::`, {
      productId,
    });
    new SuccessResponse({
      message: "Success getListComments by user!",
      metadata: await commentService.getListComments({
        productId,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
