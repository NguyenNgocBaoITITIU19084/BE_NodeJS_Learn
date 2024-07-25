"use strict";

const apiKeyModel = require("../models/apikey.model");

const findById = async (key) => {
  const objectKey = await apiKeyModel
    .findOne({ keys: key, status: true })
    .lean();
  return objectKey;
};

module.exports = {
  findById,
};
