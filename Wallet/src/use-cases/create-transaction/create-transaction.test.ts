import { ValidationError } from "joi";
import { validateCreateTransactionBody } from "./create-transaction";

describe("Transactions unit tests", () => {
  describe("When creating a new transaction", () => {
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
      const { error } = validateCreateTransactionBody(validBody);

      expect(error).toBe(undefined);
    });
  });
});
