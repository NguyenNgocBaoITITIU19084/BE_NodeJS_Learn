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

const verifyJWT = (token, key) => {
  return jwt.verify(token, key);
};

// [a,b,c] => {a: 1, b:1, c:1}
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

// [a,b,c] => {a: 0, b:0, c:0}
const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

module.exports = {
  getInfoData,
  genPublicAndPrivateKey,
  verifyJWT,
  getSelectData,
  unGetSelectData,
};
