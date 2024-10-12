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
  findAllPublicProductsForShop,
  unPublicProductByShop,
  searchPublicProductsByUser,
  findAllProducts,
  findProduct,
  updateProductById,
} = require("../models/repositories/product.repo");
const { cleanNestedObjectParser } = require("../utils");
const { insertInventory } = require("../models/repositories/iventory.repo");
const NotificationService = require("../services/notification.service");

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

  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory.ProductRegister_Stategy[type];
    if (!productClass)
      throw new BadRequestError("Invalid Product Types::", type);

    return new productClass(payload).updateProduct(productId);
  }

  // Query //

  static findAllDraftsForShop = async ({
    product_shop,
    skip = 0,
    limit = 50,
  }) => {
    const query = { product_shop, isDraft: true, isPublic: false };
    return await findAllDraftsForShop({ query, skip, limit });
  };

  static findAllPublicProductsForShop = async ({
    product_shop,
    skip = 0,
    limit = 50,
  }) => {
    const query = { product_shop, isDraft: false, isPublic: true };
    return await findAllPublicProductsForShop({ query, skip, limit });
  };

  static findAllPublicProductForUser = async ({ keySearch }) => {
    return await searchPublicProductsByUser({ keySearch });
  };

  static findAllProducts = async ({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublic: true },
  }) => {
    return findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ["product_name", "product_thumb", "product_price"],
    });
  };

  static findProduct = async ({ product_id }) => {
    return await findProduct({ product_id, unSelect: ["__v"] });
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

  static unPublicProductForShop = async ({
    product_shop,
    product_id,
    skip = 0,
    limit = 50,
  }) => {
    return await unPublicProductByShop({ product_shop, product_id });
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
    const newProduct = await product.create({ ...this, _id: product_id });

    // add inventory
    await insertInventory({
      productId: newProduct._id,
      shopId: this.product_shop,
      stock: this.product_quantity,
    });

    // push notification to system
    NotificationService.pushNotiToSystem({
      type: "promotion",
      senderId: this.product_shop,
      receiverId: this.product_shop,
      option: {
        product_name: this.product_name,
        shop_name: this.product_shop,
      },
    })
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
    return newProduct;
  }

  async updateProduct(productId, bodyUpdate) {
    return await updateProductById({ productId, bodyUpdate, model: product });
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

  async updateProduct(productId) {
    /*
      {
        a: null,
        b: undefine
      }
    */

    // 1 loai bo cac gia tri null
    // 2 check xem can phai update o dau
    const objectParams = this;

    if (objectParams.product_attributes) {
      // update child
      console.log("objectParams", objectParams);
      await updateProductById({
        productId,
        bodyUpdate: cleanNestedObjectParser(objectParams.product_attributes),
        model: clothing,
      });
    }

    const updateProduct = await super.updateProduct(
      productId,
      cleanNestedObjectParser(objectParams)
    );
    return updateProduct;
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
