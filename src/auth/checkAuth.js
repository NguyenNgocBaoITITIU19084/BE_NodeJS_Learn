"use strict";

const { findById } = require("../services/apiKey.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
  try {
    // get api key from header
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({ message: "Forbiden!" });
    }

    // checking key in database
    const objKey = await findById(key);
    if (!objKey) {
      return res.status(403).json({ message: "Forbiden!" });
    }

    req.objKey = objKey;
    return next();
  } catch (error) {}
};

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permission) {
      return res.status(403).json({
        message: "permission denied",
      });
    }

    console.log(`Permission Checking::${req.objKey.permission}`);
    const validPermission = req.objKey.permission.includes(permission);

    if (!validPermission) {
      return res.status(403).json({
        message: "permission denied",
      });
    }
    return next();
  };
};

const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = {
  apiKey,
  permission,
  asyncHandler,
};
