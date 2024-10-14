"use strict";

const amqp = require("amqplib");

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:guest@localhost");
    if (!connection) throw new Error("Failed to connect RabbitMQ");

    const channel = await connection.createChannel();

    return { connection, channel };
  } catch (error) {
    console.log("Error from connectRabbitMQ:::", error);
  }
};

const closeConnectionRabbitMQ = async ({ connection }) => {
  setTimeout(function () {
    connection.close();
    process.exit(0);
  }, 500);
};

const connectRabbitMQForTest = async () => {
  try {
    const { connection, channel } = await connectRabbitMQ();

    const queueName = "test-queue";
    const message = "hello, nguyenngocbao from sys_MQ";

    await channel.assertQueue(queueName);
    await channel.sendToQueue(queueName, Buffer.from(message));

    closeConnectionRabbitMQ({ connection });
  } catch (error) {
    console.log("Error from connectRabbitMQForTest:::", error);
  }
};

const consumerQueue = async ({ channel, queueName }) => {
  try {
    await channel.assertQueue(queueName, { durable: true });
    console.log(`[x] watting for message on queue::${queueName}`);
    channel.consume(
      queueName,
      (msg) => {
        console.log(`Received Message:::${msg.content.toString()} `);
      },
      { noAck: true }
    );
  } catch (error) {
    console.log("Error from consumerQueue:::", error);
  }
};
module.exports = {
  connectRabbitMQ,
  connectRabbitMQForTest,
  closeConnectionRabbitMQ,
  consumerQueue,
};
