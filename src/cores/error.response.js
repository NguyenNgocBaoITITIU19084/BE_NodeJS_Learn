"use strict";

const StatusCode = {
  FORBIDDEN: 403,
  CONFLICT: 409,
  UNAUTHORIZATED: 401,
  NOTFOUND: 404,
  BadRequest: 400,
};

const ReasonsStatusCode = {
  FORBIDDEN: "Forbidden Error",
  CONFLICT: "Conflict Error",
  UNAUTHORIZATED: "Unauthorized Error",
  NOTFOUND: "Not Found Error",
  BadRequest: "Bad Request Error",
};

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = ReasonsStatusCode.CONFLICT,
    statusCode = StatusCode.CONFLICT
  ) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonsStatusCode.BadRequest,
    statusCode = StatusCode.BadRequest
  ) {
    super(message, statusCode);
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(
    message = ReasonsStatusCode.UNAUTHORIZATED,
    statusCode = StatusCode.UNAUTHORIZATED
  ) {
    super(message, statusCode);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(
    message = ReasonsStatusCode.NOTFOUND,
    statusCode = StatusCode.NOTFOUND
  ) {
    super(message, statusCode);
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(
    message = ReasonsStatusCode.FORBIDDEN,
    statusCode = StatusCode.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
  NotFoundError,
  ForbiddenError,
};
