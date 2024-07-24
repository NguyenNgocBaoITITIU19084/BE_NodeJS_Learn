"use strict";

const { countConnects } = require("../helpers/checkConnections");

const mongoose = require("mongoose");

const config = require("../configs/config.mongodb");
const { host, name, port } = config.db;
const connectString = `mongodb://${host}:${port}/${name}`;

class DataBase {
  constructor() {
    this.connect();
  }
  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(connectString)
      .then((_) => console.log("Success Connect to Mongo DB!", countConnects()))
      .catch((err) => console.log("Failed to Connect Mongo DB! ::", err));
  }

  static getIntance() {
    if (!DataBase.intance) {
      DataBase.intance = new DataBase();
    }
    return DataBase.intance;
  }
}

const intanceMongoDB = DataBase.getIntance();
module.exports = intanceMongoDB;
