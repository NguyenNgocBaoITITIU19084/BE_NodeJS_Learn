"use strict";

const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../cores/error.response");
const { findAllProducts } = require("../models/repositories/product.repo");
const {
  findByShopIdAndCode,
  createNewDiscount,
  findAllDiscountCodeUnSelect,
  findOneAndUpdate,
  findById,
  findOne,
} = require("../models/repositories/discount.repo");
const { convertToObjectIdMongoose } = require("../utils");
const discountModel = require("../models/discount.model");

class DiscountService {
  static async createDiscount({ payload, shopId }) {
    const { discount_code, discount_start_date, discount_end_date } = payload;

    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    ) {
      throw new BadRequestError("Discount code is expired!");
    }

    if (new Date(discount_start_date) >= new Date(discount_end_date))
      throw new BadRequestError("Start date must be less than end date");

    const foundDiscount = await findByShopIdAndCode({
      code: discount_code,
      shopId: shopId.toString(),
    });
    console.log(",foundDiscountfoundDiscount", foundDiscount);

    if (foundDiscount) throw new BadRequestError("Discount is existed!");
    // create index for discount code

    if (foundDiscount && !foundDiscount.discount_is_active)
      throw new BadRequestError("Discount is expired!");
    // create index for discount code

    const newDiscount = await createNewDiscount({
      payload,
      discount_shopId: shopId,
    });
    return newDiscount;
  }

  static async updateDiscount({ body, shopId }) {
    const {
      discount_id,
      discount_name,
      discount_description,
      discount_type,
      discount_value,
      discount_code,
      discount_start_date,
      discount_end_date,
      discount_max_uses,
      discount_max_per_users,
      discount_min_order_value,
      discount_applies_to,
    } = body;

    const foundDiscount = await findOne({
      discount_shopId: shopId,
      _id: discount_id,
    });

    if (!foundDiscount) throw new BadRequestError("Discount is invalid!");

    if (discount_start_date && discount_end_date) {
      if (
        new Date() < new Date(discount_start_date) ||
        new Date() > new Date(discount_end_date)
      ) {
        throw new BadRequestError("Discount code is expired!");
      }

      if (new Date(discount_start_date) >= new Date(discount_end_date))
        throw new BadRequestError("Start date must be less than end date");
    }

    if (
      discount_type &&
      discount_value &&
      discount_type === "fixed_amount" &&
      discount_value < 0
    )
      throw new BadRequestError("discount_value must be greater than 0");

    if (
      (discount_type &&
        discount_value &&
        discount_type === "percented" &&
        discount_value > 100) ||
      discount_value < 0
    ) {
      throw new BadRequestError(
        "discount_value must be greater than 0 and less than 100"
      );
    }

    if (discount_max_per_users && !(discount_max_per_users > 0))
      throw new BadRequestError(
        "discount_max_per_users must be greater than 0"
      );

    if (discount_max_uses && !(discount_max_uses > 0))
      throw new BadRequestError("discount_max_uses must be greater than 0");

    if (discount_min_order_value && !(discount_min_order_value > 0))
      throw new BadRequestError(
        "discount_min_order_value must be greater than 0"
      );

    if (discount_applies_to && discount_product_ids) {
      if (discount_applies_to === "all" && discount_product_ids)
        throw new BadRequestError(
          "invalid discount_applies_to and discount_product_ids"
        );

      if (foundDiscount.discount_applies_to === "all" && discount_product_ids)
        throw new BadRequestError(
          "invalid discount_applies_to and discount_product_ids"
        );
    }

    const filter = { _id: discount_id, discount_shopId: shopId };
    const update = {
      $set: {
        discount_name,
        discount_description,
        discount_type,
        discount_value,
        discount_code,
        discount_start_date,
        discount_end_date,
        discount_max_uses,
        discount_max_per_users,
        discount_min_order_value,
        discount_applies_to,
      },
    };
    return await findOneAndUpdate({ filter, update });
  }

  // get all product with discount code by user
  static async getAllDiscountCodesWithProduct(payload, shopId) {
    const { code, limit, page } = payload;
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
  static async getDiscountAmount({ body, shopId, userId }) {
    const { discount_code, products } = body;
    const foundDiscount = await findByShopIdAndCode({
      code: discount_code,
      shopId,
    });

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
    let totalOrderPrice = 0;
    totalOrderPrice = products.reduce((acc, product) => {
      return acc + product.quantity * product.price;
    }, 0);

    // kiem tra tong tien co lon hon gia tri thoi thieu hay khong
    if (
      discount_min_order_value > 0 &&
      totalOrderPrice < discount_min_order_value
    )
      throw new BadRequestError(
        `discount requires a minimum order value of ${discount_min_order_value}`
      );

    // kiem tra so lan su dung discount cua mot user
    if (discount_max_per_users > 0) {
      const userUsedDiscount = discount_user_used.filter(
        (user) => user === userId
      );
      if (userUsedDiscount.length >= discount_max_per_users)
        throw new BadRequestError("Run out of times to use discount!");
    }

    // check type cua discount === all || specified
    let totalPrice = 0;
    let amountDiscount = 0;
    if (discount_type === "percented") {
      amountDiscount = (totalOrderPrice * discount_value) / 100;
      totalPrice = totalOrderPrice - amountDiscount;
    }

    if (discount_type === "fixed_amount") {
      amountDiscount = discount_value;
      totalPrice = totalOrderPrice - amountDiscount;
    }

    return {
      totalOrderPrice,
      discount: amountDiscount,
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

  static async cancelDiscount({ body, shopId }) {
    const { discount_code } = body;
    const foundedDiscount = await findByShopIdAndCode({
      code: discount_code,
      shopId,
    });

    if (!foundedDiscount) throw new NotFoundError("Discount is not valid");

    if (!foundedDiscount.discount_is_active)
      throw new ForbiddenError("Discount is expired!");

    const filter = {
      discount_code,
      discount_shopId: shopId,
      discount_is_active: true,
    };
    const update = { discount_is_active: false };
    return await findOneAndUpdate({ filter, update });
  }

  static async activeDiscount({ body, shopId }) {
    const { discount_code } = body;
    const foundedDiscount = await findByShopIdAndCode({
      code: discount_code,
      shopId,
    });

    if (!foundedDiscount) throw new NotFoundError("Discount is not valid");

    if (foundedDiscount.discount_is_active)
      throw new ForbiddenError("Discount is already active!");

    const filter = {
      discount_code,
      discount_shopId: shopId,
      discount_is_active: false,
    };
    const update = { discount_is_active: true };
    return await findOneAndUpdate({ filter, update });
  }
}

module.exports = DiscountService;
