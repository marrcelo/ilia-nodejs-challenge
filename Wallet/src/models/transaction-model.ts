import { Document, Schema, model } from "mongoose";

export enum TransactionTypesEnum {
  DEBIT,
  CREDIT,
}

export interface ITransaction extends Document {
  id: string;
  user_id: string;
  amount: number;
  type: TransactionTypesEnum;
}

const TransactionSchema = new Schema(
  {
    user_id: { type: String, trim: true, required: true, index: true },
    amount: { type: Number, trim: true, required: true },
    type: { type: String, enum: ["DEBIT", "CREDIT"], index: true },
  },
  {
    timestamps: true,
    // toJSON: {
    //   virtuals: true,
    //   transform: (_, ret): void => {
    //     ret.id = ret._id;
    //     delete ret._id;
    //     delete ret.__v;
    //   },
    // },
  }
);

export const TransactionModel = model<ITransaction>(
  "Campaign",
  TransactionSchema
);
