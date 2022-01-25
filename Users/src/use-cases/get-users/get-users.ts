import { Response } from "express";
import Joi from "joi";
import HttpStatus from "http-status-codes";
import { IUser, UserModel } from "@src/models/user-model";
import sendError from "@src/util/errors";
import { RequestWithContext } from "@src/shared/types/resquest-with-context";
import logger from "@src/logger";

export const getUsers = async (req: RequestWithContext, res: Response) => {
  try {
    const users = await UserModel.find({}).select("-password");

    return res.status(HttpStatus.OK).send(users);
  } catch (error) {
    return sendError(res, error);
  }
};
