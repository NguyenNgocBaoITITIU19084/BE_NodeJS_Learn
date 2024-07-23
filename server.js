"use strict";

const app = require("./src/app");

const PORT = 3055;

const server = app.listen(PORT, () => {
  console.log(`eCommerce start with ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => console.log(`Exit Server Express`));

  // notify function when server have errors
});
