import { UserModel } from "@src/models/user-model";
import { isValidObjectId } from "mongoose";
import HttpStatus from "http-status-codes";
import usersToPopulate from "@test/fixtures/usersToPopulate.json";
import userWithAcessToken from "@test/fixtures/userWithAcessToken.json";

describe("Auth functional tests", () => {
  beforeAll(async () => {
    await UserModel.deleteMany({});
    await UserModel.insertMany(usersToPopulate);
  });
  describe("When auth a user", () => {
    it("should return a user and a acess_token when body is valid", async () => {
      const userData = {
        user: { email: "joana.costa@test.com", password: "123456789" },
      };
      const { body, status } = await global.testRequest
        .post("/auth")
        .send(userData);
      const { user, access_token } = body;

      expect(status).toBe(HttpStatus.OK);
      expect(access_token).toBeTruthy();
      expect(user.email).toMatch(userData.user.email);
    });

    it("Should return a validation error when password is wrong", async () => {
      const userData = {
        user: { email: "joana.costa@test.com", password: "12345678" },
      };
      const { body, status } = await global.testRequest
        .post("/auth")
        .send(userData);

      expect(status).toBe(HttpStatus.BAD_REQUEST);
      expect(body.message).toMatch(
        "Could not find a User with this email and password."
      );
    });
    it("Should return a validation error when not exist a user with this email", async () => {
      const userData = {
        user: { email: "email.not.exist@test.com", password: "12345678" },
      };
      const { body, status } = await global.testRequest
        .post("/auth")
        .send(userData);

      expect(status).toBe(HttpStatus.BAD_REQUEST);
      expect(body.message).toMatch("Could not find a User with this email.");
    });
  });
});
