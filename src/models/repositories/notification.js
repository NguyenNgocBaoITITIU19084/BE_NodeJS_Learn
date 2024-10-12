"use strict";

const { convertToObjectIdMongoose } = require("../../utils");
const NotificationModel = require("../notification.model");

const createNotification = async ({
  noti_content,
  noti_type,
  noti_receiverId,
  noti_senderId,
  noti_option,
}) => {
  return await NotificationModel.create({
    noti_content,
    noti_type,
    noti_receiverId: convertToObjectIdMongoose(noti_receiverId),
    noti_senderId: convertToObjectIdMongoose(noti_senderId),
    noti_option,
  });
};

const notificationAggregate = async ({ match = {}, stage = {} }) => {
  return await NotificationModel.aggregate([match, stage]);
};

module.exports = {
  createNotification,
  notificationAggregate,
};
