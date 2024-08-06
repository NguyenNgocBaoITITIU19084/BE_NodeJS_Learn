"use strict";

const { CREATED, SuccessResponse } = require("../cores/success.response");
const CartService = require("../services/cart.service");

class CartController {
  addToCart = async (req, res) => {
    console.log(`::[P]::addToCart::`, req.user.userId, { product: req.body });
    new CREATED({
      message: "Success addToCart!",
      metadata: await CartService.addToCart({
        userId: req.user.userId,
        product: req.body,
      }),
    }).send(res);
  };

  updateQuantityProductInCart = async (req, res) => {
    console.log(`::[P]::updateQuantityProductInCart::`, req.user.userId, {
      product: req.body,
    });
    new CREATED({
      message: "Success updateQuantityProductInCart!",
      metadata: await CartService.updateQuantityCart({
        userId: req.user.userId,
        shop_order_ids: req.body,
      }),
    }).send(res);
  };

  getCartList = async (req, res) => {
    console.log(`::[P]::getCartList::`, req.user.userId, {
      product: req.body,
    });
    new CREATED({
      message: "Success getCartList!",
      metadata: await CartService.getCartList({
        userId: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new CartController();
