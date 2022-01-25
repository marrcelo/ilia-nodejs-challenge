import { decodeToken } from "@src/services/auth";
import { Request, Response, NextFunction } from "express";
import sendError from "@src/util/errors";
import HttpStatus from "http-status-codes";
import { isValidObjectId } from "mongoose";
import logger from "@src/logger";

const authMiddleware = async (
  req: Request,
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

    res.locals = { user_id: sub as string };
    return next();
  } catch (error) {
    logger.error(error);

    return sendError(res, error);
  }
};

export default authMiddleware;
