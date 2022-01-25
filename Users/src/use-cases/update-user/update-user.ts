import { Request, Response } from "express";
import Joi from "joi";
import HttpStatus from "http-status-codes";
import { IUser, UserModel } from "@src/models/user-model";
import sendError from "@src/util/errors";
import { isValidObjectId } from "mongoose";

const UserBodySchema = Joi.object({
  first_name: Joi.string().min(3),
  last_name: Joi.string().min(3),
  email: Joi.string().email(),
  password: Joi.string().min(6),
});

export const validateCreateUserBody = (data: Partial<Omit<IUser, "id">>) => {
  return UserBodySchema.validate(data, {
    abortEarly: false,
  });
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const { id } = req.params;
    const { user_id } = res.locals;

    if (!isValidObjectId(id))
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: "Invalid id." });

    const { error, value } = validateCreateUserBody(data);

    if (id !== user_id)
      return res
        .status(HttpStatus.FORBIDDEN)
        .send({ message: "You can only update your own User." });

    if (error)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: "Validation Error: Invalid request.", error });

    const updatedUserResult = await UserModel.updateOne({ _id: id }, value, {
      new: true,
    }).select("-password");

    if (!updatedUserResult || updatedUserResult.matchedCount < 1)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: "Could not find a User with this id." });

    const updatedUser = await UserModel.findOne({ _id: id }).select(
      "-password"
    );

    return res.status(HttpStatus.OK).send(updatedUser);
  } catch (error) {
    return sendError(res, error);
  }
};
