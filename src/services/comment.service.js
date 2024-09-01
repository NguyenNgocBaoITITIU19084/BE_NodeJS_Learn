"use strict";

const {
  findOneComment,
  createComment,
  findByIdAndUpdateComment,
  findCommentById,
  findManyAndUpdateComment,
  getListComments,
} = require("../models/repositories/comment.repo");
const { convertToObjectIdMongoose } = require("../utils");
const { NotFoundError } = require("../cores/error.response");
const { findProduct } = require("../models/repositories/product.repo");

/**
 * key features Comment Service:
 *    + add comment [User | Shop]
 *    + update comment [User | Shop]
 *    + get list comment [User| Shop]
 *    + delete comment [admin]
 */
class CommentService {
  static async createComment({
    productId,
    userId,
    parentCommentId = null,
    content,
  }) {
    const newComment = await createComment({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId,
    });

    // if parentCommentId is existed
    let maxValue;

    if (parentCommentId) {
      //rely comment
      const parent = await findCommentById({ commentId: parentCommentId });
      if (!parent) throw new NotFoundError("Not found comment");

      maxValue = parent.comment_right;

      // update comment_right value greater than value of parent
      await findManyAndUpdateComment({
        filter: {
          comment_productId: convertToObjectIdMongoose(productId),
          isDeleted: false,
          comment_right: { $gte: maxValue },
        },
        update: {
          $inc: { comment_right: 2 },
        },
      });
      // update comment_left value greater than value of parent

      await findManyAndUpdateComment({
        filter: {
          comment_productId: convertToObjectIdMongoose(productId),
          isDeleted: false,
          comment_left: { $gt: maxValue },
        },
        update: {
          $inc: { comment_left: 2 },
        },
      });

      return await findByIdAndUpdateComment({
        filter: {
          _id: newComment._id,
        },
        update: {
          $set: {
            comment_left: maxValue,
            comment_right: maxValue + 1,
          },
        },
      });
    } else {
      // parent comment
      const filter = {
        comment_productId: convertToObjectIdMongoose(productId),
        isDeleted: false,
      };
      const sortBy = { comment_right: -1 };
      const select = ["comment_right"];
      const maxRightValue = await findOneComment({ filter, sortBy, select });

      // tang gia tri cho maxValue
      maxValue = maxRightValue.comment_right + 1;

      // update vao comment
      return await findByIdAndUpdateComment({
        filter: {
          _id: newComment._id,
        },
        update: {
          $set: {
            comment_left: maxValue,
            comment_right: maxValue + 1,
          },
        },
      });
    }
  }

  static async getListComments({ productId }) {
    const product = await findProduct({ product_id: productId });
    if (!product) throw new NotFoundError("Not Found Product");

    const filter = { comment_productId: convertToObjectIdMongoose(productId) };

    return await getListComments({ filter });
  }
}

module.exports = CommentService;
