"use strict";

const AccessService = require("../services/access.service");

class AccessControllers {
  signUp = async (req, res, next) => {
    try {
      console.log(`[P]::signUP::`, req.body);
      return res.status(201).json(await AccessService.signUp(req.body));
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AccessControllers();
