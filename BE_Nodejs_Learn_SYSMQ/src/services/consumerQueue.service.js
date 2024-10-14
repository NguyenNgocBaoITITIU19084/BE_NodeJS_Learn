"use strict";

const {
  connectRabbitMQ,
  consumerQueue,
} = require("../databases/init.RabbitMQ");

class ConsumerQueueService {
  static async consumerToQueue({ queueName }) {
    try {
      const { channel } = await connectRabbitMQ();
      await consumerQueue({ channel, queueName });
    } catch (error) {
      console.log(`Error from consumerToQueue::: ${error} `);
    }
  }
}

module.exports = ConsumerQueueService;
