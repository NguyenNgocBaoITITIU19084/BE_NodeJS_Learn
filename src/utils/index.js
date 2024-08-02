"use strict";

const _ = require("lodash");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { Types } = require("mongoose");

const convertToObjectIdMongoose = (id) => Types.ObjectId(id);

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

const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] === null) {
      delete obj[k];
    }
  });
};

const cleanNestedObjectParser = (object) => {
  console.log("[1::]", object);
  /**
   * @k : stand for key
   * @v : stand for value
   */
  Object.entries(object).forEach(([k, v]) => {
    if (v && typeof v === "object") {
      cleanNestedObjectParser(v);
    }
    if (
      (v && typeof v === "object" && !Object.keys(v).length) ||
      v === null ||
      v === undefined ||
      v.length === 0
    ) {
      if (Array.isArray(object)) {
        object.splice(k, 1);
      } else {
        delete object[k];
      }
    }
  });
  console.log("[2::]", object);
  return object;
};

module.exports = {
  getInfoData,
  genPublicAndPrivateKey,
  verifyJWT,
  getSelectData,
  unGetSelectData,
  removeUndefinedObject,
  cleanNestedObjectParser,
  convertToObjectIdMongoose,
};
