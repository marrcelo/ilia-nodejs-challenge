import { Request, Response } from "express";
import { TransactionModel } from "@src/models/transaction-model";
import sendError from "@src/util/errors";

const getBalance = async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    return sendError(res, error);
  }
};

export default getBalance;
