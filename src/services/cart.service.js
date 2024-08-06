"use strict";

const { NotFoundError } = require("../cores/error.response");
const cartModel = require("../models/cart.model");
const {
  findOneCart,
  createUserCart,
  findCartAndUpdate,
  deleteItemInCart,
} = require("../models/repositories/cart.repo");

const { findProduct } = require("../models/repositories/product.repo");

/**
 * main features: Cart Service
 * - add product to cart
 * - reduce product quantity
 * - increase product quantity
 * - delete cart item
 * - delete cart
 * - get all products in cart
 *
 */

class CartService {
  static async addToCart({ userId, product }) {
    const { product_id } = product;
    const foundProduct = await findProduct({ product_id, unSelect: ["__v"] });
    if (!foundProduct && !foundProduct?.isPublic)
      throw new NotFoundError("Product is not existed!");

    const filter = { cart_userId: userId, cart_state: "active" };
    const model = cartModel;
    const foundCart = await findOneCart({ filter, model });

    if (!foundCart || !foundCart.cart_products.length) {
      // create new cart for user
      return await createUserCart({ userId, product });
    }

    const isCartContain = await findCartAndUpdate({
      filter: {
        cart_userId: userId,
        cart_state: "active",
        "cart_products.product_id": product_id,
      },
      update: {
        $inc: { "cart_products.$.cart_quantity": 1 },
      },
    });
    return isCartContain;
  }

  /**
   * update cart
   *
   *  shop_order_ids: [
   *  {
   *    shop_id,
   *    item_products: [
   *        {
   *            quantity,
   *            price,
   *            old_quantity,
   *            shopId,
   *            product_id
   *        }
   *    ],
   *    version
   *  }
   * ]
   *
   */

  static updateQuantityCart = async ({ userId, shop_order_ids = {} }) => {
    const { quantity, old_quantity, product_id } =
      shop_order_ids[0]?.item_products[0];

    const foundProduct = await findProduct({ product_id, unSelect: ["__v"] });
    if (!foundProduct && !foundProduct?.isPublic)
      throw new NotFoundError("Product is not existed!");

    if (foundProduct.product_shop !== shop_order_ids[0]?.shop_id)
      throw new NotFoundError("Product is not existed!");

    if (quantity === 0) {
      // delete product in cart
    }

    return await findCartAndUpdate({
      filter: {
        cart_userId: userId,
        cart_state: "active",
        "cart_products.product_id": product_id,
      },
      update: {
        $inc: { "cart_products.$.cart_quantity": quantity - old_quantity },
      },
    });
  };

  static getCartList = async ({ userId }) => {
    return await findOneCart({
      filter: {
        cart_userId: userId,
        cart_state: "active",
      },
      model: cartModel,
    });
  };

  static deleteItemCart = async ({ userId, product_id }) => {
    return await findCartAndUpdate({
      filter: {
        cart_userId: userId,
        cart_state: "active",
        "cart_products.product_id": product_id,
      },
      update: {
        $pull: { "cart_products.$.product_id": product_id },
      },
    });
  };
}

module.exports = CartService;
