"use strict";

const { CREATED, SuccessResponse } = require("../cores/success.response");
const checkoutService = require("../services/checkout.service");

class CheckoutController {
  checkoutReview = async (req, res) => {
    console.log(`::[P]::checkoutReview::`, { body: req.body });
    new SuccessResponse({
      message: "Success checkoutReview!",
      metadata: await checkoutService.checkoutReview({ body: req.body }),
    }).send(res);
  };

  orderByUser = async (req, res) => {
    const { shop_order_ids, cartId, user_address, user_payment } = req.body;
    console.log(`::[P]::orderByUser::`, req.body);
    new SuccessResponse({
      message: "Success orderByUser!",
      metadata: await checkoutService.orderByUser({
        shop_order_ids,
        cartId,
        userId: req.user.userId,
        user_address,
        user_payment,
      }),
    }).send(res);
  };
}

module.exports = new CheckoutController();
