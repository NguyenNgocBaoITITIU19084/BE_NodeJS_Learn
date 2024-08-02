"use strict";

const { BadRequestError } = require("../cores/error.response");
const discountModel = require("../models/discount.model");
const { convertToObjectIdMongoose } = require("../utils/index");

class DiscountService {
  static async createDiscount(payload) {
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

    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError("Discount code is expired!");
    }

    if (new Date(start_date) >= new Date(end_date))
      throw new BadRequestError("Start date must be less than end date");

    const foundDiscount = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongoose(shopId),
      })
      .lean();

    if (foundDiscount && foundDiscount.discount_is_active)
      throw new BadRequestError("Discount is existed!");
    // create index for discount code

    const newDiscount = await discountModel.create({
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
    return newDiscount;
  }
}

module.exports = DiscountService;
