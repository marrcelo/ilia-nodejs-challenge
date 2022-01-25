import { ValidationError } from "joi";
import { validateCreateUserBody } from "./create-user";

describe("Create transactions unit tests", () => {
  describe("When creating a new transaction", () => {
    it("should return a error when body has invalid data", async () => {
      const invalidBody = {
        first_name: "joão",
        last_name: "silva",
        email: "joao.silva@test.com",
      };
      const { error } = validateCreateUserBody(invalidBody);
      const details = error && error.details;

      expect(error).toBeInstanceOf(ValidationError);
      expect(details).toStrictEqual([
        {
          message: '"password" is required',
          path: ["password"],
          type: "any.required",
          context: {
            label: "password",
            key: "password",
          },
        },
      ]);
    });
    it("should pass when body is valid", async () => {
      const validBody = {
        first_name: "joão",
        last_name: "silva",
        email: "joao.silva@test.com",
        password: "123456789",
      };
      const { error } = validateCreateUserBody(validBody);

      expect(error).toBe(undefined);
    });
  });
});
