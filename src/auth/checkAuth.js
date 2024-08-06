"use strict";

const jwt = require("jsonwebtoken");

const { AuthFailureError, NotFoundError } = require("../cores/error.response");
const { findById } = require("../services/apiKey.service");
const KeyTokenService = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
  CLIENT_ID: "x-client-id",
  REFESH_TOKEN: "refesh-token-id",
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

const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID]?.toString();
  if (!userId) throw new AuthFailureError("Invalid Request");

  const holderShop = await KeyTokenService.findById(userId);
  if (!holderShop) throw new NotFoundError("Unauthorizated");

  const accessToken = req.headers[HEADER.AUTHORIZATION]?.toString();
  if (!accessToken) throw new AuthFailureError("Inlavid Request");

  try {
    const decode = jwt.verify(accessToken, holderShop.publicKey);
    if (decode.userId !== userId) {
      throw new AuthFailureError("Unauthorizated");
    }
    req.keyStore = decode;
    return next();
  } catch (error) {
    console.log(error);
  }
});

const authenticationV2 = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID]?.toString();
  if (!userId) throw new AuthFailureError("Invalid Request");

  const holderShop = await KeyTokenService.findById(userId);
  if (!holderShop) throw new NotFoundError("Unauthorizated");

  if (req.headers[HEADER.REFESH_TOKEN]) {
    try {
      const refeshToken = req.headers[HEADER.REFESH_TOKEN]?.toString();

      const decode = jwt.verify(refeshToken, holderShop.privateKey);

      if (decode.userId !== userId) {
        throw new AuthFailureError("Unauthorizated");
      }

      req.keyStore = holderShop;
      req.user = decode;
      req.refeshToken = refeshToken;

      return next();
    } catch (error) {
      console.log(error);
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION]?.toString();
  if (!accessToken) throw new AuthFailureError("Inlavid Request");

  try {
    const decode = jwt.verify(accessToken, holderShop.publicKey);
    if (decode.userId !== userId) {
      throw new AuthFailureError("Unauthorizated");
    }
    req.keyStore = holderShop;
    req.user = decode;
    return next();
  } catch (error) {
    console.log(error);
  }
});

module.exports = {
  apiKey,
  permission,
  asyncHandler,
  authentication,
  authenticationV2,
};
