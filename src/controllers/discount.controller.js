"use strict";

const { CREATED, SuccessResponse } = require("../cores/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
  createDiscount = async (req, res) => {
    console.log(`::[P]::createDiscount::`, {
      payload: req.body,
      shopId: req.keyStore.user,
    });
    new CREATED({
      message: "Success createDiscount!",
      metadata: await DiscountService.createDiscount({
        payload: req.body,
        shopId: req.keyStore.user,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
