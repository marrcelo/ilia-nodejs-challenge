import logger from "@src/logger";
import { Response } from "express";
import HttpStatus from "http-status-codes";
import mongoose from "mongoose";
import { JsonWebTokenError } from "jsonwebtoken";

const sendError = async (res: Response, error: unknown) => {
  logger.error(error);

  let message;
  let status;

  if (error instanceof mongoose.Error.ValidationError) {
    status = HttpStatus.BAD_REQUEST;
    message = error.message;
  } else if (error instanceof JsonWebTokenError) {
    status = HttpStatus.UNAUTHORIZED;
    message = error.message;
    if (error.message === "jwt malformed") {
      message = "Authorization token malformed.";
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return res.status(status ?? HttpStatus.INTERNAL_SERVER_ERROR).send({
    message: message ?? "Unknown error.",
  });
};

export default sendError;
