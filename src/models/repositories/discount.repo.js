"use strict";

const {
  convertToObjectIdMongoose,
  unGetSelectData,
  getSelectData,
} = require("../../utils/index");
const discountModel = require("../../models/discount.model");

const findById = async (id) => {
  return await discountModel.findById({ _id: id });
};

const findOne = async (filter = {}) => {
  return await discountModel.findOne(filter);
};

const findByShopIdAndCode = async ({ code, shopId }) => {
  return await discountModel
    .findOne({
      discount_code: code,
      discount_shopId: convertToObjectIdMongoose(shopId),
    })
    .lean();
};

const createNewDiscount = async ({ payload, discount_shopId }) => {
  const {
    discount_name,
    discount_description,
    discount_type,
    discount_value,
    discount_code,
    discount_start_date,
    discount_end_date,
    discount_max_uses,
    discount_max_per_users,
    discount_min_oder_value,
    discount_applies_to,
    discount_product_ids,
  } = payload;
  return await discountModel.create({
    discount_name,
    discount_description,
    discount_type,
    discount_value, // 10.000 VND or 20%
    discount_code, // discount Code
    discount_start_date: new Date(discount_start_date),
    discount_end_date: new Date(discount_end_date),
    discount_max_uses, // number of available discount
    discount_max_per_users, // used times for each person
    discount_min_order_value: discount_min_oder_value || 0,
    discount_shopId,
    discount_applies_to,
    discount_product_ids:
      discount_applies_to === "all" ? [] : discount_product_ids,
  });
};

const findAllDiscountCodeUnSelect = async ({
  page = 1,
  limit = 50,
  sort = "ctime",
  filter,
  unSelect,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const doccuments = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unSelect))
    .lean();

  return doccuments;
};

const findAllDiscountCodeSelect = async ({
  page = 1,
  limit = 50,
  sort = "ctime",
  filter,
  unSelect,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const doccuments = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(unSelect))
    .lean();

  return doccuments;
};

const findOneAndUpdate = async ({ filter, update, option = { new: true } }) => {
  return await discountModel.findOneAndUpdate(filter, update, option);
};

module.exports = {
  findByShopIdAndCode,
  createNewDiscount,
  findAllDiscountCodeUnSelect,
  findAllDiscountCodeSelect,
  findOneAndUpdate,
  findById,
  findOne,
};
