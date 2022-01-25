import { Response } from "express";
import Joi from "joi";
import HttpStatus from "http-status-codes";
import { IUser, UserModel } from "@src/models/user-model";
import sendError from "@src/util/errors";
import { RequestWithContext } from "@src/shared/types/resquest-with-context";
import logger from "@src/logger";
import { isValidObjectId } from "mongoose";

export const getUserById = async (req: RequestWithContext, res: Response) => {
  try {
    const { params } = req;
    const { id } = params;

    if (!isValidObjectId(id))
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: "Invalid id." });

    const user = await UserModel.findOne({ _id: id }).select("-password");

    return res.status(HttpStatus.OK).send(user);
  } catch (error) {
    return sendError(res, error);
  }
};
