import { Request, Response } from "express";
import Joi from "joi";
import HttpStatus from "http-status-codes";
import { IUser, UserModel } from "@src/models/user-model";
import sendError from "@src/util/errors";
import { RequestWithContext } from "@src/shared/types/resquest-with-context";
import logger from "@src/logger";
import { isValidObjectId } from "mongoose";

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { params } = req;
    const { id } = params;

    if (!isValidObjectId(id))
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: "Invalid id." });

    const result = await UserModel.deleteOne({ _id: id });

    if (!result || result.deletedCount < 1)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: "Could not find a User with this id." });

    return res
      .status(HttpStatus.OK)
      .send({ message: `User with id ${id} successfully deleted.` });
  } catch (error) {
    return sendError(res, error);
  }
};
