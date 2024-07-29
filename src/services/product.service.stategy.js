"use strict";

const {
  clothing,
  product,
  electronic,
  furniture,
} = require("../models/product.model");
const { BadRequestError } = require("../cores/error.response");
const {
  findAllDraftsForShop,
  publicProductByShop,
} = require("../models/repositories/product.repo");

// define the Factory class to create product
class ProductFactory {
  /*
        type: 'Clothing'
        payload
    */

  static ProductRegister_Stategy = {};

  static registerProductType(type, classRef) {
    ProductFactory.ProductRegister_Stategy[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.ProductRegister_Stategy[type];
    if (!productClass)
      throw new BadRequestError("Invalid Product Types::", type);

    return new productClass(payload).createProduct();
  }

  // Query //

  static findAllDraftsForShop = async ({
    product_shop,
    skip = 0,
    limit = 50,
  }) => {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsForShop({ query, skip, limit });
  };

  /////////////////////////////////////////////////

  static publicProductForShop = async ({
    product_shop,
    product_id,
    skip = 0,
    limit = 50,
  }) => {
    return await publicProductByShop({ product_shop, product_id });
  };
}

//define the base class of product
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }
  async createProduct(product_id) {
    console.log("-------------product", this);
    return await product.create({ ...this, _id: product_id });
  }
}

//define the sub class for different product type
class Clothing extends Product {
  async createProduct() {
    console.log("-------------clothing", this);
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError("Create New Clothing Error");

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("Create New Product Error");

    return newProduct;
  }
}

//define the sub class for different product type
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic) throw new BadRequestError("Create New Clothing Error");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("Create New Product Error");

    return newProduct;
  }
}

//define the sub class for different product type
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new BadRequestError("Create New Clothing Error");

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError("Create New Product Error");

    return newProduct;
  }
}

// register product type
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory;
