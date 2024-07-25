"use strict";

const { CREATED, SuccessResponse } = require("../cores/success.response");
const AccessService = require("../services/access.service");

class AccessControllers {
  logIn = async (req, res) => {
    console.log(`::[P]::logIn::`, req.body);
    new SuccessResponse({
      message: "Success Login!",
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  signUp = async (req, res) => {
    console.log(`::[P]::signUP::`, req.body);
    new CREATED({
      message: "Shop Created",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };
}

module.exports = new AccessControllers();
