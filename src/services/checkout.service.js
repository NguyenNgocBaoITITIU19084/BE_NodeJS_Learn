"use strict";

const { getCartByIdAndUserId } = require("../models/repositories/cart.repo");
const { BadRequestError } = require("../cores/error.response");
const { checkProductByServer } = require("../models/repositories/product.repo");
const discountService = require("../services/discount.service");
class CheckoutService {
  // {
  //     cartId,
  //     userId,
  //     shop_order_ids: [
  //         {
  //             shopId,
  //             shop_discounts: [],
  //             item_products: [
  //                 {
  //                     price,
  //                     quantity,
  //                     productId
  //                 }
  //             ]
  //         },
  //         {
  //             shopId,
  //             shop_discounts: [],
  //             item_products: [
  //                 {
  //                     price,
  //                     quantity,
  //                     productId
  //                 }
  //             ]
  //         }
  //     ]
  // }
  static async checkoutReview({ body }) {
    const { cartId, userId, shop_order_ids = [] } = body;
    const foundCart = await getCartByIdAndUserId({ cartId, userId });
    console.log("foundCart", foundCart);

    if (!foundCart) throw new BadRequestError("CartId is invalid");

    const checkout_order = {
        totalPrice: 0, // total price of order
        feeShip: 0, // fee ship of order
        totalDiscount: 0, // total discount of order
        totalCheckout: 0, //final price of order
      },
      shop_order_ids_new = [];

    // tinh tong tien bill
    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];
      const checkProductServer = await checkProductByServer({ item_products });
      console.log("checkProductServer::", checkProductServer);

      if (!checkProductServer[0]) throw new BadRequestError("order wrong");

      // tinh tong tien don hang, total price of order.
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      // tong tien truoc khi xu ly
      checkout_order.totalPrice += checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        itemproducts: checkProductServer,
      };

      // if discount length > 0, check discount is valid or not
      if (shop_discounts.length > 0) {
        // gia su chi co mot discount duy nhat
        //
        const { totalOrderPrice, discount, totalPrice } =
          await discountService.getDiscountAmount({
            body: {
              discount_code: shop_discounts[0],
              products: checkProductServer,
            },
            shopId,
            userId,
          });

        // tong tien discount giam gia
        checkout_order.totalDiscount += discount;

        // neu tien giam gia lon hon 0
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }

      // tong thanh toan cuoi cung
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }
}

module.exports = CheckoutService;
