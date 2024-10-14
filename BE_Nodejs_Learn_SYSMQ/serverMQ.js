"use strict";

const { consumerToQueue } = require("./src/services/consumerQueue.service");

const queueName = "notification-queue";

consumerToQueue({ queueName })
  .then((_) => {
    console.log(`Connected to Message Queue System`);
  })
  .catch((error) => {
    console.log(`Error connect to Message Queue System`);
  });
