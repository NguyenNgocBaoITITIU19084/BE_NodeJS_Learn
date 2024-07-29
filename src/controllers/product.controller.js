"use strict";

"use strict";

const { CREATED, SuccessResponse } = require("../cores/success.response");
const ProductService = require("../services/product.service");
const ProductServiceV2 = require("../services/product.service.stategy");

class ProductController {
  createProduct = async (req, res) => {
    console.log(`::[P]::createProduct::`, req.body.product_type, {
      ...req.body,
      product_shop: req.keyStore.user,
    });
    new CREATED({
      message: "Success Create Product!",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.keyStore.user,
      }),
    }).send(res);
  };

  createProductV2 = async (req, res) => {
    console.log(`::[P]::createProductV2::`, req.body.product_type, {
      ...req.body,
      product_shop: req.keyStore.user,
    });
    new CREATED({
      message: "Success Create ProductV2!",
      metadata: await ProductServiceV2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.keyStore.user,
      }),
    }).send(res);
  };

  getAllDaftsForShop = async (req, res) => {
    console.log(`::[P]::getAllDaftsForShop::`, {
      product_shop: req.keyStore.user,
    });
    new SuccessResponse({
      message: "Get list Dafts success!",
      metadata: await ProductServiceV2.findAllDraftsForShop({
        product_shop: req.keyStore.user,
      }),
    }).send(res);
  };

  publicProductForShop = async (req, res) => {
    console.log(`::[P]::publicProductForShop::`, {
      product_id: req.params.id,
      product_shop: req.keyStore.user,
    });
    new SuccessResponse({
      message: "Success Public Product!",
      metadata: await ProductServiceV2.publicProductForShop({
        product_id: req.params.id,
        product_shop: req.keyStore.user,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
