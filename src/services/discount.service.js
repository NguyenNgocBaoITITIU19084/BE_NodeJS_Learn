"use strict";

const { BadRequestError, NotFoundError } = require("../cores/error.response");
const { findAllProducts } = require("../models/repositories/product.repo");
const {
  findByShopIdAndCode,
  createNewDiscount,
  findAllDiscountCodeUnSelect,
} = require("../models/repositories/discount.repo");
const { convertToObjectIdMongoose } = require("../utils");
const discountModel = require("../models/discount.model");

class DiscountService {
  static async createDiscount(payload) {
    const { code, start_date, end_date, shopId } = payload;

    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError("Discount code is expired!");
    }

    if (new Date(start_date) >= new Date(end_date))
      throw new BadRequestError("Start date must be less than end date");

    const foundDiscount = await findByShopIdAndCode({ code, shopId });

    if (foundDiscount && foundDiscount.discount_is_active)
      throw new BadRequestError("Discount is existed!");
    // create index for discount code

    const newDiscount = await createNewDiscount(payload);
    return newDiscount;
  }

  static async updateDiscount() {
    // ...
  }

  // get all product with discount code by user
  static async getAllDiscountCodesWithProduct({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    const foundDiscount = await findByShopIdAndCode({ code, shopId });

    if (!foundDiscount && !foundDiscount.discount_is_active)
      throw new NotFoundError("Discount is existed!");

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products;
    if (discount_applies_to === "all") {
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectIdMongoose(shopId),
          isPublic: true,
        },
        page: +page,
        limit: +limit,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    if (discount_applies_to === "specific") {
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublic: true,
        },
        page: +page,
        limit: +limit,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    return products;
  }

  // get all product with discount code by shop
  static async getAllDiscountCodeByShop({ limit, page, shopId }) {
    const discount = await findAllDiscountCodeUnSelect({
      page: +page,
      limit: +limit,
      model: discountModel,
      filter: {
        discount_shopId: convertToObjectIdMongoose(shopId),
        discount_is_active: true,
      },
      unSelect: ["__v", "discount_shopId"],
    });

    return discount;
  }
}

module.exports = DiscountService;
