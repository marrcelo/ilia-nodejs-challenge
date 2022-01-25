import logger from "@src/logger";
import { Response } from "express";
import HttpStatus from "http-status-codes";
import mongoose from "mongoose";
import { JsonWebTokenError } from "jsonwebtoken";

const sendError = async (res: Response, error: Error | any) => {
  logger.error(error);
  //   const { type, message, stack, status } = error;
  let { message, status } = error;

  if (error instanceof mongoose.Error.ValidationError)
    status = HttpStatus.BAD_REQUEST;

  if (error instanceof JsonWebTokenError) {
    status = HttpStatus.UNAUTHORIZED;
    if (error.message === "jwt malformed") {
      message = "Authorization token malformed.";
    }
  }

  return res.status(status || HttpStatus.INTERNAL_SERVER_ERROR).send({
    message: message || "Unkown error.",
    // details: error,
    // details: { type, status, message, stack },
  });
};

export default sendError;
