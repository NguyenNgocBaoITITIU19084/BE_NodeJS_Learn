"use strict";

"use strict";

const { CREATED, SuccessResponse } = require("../cores/success.response");
const ProductService = require("../services/product.service");

class ProductController {
  createProduct = async (req, res) => {
    console.log(`::[P]::createProduct::`, req.body.product_type, {
      ...req.body,
      product_shop: req.keyStore.userId,
    });
    new CREATED({
      message: "Success Create Product!",
      metadata: await ProductService.createProduct(
        req.body.product_type,
        req.body
      ),
    }).send(res);
  };
}

module.exports = new ProductController();
