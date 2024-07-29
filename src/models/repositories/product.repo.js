"use strict";

const { Types } = require("mongoose");

const {
  clothing,
  furniture,
  product,
  electronic,
} = require("../../models/product.model");
const { getSelectData } = require("../../utils/index");

const searchPublicProductsByUser = async ({ keySearch }) => {
  const keySearchRegex = new RegExp(keySearch);
  const results = await product
    .find(
      {
        // isPublic: true,
        $text: { $search: keySearchRegex },
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();
  return results;
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

  return products;
};

const findAllDraftsForShop = async ({ query, skip, limit }) => {
  return await queryProduct({ query, skip, limit });
};

const findAllPublicProductsForShop = async ({ query, skip, limit }) => {
  return await queryProduct({ query, skip, limit });
};

const queryProduct = async ({ query, skip, limit }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ createAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const publicProductByShop = async ({ product_shop, product_id }) => {
  const filter = { product_shop: product_shop, _id: product_id };
  const update = { $set: { isDraft: false, isPublic: true } };
  const option = { new: true };

  const result = await product.updateOne(filter, update, option);
  return result;
};

const unPublicProductByShop = async ({ product_shop, product_id }) => {
  const filter = { product_shop: product_shop, _id: product_id };
  const update = { $set: { isDraft: true, isPublic: false } };
  const option = { new: true };

  const result = await product.updateOne(filter, update, option);
  return result;
};

module.exports = {
  findAllDraftsForShop,
  publicProductByShop,
  findAllPublicProductsForShop,
  unPublicProductByShop,
  searchPublicProductsByUser,
  findAllProducts,
};
