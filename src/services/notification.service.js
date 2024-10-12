"use strict";

const {
  notificationAggregate,
  createNotification,
} = require("../models/repositories/notification");
const { convertToObjectIdMongoose } = require("../utils");

class NotificationService {
  static async pushNotiToSystem({
    receiverId,
    senderId,
    option,
    type = "production",
  }) {
    let content = "";

    if (type === "production") content = "@@@ just add new product @@@";
    if (type === "order") content = "@@@ product in your order is successs";
    if (type === "promotion") content = "@@@ shop just add new promotion @@@";

    const newNotification = await createNotification({
      noti_content: content,
      noti_senderId: senderId,
      noti_receiverId: receiverId,
      noti_option: option,
      noti_type: type,
    });

    return newNotification;
  }

  static async getListNotiByUser({ type = "ALL", receiverId, isRead = false }) {
    const match = { noti_receiverId: convertToObjectIdMongoose(receiverId) };
    if (type !== "ALL") match["noti_type"] = type;

    const matchCondition = { $match: match };
    const stage = {
      $project: {
        noti_content: 1,
        noti_type: 1,
        noti_option: 1,
        noti_senderId: 1,
        noti_receiverId: 1,
      },
    };
    return await notificationAggregate({ match: matchCondition, stage });
  }
}

module.exports = NotificationService;
