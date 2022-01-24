import { Request, Response } from "express";
import Joi from "joi";
import HttpStatus from "http-status-codes";
import { TransactionModel } from "@src/models/transaction-model";
import sendError from "@src/util/errors";

const ReqQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).default(20),
  page: Joi.number().integer().min(1).default(1),
  sort: Joi.string(),
}).options({ stripUnknown: true });

interface IReqQuery {
  limit: number;
  page: number;
  sort: string;
}

export const validateReqQuerySchema = (data: Partial<IReqQuery>) => {
  return ReqQuerySchema.validate(data, {
    abortEarly: false,
  });
};

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const { query } = req;

    const { value, error } = validateReqQuerySchema(query);
    if (error)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: "Validation Error: Invalid query request.", error });

    const transactions = await TransactionModel.paginate(value);

    return res.send(transactions);
  } catch (error) {
    sendError(res, error);
  }
};
