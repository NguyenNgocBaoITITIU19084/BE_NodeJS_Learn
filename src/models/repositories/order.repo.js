"use strict";

const orderModel = require("../order.model");

const createOrder = async ({
  order_userId,
  order_checkout,
  order_shipping,
  order_payment,
  order_products,
}) => {
  return await orderModel.create({
    order_userId,
    order_checkout,
    order_shipping,
    order_payment,
    order_products,
  });
};

module.exports = { createOrder };
