"use strict";

const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const ShopModel = require("../models/shop.model");
const ROLES = require("../contants/roles");
const shopModel = require("../models/shop.model");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const {
  getInfoData,
  genPublicAndPrivateKey,
  verifyJWT,
} = require("../utils/index");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../cores/error.response");
const { findByEmail } = require("../services/shop.service");

class AccessService {
  static handleRefeshTokenV2 = async ({ keyStore, user, refeshToken }) => {
    const { userId, email } = user;

    if (keyStore.refeshTokensUsed.includes(refeshToken)) {
      await KeyTokenService.DeleteByUserId(userId);
      throw new ForbiddenError("Someone know your account! Pls re-login!");
    }

    if (keyStore.refeshToken !== refeshToken)
      throw new AuthFailureError("Shop is not existed");

    const newTokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );

    await KeyTokenService.updateOne({
      filter: { refeshToken },
      update: {
        $set: { refeshToken: newTokens.refeshToken },
        $addToSet: { refeshTokensUsed: refeshToken },
      },
    });

    return { user: { userId, email }, newTokens };
  };

  static handleRefeshToken = async ({ refeshToken }) => {
    // checking refeshToken used or not ?
    const foundRefeshToken = await KeyTokenService.findByRefeshTokenUsed(
      refeshToken
    );

    // if yes => decode token => find user => remove keytoken and notification
    if (foundRefeshToken) {
      const decoded = verifyJWT(refeshToken, foundRefeshToken.publicKey);
      await KeyTokenService.DeleteByUserId(decoded.userId);
      throw new ForbiddenError("Someone know your account! Pls re-login!");
    }

    // if no => find shop by refesh token => if shop existed => decode => create new AT and RT => Add old and new RT into db
    const holderToken = await KeyTokenService.findByRefeshToken(refeshToken);
    if (!holderToken) throw new AuthFailureError("Shop is not existed");

    const decoded = jwt.verify(refeshToken, holderToken.privateKey);

    const holderShop = await findByEmail({ email: decoded.email });
    if (!holderShop) throw new AuthFailureError("Shop is not existed");

    const newTokens = await createTokenPair(
      { userId: decoded._id, email: decoded.email },
      holderToken.publicKey,
      holderToken.privateKey
    );

    await KeyTokenService.updateOne({
      filter: { refeshToken },
      update: {
        $set: { refeshToken: newTokens.refeshToken },
        $addToSet: { refeshTokensUsed: refeshToken },
      },
    });

    return { user: decoded, newTokens };
  };

  static logOut = async (keyStore) => {
    return await KeyTokenService.DeleteByUserId(keyStore.userId);
  };

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

      //create token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
        refeshToken: tokens.refeshToken,
      });

      if (!keyStore) {
        throw new BadRequestError("Error: Key is not valid");
      }
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
