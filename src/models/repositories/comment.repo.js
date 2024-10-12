"use strict";

const commentModel = require("../../models/comment_NSM.model");
const { getSelectData } = require("../../utils");

const findComments = async (filter = {}) => {
  return await commentModel.find(filter).lean();
};

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
  return await commentModel.findById({ _id: commentId }).lean();
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

const getListComments = async ({
  filter,
  page = 1,
  limit = 10,
  sort,
  select = [],
  isPopulate = false,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  if (isPopulate) {
    return await commentModel
      .find(filter)
      .populate("comment_parentId")
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(getSelectData(select))
      .lean();
  } else {
    return await commentModel
      .find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(getSelectData(select))
      .lean();
  }
};

module.exports = {
  findCommentById,
  findOneComment,
  findByIdAndUpdateComment,
  createComment,
  findManyAndUpdateComment,
  getListComments,
  findComments,
};
