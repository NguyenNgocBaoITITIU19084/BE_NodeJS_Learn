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
    const { productId, page, limit, sort, select } = req.body;
    console.log(`::[P]::getListComments::`, {
      productId,
      page,
      limit,
      sort,
      select,
    });
    new SuccessResponse({
      message: "Success getListComments by user!",
      metadata: await commentService.getListComments({
        productId,
        page,
        limit,
        sort,
        select,
      }),
    }).send(res);
  };

  getListChildComment = async (req, res) => {
    const { productId, page, limit, sort, commentId, select } = req.body;
    console.log(`::[P]::getListChildComment::`, {
      productId,
      commentId,
      page,
      limit,
      sort,
      select,
    });
    new SuccessResponse({
      message: "Success getListChildComment by user!",
      metadata: await commentService.getListChildComment({
        productId,
        commentId,
        page,
        limit,
        sort,
        select,
      }),
    }).send(res);
  };
  deleteComment = async (req, res) => {
    const { commentId, productId } = req.body;
    console.log(`::[P]::deleteComment::`, {
      userId: req.user.userId,
      commentId,
      productId,
    });
    new SuccessResponse({
      message: "Success deleteComment by user!",
      metadata: await commentService.deleteCommentById({
        userId: req.user.userId,
        commentId,
        productId,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
