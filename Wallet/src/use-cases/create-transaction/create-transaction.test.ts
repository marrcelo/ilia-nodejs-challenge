import { TransactionModel } from "@src/models/transaction-model";
import { ValidationError } from "joi";
import { validateCreateTransactionBody } from "./create-transaction";

describe("Transactions unit tests", () => {
  describe("When creating a new user", () => {
    it("should return a error when body is empty", async () => {
      const emptyBody = {};
      const { error } = validateCreateTransactionBody(emptyBody);
      const details = error && error.details;

      expect(error).toBeInstanceOf(ValidationError);
      expect(details).toStrictEqual([
        {
          message: '"user_id" is required',
          path: ["user_id"],
          type: "any.required",
          context: { label: "user_id", key: "user_id" },
        },
        {
          message: '"amount" is required',
          path: ["amount"],
          type: "any.required",
          context: { label: "amount", key: "amount" },
        },
        {
          message: '"type" is required',
          path: ["type"],
          type: "any.required",
          context: { label: "type", key: "type" },
        },
      ]);
    });
    it("should return a error when body has invalid data", async () => {
      const invalidBody = {
        amount: 15,
        user_id: "507f1f77bcf86cd799439011",
        type: "credit",
      };
      const { error } = validateCreateTransactionBody(invalidBody);
      const details = error && error.details;

      expect(error).toBeInstanceOf(ValidationError);
      expect(details).toStrictEqual([
        {
          message: '"type" must be one of [CREDIT, DEBIT]',
          path: ["type"],
          type: "any.only",
          context: {
            valids: ["CREDIT", "DEBIT"],
            label: "type",
            value: "credit",
            key: "type",
          },
        },
      ]);
    });
    it("should pass when body is valid", async () => {
      const validBody = {
        amount: 15,
        user_id: "507f1f77bcf86cd799439011",
        type: "CREDIT",
      };
      const { error, value } = validateCreateTransactionBody(validBody);
      console.log("value");
      console.log(JSON.stringify(value));

      expect(error).toBe(undefined);
    });
  });
});
