"use strict";

const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");

const app = express();

// console.log("Process::", process);

// init middleware

// =======================MORGAN============
app.use(morgan("dev"));
// app.use(morgan("combine"));
// app.use(morgan("common"));
// app.use(morgan("short"));
// app.use(morgan("tiny"));
// =========================================
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// init db
require("./databases/init.mongodb");
// const { checkOverLoad } = require("./helpers/checkConnections");
// checkOverLoad();

// init router
app.use("/", require("./routes/index"));

// handle error
app.use((req, res, next) => {
  const error = new Error("Not Found!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server",
  });
});

module.exports = app;
