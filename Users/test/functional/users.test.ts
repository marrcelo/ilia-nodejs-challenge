import { UserModel } from "@src/models/user-model";
import { isValidObjectId } from "mongoose";
import HttpStatus from "http-status-codes";

describe("Users functional tests", () => {
  beforeAll(async () => {
    await UserModel.deleteMany({});
  });
  describe("When creating a new user", () => {
    it("should return a user when body is valid", async () => {
      const newUser = {
        first_name: "joão",
        last_name: "silva",
        email: "joao.silva@test.com",
      };
      const { body, status } = await global.testRequest
        .post("/users")
        .send({ password: "123456789", ...newUser });
      const { first_name, last_name, email, _id } = body;

      expect(status).toBe(HttpStatus.CREATED);
      expect(isValidObjectId(_id)).toBeTruthy();

      expect({ first_name, last_name, email }).toEqual(newUser);
    });

    it("Should return a validation error when a field is missing", async () => {
      const invalidUser = {
        first_name: "joão",
        last_name: "silva",
        password: "123456789",
      };

      const { body, status } = await global.testRequest
        .post("/users")
        .send(invalidUser);

      console.log("body");
      console.log(body);

      expect(status).toBe(HttpStatus.BAD_REQUEST);
      expect(body.message).toMatch("Validation Error: Invalid request.");
      expect(body.error).toBeTruthy();
    });
  });
});
