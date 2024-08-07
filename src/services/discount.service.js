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

  /**
   * apply discount code
   * product = [{
   *    productId,
   *    shopId,
   *    price,
   *    quantity,
   *    nam
   * },
   * {
   *    productId,
   *    shopId,
   *    price,
   *    quantity,
   *    nam
   * }]
   */
  static async getDiscountAmount({ code, shopId, userId, products }) {
    const foundDiscount = await findByShopIdAndCode({ code, shopId });

    if (!foundDiscount) throw new NotFoundError("Discount is not existed!");

    const {
      discount_max_uses,
      discount_is_active,
      discount_end_date,
      discount_start_date,
      discount_min_order_value,
      discount_user_used,
      discount_max_per_users,
      discount_type,
      discount_value,
    } = foundDiscount;

    if (!discount_is_active) throw new BadRequestError("Discount is expired!");
    if (!discount_max_uses) throw new BadRequestError("Discount is run out of");

    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    )
      throw new BadRequestError("Discount is expired!");

    // check xem co gia tri toi thieu hay khong
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);
    }

    // kiem tra tong tien co lon hon gia tri thoi thieu hay khong
    if (totalOrder < discount_min_order_value)
      throw new BadRequestError(
        `discount requires a minimum order value of ${discount_min_order_value}`
      );

    // kiem tra so lan su dung discount cua mot user
    if (discount_max_per_users > 0) {
      userUsedDiscount = discount_user_used.filter((user) => user === userId);
      if (userUsedDiscount.length >= discount_max_per_users)
        throw new BadRequestError("Run out of times to use discount!");
    }

    // check type cua discount === all || specified
    let totalPrice = 0;

    if (discount_type === "percented")
      totalPrice = totalOrder - (totalOrder * discount_value) / 100;

    if (discount_type === "fixed_amount")
      totalPrice = totalOrder - discount_value;

    return {
      totalOrder,
      discount: amount,
      totalPrice,
    };
  }

  // co 2 cach de xoa 1 document
  /**
   *  1. them flag va reject khi query => nhuoc diem mat them bo nho va index trong moi document
   *  2. chuyen document can xoa vao mot database moi vao.
   *
   * */

  static async deleteDiscountCode() {
    // ....
  }

  static async cancelDiscount() {}
}

module.exports = DiscountService;
