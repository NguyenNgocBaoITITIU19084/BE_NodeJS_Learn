"use strict";

const { CREATED } = require("../cores/success.response");
const AccessService = require("../services/access.service");

class AccessControllers {
  signUp = async (req, res, next) => {
    console.log(`[P]::signUP::`, req.body);
    new CREATED({
      message: "Shop Created",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };
}

module.exports = new AccessControllers();
