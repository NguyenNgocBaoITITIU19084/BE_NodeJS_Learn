"use strict";

const mongoose = require("mongoose");
const os = require("os");

const _SECONDS = 5000;

// count Connections
const countConnects = () => {
  const numsConnect = mongoose.connections.length;
  console.log(`Numbers of Connections::${numsConnect}`);
};

// Check Overload Connections
const checkOverLoad = () => {
  setInterval(() => {
    const numsConnects = mongoose.connections.length;
    const numsCore = os.cpus().length;
    const memoryUsed = process.memoryUsage().rss;

    //Example miximum number of connections based on os cores
    const maximumConnections = numsCore * 5;
    console.log(`Active connections::${numsConnects}`);
    console.log(`Memory Used::${memoryUsed / 1024 / 1024} MB`);

    if (numsConnects > maximumConnections) {
      console.log(`System is overloaded! Nums Connections::${numsConnects}`);
    }
  }, _SECONDS);
};

module.exports = {
  countConnects,
  checkOverLoad,
};
