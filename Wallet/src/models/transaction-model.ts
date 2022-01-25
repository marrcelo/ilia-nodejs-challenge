import { Schema, model, Document } from "mongoose";
import { mongoosePagination, Pagination } from "mongoose-paginate-ts";

export interface ITransaction {
  id: string;
  user_id: string;
  amount: number;
  type: string;
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

TransactionSchema.plugin(mongoosePagination);

export const TransactionModel = model<
  ITransaction,
  Pagination<ITransaction & Document>
>("Transaction", TransactionSchema);
