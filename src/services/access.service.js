"use strict";

const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const ShopModel = require("../models/shop.model");
const ROLES = require("../contants/roles");
const shopModel = require("../models/shop.model");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData, genPublicAndPrivateKey } = require("../utils/index");
const {
  BadRequestError,
  AuthFailureError,
} = require("../cores/error.response");
const { findByEmail } = require("../services/shop.service");

class AccessService {
  static login = async ({ email, password, refeshToken = null }) => {
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop is not registered!");

    const isMatched = bcrypt.compareSync(password, foundShop.password);
    if (!isMatched) throw new AuthFailureError("Authentication Error");

    // 3. Generating PublicKey and Private Key
    const ObjectKey = genPublicAndPrivateKey();

    // create jwt Tokens
    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      ObjectKey.publicKey,
      ObjectKey.privateKey
    );

    // save PublicKey and Private Key into database
    await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      publicKey: ObjectKey.publicKey,
      privateKey: ObjectKey.privateKey,
      refeshToken: tokens.refeshToken,
    });

    return {
      shop: getInfoData({
        fields: ["name", "email", "_id"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, password, email }) => {
    const holderShop = await ShopModel.findOne({ email }).lean();
    console.log("holderShop", holderShop);
    if (holderShop) {
      throw new BadRequestError("Error: Shop already registered!");
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
        throw new BadRequestError("Error: Key is not valid");
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
  };
}

module.exports = AccessService;
