"use strict";

const { connectRabbitMQForTest } = require("../databases/init.RabbitMQ");

describe("RabbitMQ connection", () => {
  it("shuold connect to RabbitMQ success", async () => {
    const result = await connectRabbitMQForTest();
    expect(result).toBeUndefined();
  });
});
