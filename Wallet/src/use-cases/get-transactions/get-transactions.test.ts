import { ValidationError } from "joi";
import { validateReqQuerySchema } from "./get-transactions";

describe("Get transactions unit tests", () => {
  describe("When getting transactions", () => {
    it("should return a error when body has invalid data", async () => {
      const invalidQuery = {
        limit: -1,
      };
      const { error } = validateReqQuerySchema(invalidQuery);
      const details = error && error.details;

      expect(error).toBeInstanceOf(ValidationError);
      expect(details).toStrictEqual([
        {
          message: '"limit" must be greater than or equal to 1',
          path: ["limit"],
          type: "number.min",
          context: {
            limit: 1,
            value: -1,
            label: "limit",
            key: "limit",
          },
        },
      ]);
    });
    it("should pass when query is valid", async () => {
      const validQuery = {
        limit: 15,
      };
      const { error } = validateReqQuerySchema(validQuery);

      expect(error).toBe(undefined);
    });
  });
});
