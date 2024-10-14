"use strict";

const amqp = require("amqplib");

const sendMessage = async ({ msg }) => {
  const queueName = "notification-queue";

  const conn = await amqp.connect("amqp://guest:guest@localhost");

  const channel = await conn.createChannel();

  await channel.assertQueue(queueName, { durable: true });

  await channel.sendToQueue(queueName, Buffer.from(msg), { persistent: true });

  console.log(" [x] Sent '%s'", msg);

  setTimeout(function () {
    conn.close();
    process.exit(0);
  }, 500);
};

sendMessage({ msg: "hello from baonguyen" });
