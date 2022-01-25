import logger from "@src/logger";
import { Response } from "express";
import HttpStatus from "http-status-codes";

const sendError = async (res: Response, error: Error | any) => {
  logger.error(error);
  //   const { type, message, stack, status } = error;
  const { message, status } = error;
  return res.status(status || HttpStatus.INTERNAL_SERVER_ERROR).send({
    message: message || "Unkown error.",
    // details: { type, status, message, stack },
  });
};

export default sendError;
