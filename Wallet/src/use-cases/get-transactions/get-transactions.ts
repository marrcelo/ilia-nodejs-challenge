import { Request, Response } from "express";
import Joi from "joi";
import HttpStatus from "http-status-codes";
import { TransactionModel } from "@src/models/transaction-model";
import sendError from "@src/util/errors";

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

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const { query } = req;
    const { user_id } = res.locals;

    const { value, error } = validateReqQuerySchema(query);
    if (error)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: "Validation Error: Invalid query request.", error });

    const options: {
      query: { type?: string; user_id: string };
      sort?: { createdAt: number };
      limit?: string;
      page?: number;
    } = { query: { user_id } };

    if (value.type) options.query.type = value.type;
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
