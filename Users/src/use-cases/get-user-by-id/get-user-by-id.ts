import { UserModel } from "@src/models/user-model";
import sendError from "@src/util/errors";
import { Request, Response } from "express";
import HttpStatus from "http-status-codes";
import { isValidObjectId } from "mongoose";

const getUserById = async (req: Request, res: Response) => {
  try {
    const { params } = req;
    const { id } = params;
    const { user_id } = res.locals;

    if (!isValidObjectId(id))
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: "Invalid id." });

    if (id !== user_id)
      return res
        .status(HttpStatus.FORBIDDEN)
        .send({ message: "You can only have access to your User." });

    const user = await UserModel.findOne({ _id: id }).select("-password");

    return res.status(HttpStatus.OK).send(user);
  } catch (error) {
    return sendError(res, error);
  }
};
export default getUserById;
