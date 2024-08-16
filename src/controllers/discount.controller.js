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

  getDiscounts = async (req, res) => {
    console.log(`::[P]::getDiscounts::`, req.body, req.keyStore.user);
    new SuccessResponse({
      message: "Success getDiscounts by users!",
      metadata: await DiscountService.getAllDiscountCodesWithProduct(
        req.body,
        req.keyStore.user
      ),
    }).send(res);
  };

  cancelDiscount = async (req, res) => {
    console.log(`::[P]::cancelDiscount::`, {
      body: req.body,
      shopId: req.keyStore.user,
    });
    new SuccessResponse({
      message: "Success cancelDiscount by shop!",
      metadata: await DiscountService.cancelDiscount({
        body: req.body,
        shopId: req.keyStore.user,
      }),
    }).send(res);
  };

  activeDiscount = async (req, res) => {
    console.log(`::[P]::activeDiscount::`, {
      body: req.body,
      shopId: req.keyStore.user,
    });
    new SuccessResponse({
      message: "Success activeDiscount by shop!",
      metadata: await DiscountService.activeDiscount({
        body: req.body,
        shopId: req.keyStore.user,
      }),
    }).send(res);
  };

  getDiscountAmount = async (req, res) => {
    console.log(`::[P]::getDiscountAmount::`, {
      body: req.body,
      shopId: req.keyStore.user,
    });
    new SuccessResponse({
      message: "Success getDiscountAmount by user!",
      metadata: await DiscountService.getDiscountAmount({
        body: req.body,
        shopId: req.keyStore.user,
        userId: req.user.userId,
      }),
    }).send(res);
  };

  updateDiscount = async (req, res) => {
    console.log(`::[P]::updateDiscount::`, {
      body: req.body,
      shopId: req.keyStore.user,
    });
    new SuccessResponse({
      message: "Success updateDiscount by user!",
      metadata: await DiscountService.updateDiscount({
        body: req.body,
        shopId: req.keyStore.user,
      }),
    }).send(res);
  };

  applyDiscountForProduct = async (req, res) => {
    console.log(`::[P]::applyDiscountForProduct::`, {
      body: req.body,
      shopId: req.keyStore.user,
    });
    new SuccessResponse({
      message: "Success applyDiscountForProduct by user!",
      metadata: await DiscountService.applyDiscountForProduct({
        body: req.body,
        shopId: req.keyStore.user,
      }),
    }).send(res);
  };

  removeDiscountForProduct = async (req, res) => {
    console.log(`::[P]::removeDiscountForProduct::`, {
      body: req.body,
      shopId: req.keyStore.user,
    });
    new SuccessResponse({
      message: "Success removeDiscountForProduct by user!",
      metadata: await DiscountService.removeDiscountForProduct({
        body: req.body,
        shopId: req.keyStore.user,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
