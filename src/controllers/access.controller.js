"use strict";

const AccessService = require("../services/access.service");

class AccessControllers {
  signUp = async (req, res, next) => {
    console.log(`[P]::signUP::`, req.body);
    return res.status(201).json(await AccessService.signUp(req.body));
  };
}

module.exports = new AccessControllers();
