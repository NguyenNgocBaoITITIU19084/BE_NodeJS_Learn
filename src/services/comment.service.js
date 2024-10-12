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
const { NotFoundError, BadRequestError } = require("../cores/error.response");
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

  static async getListComments({ productId, page, limit, sort, select }) {
    const product = await findProduct({ product_id: productId });
    if (!product) throw new NotFoundError("Not Found Product");

    const filter = {
      comment_productId: convertToObjectIdMongoose(productId),
      isDeleted: false,
    };

    return await getListComments({
      filter,
      page,
      limit,
      sort,
      select,
      isPopulate: true,
    });
  }

  static async getListChildComment({
    productId,
    commentId,
    page,
    limit,
    sort,
    select,
  }) {
    const product = await findProduct({ product_id: productId });
    if (!product) throw new NotFoundError("Not Found Product");

    const parentComment = await findOneComment({
      filter: { _id: commentId, isDeleted: false },
    });
    console.log("parentComment", parentComment);

    if (!parentComment) throw new NotFoundError("Not Found Comment");

    const filter = {
      comment_productId: convertToObjectIdMongoose(productId),
      comment_parentId: convertToObjectIdMongoose(commentId),
      isDeleted: false,
      comment_left: { $gt: parentComment.comment_left },
      comment_right: { $lt: parentComment.comment_right },
    };

    const listChildComment = await getListComments({
      filter,
      page,
      sort,
      limit,
      select,
      isPopulate: false,
    });
    return { page, limit, parentComment, listChildComment };
  }

  static async deleteCommentById({ commentId, userId, productId }) {
    const product = await findProduct({ product_id: productId });
    if (!product) throw new NotFoundError("Not Found Product");

    const commentObj = await findCommentById({ commentId });
    if (!commentObj) throw new NotFoundError("Not Found Comment");

    if (commentObj.isDeleted || !commentObj.comment_userId.equals(userId))
      throw new BadRequestError("Invalid Request");

    console.log(commentObj);

    const rightValue = commentObj.comment_right;
    const leftValue = commentObj.comment_left;
    const widthValue = rightValue - leftValue + 1;

    // update delete flag of child comment
    await findManyAndUpdateComment({
      filter: {
        comment_left: { $gt: leftValue },
        comment_right: { $lt: rightValue },
        comment_productId: productId,
        isDeleted: false,
      },
      update: {
        isDeleted: true,
      },
    });

    // update right value and left value of comment
    await findManyAndUpdateComment({
      filter: {
        comment_right: { $gt: rightValue },
        comment_productId: productId,
        isDeleted: false,
      },
      update: {
        $inc: { comment_right: -widthValue },
      },
    });
    await findManyAndUpdateComment({
      filter: {
        comment_left: { $gt: rightValue },
        comment_productId: productId,
        isDeleted: false,
      },
      update: {
        $inc: { comment_left: -widthValue },
      },
    });
    return true;
  }
}

module.exports = CommentService;
