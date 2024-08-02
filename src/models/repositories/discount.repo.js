"use strict";

const {
  convertToObjectIdMongoose,
  unGetSelectData,
  getSelectData,
} = require("../../utils/index");
const discountModel = require("../../models/discount.model");

const findByShopIdAndCode = async ({ code, shopId }) => {
  return await discountModel
    .findOne({
      discount_code: code,
      discount_shopId: convertToObjectIdMongoose(shopId),
    })
    .lean();
};

const createNewDiscount = async ({ payload }) => {
  const {
    name,
    description,
    type,
    value,
    code,
    start_date,
    end_date,
    max_uses,
    max_per_users,
    min_oder_value,
    shopId,
    is_active,
    applies_to,
    product_ids,
  } = payload;
  return await discountModel.create({
    discount_name: name,
    discount_description: description,
    discount_type: type,
    discount_value: value, // 10.000 VND or 20%
    discount_code: code, // discount Code
    discount_start_date: new Date(start_date),
    discount_end_date: new Date(end_date),
    discount_max_uses: max_uses, // number of available discount
    discount_max_per_users: max_per_users, // used times for each person
    discount_min_order_value: min_oder_value || 0,
    discount_shopId: shopId,
    discount_is_active: is_active,
    discount_applies_to: applies_to,
    discount_product_ids: applies_to === "all" ? [] : product_ids,
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

module.exports = {
  findByShopIdAndCode,
  createNewDiscount,
  findAllDiscountCodeUnSelect,
  findAllDiscountCodeSelect,
};
