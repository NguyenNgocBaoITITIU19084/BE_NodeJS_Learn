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
}

module.exports = new CheckoutController();
