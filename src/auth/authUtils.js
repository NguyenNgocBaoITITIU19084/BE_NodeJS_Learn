"use strict";

const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await jwt.sign(payload, publicKey, {
      expiresIn: "2 days",
    });
    const refeshToken = await jwt.sign(payload, privateKey, {
      expiresIn: "7 days",
    });
    jwt.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        return console.error("error verify token", err);
      } else {
        console.log("decode jwt::", decode);
      }
    });
    return { accessToken, refeshToken };
  } catch (error) {
    return console.log(error);
  }
};

module.exports = {
  createTokenPair,
};
