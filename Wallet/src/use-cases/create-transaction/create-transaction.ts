import { Request, Response } from "express";
import Joi from "joi";
import { isValidObjectId } from "mongoose";
import HttpStatus from "http-status-codes";
import { TransactionModel } from "@src/models/transaction-model";

export const createTransaction = async (req: Request, res: Response) => {
  const data = req.body;
  const { error, value } = validateCreateTransactionBody(data);

  if (error)
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send({ message: "Validation Error: Invalid request.", error });

  const transaction = new TransactionModel(value);
  const newTransaction = await transaction.save();

  return res.send(newTransaction);
};

export const validateCreateTransactionBody = (data: any) => {
  return TransactionBodySchema.validate(data, {
    abortEarly: false,
  });
};

const TransactionBodySchema = Joi.object({
  user_id: Joi.string()
    .custom((value, helpers) => {
      if (!isValidObjectId(value)) return helpers.error("any.invalid");
      return true;
    })
    .required(),
  amount: Joi.number().integer().min(0).required(),
  type: Joi.string().valid("CREDIT", "DEBIT").required(),
});
