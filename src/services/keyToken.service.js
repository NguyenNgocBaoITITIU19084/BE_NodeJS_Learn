"use strict";

const keyTokenModel = require("../models/keytoken.model");

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

      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        option
      );
      return tokens ? tokens : null;
    } catch (error) {}
  };
}

module.exports = KeyTokenService;
