"use strict";

const _ = require("lodash");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const genPublicAndPrivateKey = () => {
  //created privateKey, publicKey
  const publicKey = crypto.randomBytes(64).toString("hex");
  const privateKey = crypto.randomBytes(64).toString("hex");
  return { publicKey, privateKey };
};

const verifyJWT = (accessToken, publicKey) => {
  jwt.verify(accessToken, publicKey, (err, decode) => {
    if (err) {
      return console.error("error verify token", err);
    } else {
      return decode;
    }
  });
};
module.exports = { getInfoData, genPublicAndPrivateKey, verifyJWT };
