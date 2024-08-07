"use strict";

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refeshToken,
  }) => {
    try {
      const filter = { user: userId },
        update = { publicKey, privateKey, refeshToken, refeshTokensUsed: [] },
        option = { upsert: true, new: true };

      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        option
      );
      return tokens ? tokens : null;
    } catch (error) {}
  };

  static findById = async (userId) => {
    return await keytokenModel.findOne({ user: userId }).lean();
  };

  static DeleteByUserId = async (userId) => {
    return await keytokenModel.findOneAndDelete({ user: userId });
  };

  static findByRefeshTokenUsed = async (refeshTokensUsed) => {
    return await keytokenModel.findOne({ refeshTokensUsed }).lean();
  };

  static findByRefeshToken = async (refeshToken) => {
    return await keytokenModel.findOne({ refeshToken }).lean();
  };

  static updateOne = async ({ filter = {}, update = {}, option = {} }) => {
    return await keytokenModel.updateOne(filter, update, option);
  };
}

module.exports = KeyTokenService;
