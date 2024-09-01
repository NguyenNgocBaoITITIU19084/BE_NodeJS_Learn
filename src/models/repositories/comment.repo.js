"use strict";

const commentModel = require("../../models/comment_NSM.model");
const { getSelectData } = require("../../utils");

const findOneComment = async ({
  filter = {},
  option = {},
  select = [],
  sortBy = {},
}) => {
  return await commentModel
    .findOne(filter, option)
    .select(getSelectData(select))
    .sort(sortBy)
    .lean();
};

const findByIdAndUpdateComment = async ({
  filter = {},
  update = {},
  option = { new: true },
}) => {
  return await commentModel.findByIdAndUpdate(filter, update, option);
};

const findManyAndUpdateComment = async ({
  filter = {},
  update = {},
  option = { new: true },
}) => {
  return await commentModel.updateMany(filter, update, option);
};

const findCommentById = async ({ commentId }) => {
  return await commentModel.findById(commentId).lean();
};

const createComment = async ({
  comment_productId,
  comment_userId,
  comment_content,
  comment_parentId,
}) => {
  return await commentModel.create({
    comment_productId,
    comment_userId,
    comment_content,
    comment_parentId,
  });
};

module.exports = {
  findCommentById,
  findOneComment,
  findByIdAndUpdateComment,
  createComment,
  findManyAndUpdateComment,
};
