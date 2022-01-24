import { Response } from "express";
import Joi from "joi";
import HttpStatus from "http-status-codes";
import { TransactionModel } from "@src/models/transaction-model";
import sendError from "@src/util/errors";
import { RequestWithContext } from "@src/shared/types/resquest-with-context";
import logger from "@src/logger";

const ReqQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).default(20),
  page: Joi.number().integer().min(1).default(1),
  sort: Joi.string().valid("ASC", "DESC"),
  type: Joi.string().valid("CREDIT", "DEBIT"),
}).options({ stripUnknown: true });

interface IReqQuery {
  limit: number;
  page: number;
  sort: string;
  type: string;
}

export const validateReqQuerySchema = (data: Partial<IReqQuery>) => {
  return ReqQuerySchema.validate(data, {
    abortEarly: false,
  });
};

export const getTransactions = async (
  req: RequestWithContext,
  res: Response
) => {
  try {
    const { query } = req;

    const { value, error } = validateReqQuerySchema(query);
    if (error)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: "Validation Error: Invalid query request.", error });

    const options: Partial<{
      query: { type: string };
      sort: { createdAt: number };
      limit: string;
      page: number;
    }> = {};

    if (value.type) options.query = { type: value.type };
    if (value.limit) options.limit = value.limit;
    if (value.page) options.page = value.page;
    if (value.sort) {
      options.sort = { createdAt: value.sort === "ASC" ? 1 : -1 };
    }
    const transactions = await TransactionModel.paginate(options);

    return res.send(transactions);
  } catch (error) {
    return sendError(res, error);
  }
};
