"use strict";

const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const ShopModel = require("../models/shop.model");
const ROLES = require("../contants/roles");
const shopModel = require("../models/shop.model");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils/index");

class AccessService {
  static signUp = async ({ name, password, email }) => {
    try {
      const holderShop = await ShopModel.findOne({ email }).lean();
      console.log("holderShop", holderShop);
      if (holderShop) {
        return {
          code: "xxx",
          message: "shop already exist",
          status: "error",
        };
      }

      //hash password
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // save into db
      const newShop = await shopModel.create({
        name,
        email,
        password: hashedPassword,
        roles: [ROLES.SHOP],
      });

      if (newShop) {
        //created privateKey, publicKey
        const publicKey = crypto.randomBytes(64).toString("hex");
        const privateKey = crypto.randomBytes(64).toString("hex");

        console.log({ privateKey, publicKey });

        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey,
        });

        if (!keyStore) {
          return {
            code: "xxx",
            message: "public key string error",
            status: "error",
          };
        }

        console.log("keyStore---", keyStore);

        //create token pair
        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKey,
          privateKey
        );
        console.log(`Created Token Success::`, tokens);
        return {
          code: 201,
          metadata: {
            shop: getInfoData({
              fields: ["name", "email", "_id"],
              object: newShop,
            }),
            tokens,
          },
        };
      }
      return {
        code: 200,
        metadata: null,
      };
    } catch (error) {
      return {
        code: "xxx",
        message: "some thing wrong",
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
