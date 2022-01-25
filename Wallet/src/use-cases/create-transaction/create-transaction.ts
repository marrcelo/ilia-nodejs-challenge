import { Request, Response } from "express";
import Joi from "joi";
import { isValidObjectId } from "mongoose";
import HttpStatus from "http-status-codes";
import { ITransaction, TransactionModel } from "@src/models/transaction-model";
import sendError from "@src/util/errors";

const TransactionBodySchema = Joi.object({
  user_id: Joi.string()
    .custom((value, helpers) => {
      if (!isValidObjectId(value)) return helpers.error("any.invalid");
      return value;
    })
    .required(),
  amount: Joi.number().integer().min(0).required(),
  type: Joi.string().valid("CREDIT", "DEBIT").required(),
});

export const validateCreateTransactionBody = (
  data: Omit<ITransaction, "id">
) => {
  return TransactionBodySchema.validate(data, {
    abortEarly: false,
  });
};

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const { error, value } = validateCreateTransactionBody(data);

    if (error)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: "Validation Error: Invalid request.", error });

    const transaction = new TransactionModel(value);
    const newTransaction = await transaction.save();

    return res.status(HttpStatus.CREATED).send(newTransaction);
  } catch (error) {
    return sendError(res, error);
  }
};
