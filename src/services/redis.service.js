"use strict";

const { resolve } = require("path");
const redis = require("redis");
const { promisify } = require("util");
const {
  conversationInventory,
} = require("../models/repositories/iventory.repo");

const redisClient = redis.createClient();

redisClient.on("error", function (error) {
  console.error(error);
});

redisClient.on("connect", function (error) {
  console.log("Connect Redis Success!");
});

const setNXAsync = promisify(redisClient.setnx).bind(redisClient);
const getAsync = promisify(redisClient.get).bind(redisClient);
const pexpire = promisify(redisClient.pexpire).bind(redisClient);
const delKeyAsync = promisify(redisClient.del).bind(redisClient);

const acquireLock = async ({ productId, cartId, quantity }) => {
  const key = `key_lock_v2024_${productId}`;
  const retryTime = 10;
  const expireTime = 3000;
  let isSuccess = false;

  for (let i = 0; i < retryTime; i++) {
    await setNXAsync(key, expireTime).then((data) => {
      isSuccess = true;
    });

    if (isSuccess) {
      // thao tac voi inventory
      const isReversation = await conversationInventory({
        productId,
        cartId,
        quantity,
      });

      console.log("isReversation", isReversation);

      if (isReversation) {
        await pexpire(key, expireTime);
        console.log("expired keyyyyy");
        return key;
      }
      return null;
    } else {
      // thu lai 10 lan
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

const releaseKey = async (keyLock) => {
  await delKeyAsync(keyLock);
};

module.exports = {
  releaseKey,
  acquireLock,
};
