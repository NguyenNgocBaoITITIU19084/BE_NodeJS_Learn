"use strict";

const ReasonCode = {
  OK: "OK",
  CREATED: "Created",
};

const StatusCode = {
  OK: 200,
  CREATED: 201,
};

class SuccessResponse {
  constructor({
    message,
    status = StatusCode.OK,
    reasonCode = ReasonCode.OK,
    metadata = {},
  }) {
    this.message = !message ? reasonCode : message;
    this.status = status;
    this.metadata = metadata;
  }
  send(res, header = {}) {
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }
}

class CREATED extends SuccessResponse {
  constructor({
    option = {},
    message,
    metadata,
    statusCode = StatusCode.CREATED,
    reasonCode = ReasonCode.CREATED,
  }) {
    super({ message, metadata, statusCode, reasonCode });
    this.option = option;
  }
}

module.exports = {
  OK,
  CREATED,
};
