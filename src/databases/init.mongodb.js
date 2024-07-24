"use strict";

const mongoose = require("mongoose");

const connectString = `mongodb://127.0.0.1:27017/eCommerce_TipJS`;

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
      .then((_) => console.log("Success Connect to Mongo DB!"))
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
