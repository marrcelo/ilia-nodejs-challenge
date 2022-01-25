import { decodeToken } from "@src/services/auth";
import { Response, NextFunction } from "express";
import sendError from "@src/util/errors";
import HttpStatus from "http-status-codes";
import { isValidObjectId } from "mongoose";
import logger from "@src/logger";
import { RequestWithContext } from "@src/shared/types/resquest-with-context";
import { JsonWebTokenError } from "jsonwebtoken";

const authMiddleware = async (
  req: RequestWithContext,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers?.authorization)
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .send({ message: "Missing authorization token." });

    const token = req.headers?.authorization?.replace("Bearer ", "");

    const { sub } = decodeToken(token);

    if (!sub || !isValidObjectId(sub))
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .send({ message: "Invalid authorization token." });

    req.context = { user_id: sub };
    return next();
  } catch (error) {
    logger.error(error);
    if (error instanceof JsonWebTokenError) {
      let { message } = error;
      if (error.message === "jwt malformed")
        message = "Authorization token malformed.";

      return res.status(HttpStatus.UNAUTHORIZED).send({ message });
    }

    return sendError(res, error);
  }
};

export default authMiddleware;
