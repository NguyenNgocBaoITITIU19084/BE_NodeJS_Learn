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
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publicKeyEncoding: { type: "pkcs1", format: "pem" },
          privateKeyEncoding: { type: "pkcs1", format: "pem" },
        });

        console.log({ privateKey, publicKey });

        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
        });

        if (!publicKeyString) {
          return {
            code: "xxx",
            message: "public key string error",
            status: "error",
          };
        }

        console.log("publicKeyString---", publicKeyString);

        const publicKeyObject = crypto.createPublicKey(publicKeyString);
        console.log("publicKeyObject=====", publicKeyObject);

        //create token pair
        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKeyObject,
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
