import { Request, Response } from "express";
import Joi from "joi";
import HttpStatus from "http-status-codes";
import { IUser, UserModel } from "@src/models/user-model";
import sendError from "@src/util/errors";

const UserBodySchema = Joi.object({
  first_name: Joi.string().min(3).required(),
  last_name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const validateCreateUserBody = (data: Partial<Omit<IUser, "id">>) => {
  return UserBodySchema.validate(data, {
    abortEarly: false,
  });
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const { error, value } = validateCreateUserBody(data);

    if (error)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: "Validation Error: Invalid request.", error });

    const user = new UserModel(value);
    const newUser = await user.save({});
    const { password, ...userWithouPassword } = newUser.toObject();

    return res.status(HttpStatus.CREATED).send(userWithouPassword);
  } catch (error) {
    return sendError(res, error);
  }
};
