"use strict";

const { CREATED, SuccessResponse } = require("../cores/success.response");
const NotificationService = require("../services/notification.service");

class NotificationController {
  getListNotiByUser = async (req, res) => {
    const { type, receiverId, isRead } = req.body;
    console.log(`::[P]::getListNotiByUser::`, {
      type,
      receiverId,
      isRead,
    });
    new CREATED({
      message: "getListNotiByUser success!",
      metadata: await NotificationService.getListNotiByUser({
        type,
        receiverId,
        isRead,
      }),
    }).send(res);
  };
}

module.exports = new NotificationController();
