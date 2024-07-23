"use strict";

const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");

const app = express();

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

// init db

// init router
app.get("/", (req, res, next) => {
  return res.status(200).json({ message: "wellcome" });
});
// handle error

module.exports = app;
