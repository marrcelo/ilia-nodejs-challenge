import { UserModel } from "@src/models/user-model";
import sendError from "@src/util/errors";
import { Request, Response } from "express";
import HttpStatus from "http-status-codes";

const getUsers = async (req: Request, res: Response) => {
  try {
    const { user_id } = res.locals;
    const query: { _id?: string } = {};

    // eslint-disable-next-line no-underscore-dangle
    if (user_id) query._id = user_id;
    const users = await UserModel.find(query).select("-password");

    return res.status(HttpStatus.OK).send(users);
  } catch (error) {
    return sendError(res, error);
  }
};
export default getUsers;
