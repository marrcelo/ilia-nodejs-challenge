import { Request, Response } from "express";
import { TransactionModel } from "@src/models/transaction-model";

export default async (req: Request, res: Response) => {
  const [result] = await TransactionModel.aggregate([
    {
      $group: {
        _id: null,
        amount: {
          $sum: "$amount",
        },
      },
    },
  ]);

  if (result) return res.send({ amount: result.amount });
  return res.send({ amount: 0 });
};
