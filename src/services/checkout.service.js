"use strict";

const { getCartByIdAndUserId } = require("../models/repositories/cart.repo");
const { BadRequestError } = require("../cores/error.response");
const { checkProductByServer } = require("../models/repositories/product.repo");
const discountService = require("../services/discount.service");
const { acquireLock, releaseKey } = require("./redis.service");
const { createOrder } = require("../models/repositories/order.repo");
const cartService = require("../services/cart.service");

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

  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {},
  }) {
    const foundCart = await getCartByIdAndUserId({ cartId, userId });
    if (!foundCart) throw new BadRequestError("CartId is invalid");

    if (!foundCart.cart_userId.equals(userId)) {
      throw new BadRequestError("Invalid userId");
    }

    const { shop_order_ids_new, checkout_order } =
      await CheckoutService.checkoutReview({
        body: {
          shop_order_ids,
          userId,
          cartId,
        },
      });

    // lay tat ca san pham
    const products = shop_order_ids_new.flatMap((order) => order.itemproducts);
    console.log(`[1]:::`, products);

    // kiem tra so luong ton kho cua moi san pham, su dung khoa optimistic
    const acquireProduct = [];
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
      const keyLock = await acquireLock({ productId, quantity, cartId });
      console.log("keyLock", keyLock);

      acquireProduct.push(keyLock ? true : false);

      if (keyLock) {
        await releaseKey(keyLock);
      }
    }

    // if cos mot san pham trong kho het hang, thong bao loi
    if (acquireProduct.includes(false)) {
      throw new BadRequestError(
        "there is some update with product in your cart, pls come back to cart"
      );
    }

    // tao mot don hang moi trong order collection
    const newOrder = await createOrder({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids,
    });

    // truong hop neu tap thanh cong don hang moi, thi xoa san pham trong gio hang
    if (newOrder) {
      // xoa san pham trong gio hang
      products.forEach(async (product) => {
        console.log("producttttttt::::", product);

        await cartService.deleteItemCart(userId, product);
      });
    }
    // tra ve new order list
    return newOrder;
  }

  // update status order by shop, very very very important
  static async updateOrderStatusByOrder() {}

  // get one order by user
  static async getOneOrderByUser() {}

  // cancel order by User
  static async cancelOrderByUser() {}

  static async getOrderByUser() {}
}

module.exports = CheckoutService;
