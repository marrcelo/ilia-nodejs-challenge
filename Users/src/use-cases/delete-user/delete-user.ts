import { Request, Response } from "express";
import HttpStatus from "http-status-codes";
import { UserModel } from "@src/models/user-model";
import sendError from "@src/util/errors";
import { isValidObjectId } from "mongoose";

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { user_id } = res.locals;

    if (!isValidObjectId(id))
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: "Invalid id." });

    if (id !== user_id)
      return res
        .status(HttpStatus.FORBIDDEN)
        .send({ message: "You can only delete your own User." });

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

export default deleteUser;
