import { Request, Response } from "express";
import Joi from "joi";
import HttpStatus from "http-status-codes";
import { UserModel } from "@src/models/user-model";
import sendError from "@src/util/errors";
import { generateToken } from "@src/services/auth";

const AuthUserBodySchema = Joi.object({
  user: {
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  },
});

type AuthUserBodyType = {
  user: {
    email: string;
    password: string;
  };
};

export const validateAuthUserBodySchema = (data: AuthUserBodyType) => {
  return AuthUserBodySchema.validate(data, {
    abortEarly: false,
  });
};

export const authUser = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const { error, value } = validateAuthUserBodySchema(data);

    if (error)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: "Validation Error: Invalid request.", error });

    const { user } = value;

    const userWithEmail = await UserModel.findOne({ email: user.email });

    if (!userWithEmail)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: "Could not find a User with this email." });

    const isPasswordCorrect = userWithEmail.authenticate(user.password);

    if (!isPasswordCorrect)
      return res.status(HttpStatus.BAD_REQUEST).send({
        message: "Could not find a User with this email and password.",
      });

    // eslint-disable-next-line no-underscore-dangle
    const access_token = generateToken(userWithEmail._id.toString());

    const { password, ...userWithouPassword } = userWithEmail.toObject();
    return res
      .status(HttpStatus.OK)
      .send({ user: userWithouPassword, access_token });
  } catch (error) {
    return sendError(res, error);
  }
};
