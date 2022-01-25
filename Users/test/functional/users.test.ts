import { UserModel } from "@src/models/user-model";
import { isValidObjectId } from "mongoose";
import HttpStatus from "http-status-codes";
import usersToPopulate from "@test/fixtures/usersToPopulate.json";
import userWithAcessToken from "@test/fixtures/userWithAcessToken.json";

describe("Users functional tests", () => {
  beforeAll(async () => {
    await UserModel.deleteMany({});
    await UserModel.insertMany(usersToPopulate);
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

      expect(status).toBe(HttpStatus.BAD_REQUEST);
      expect(body.message).toMatch("Validation Error: Invalid request.");
      expect(body.error).toBeTruthy();
    });
    it("Should return a validation error when alredy exist a user with this email", async () => {
      const invalidUser = {
        first_name: "joão",
        last_name: "silva",
        email: "joao.silva@test.com",
        password: 123456789,
      };

      const { body, status } = await global.testRequest
        .post("/users")
        .send(invalidUser);

      expect(status).toBe(HttpStatus.BAD_REQUEST);
      expect(body.message).toMatch("Validation Error: Invalid request.");
      expect(body.error).toBeTruthy();
    });
  });
  describe("When auth user", () => {
    it("should return a user when body is valid", async () => {
      const authUser = {
        user: {
          email: "joao.silva@test.com",
          password: "123456789",
        },
      };
      const { body, status } = await global.testRequest
        .post("/auth")
        .send(authUser);
      const { access_token } = body;

      expect(status).toBe(HttpStatus.OK);
      expect(access_token).toBeTruthy();
    });

    it("Should return a error when passsword is wrong", async () => {
      const invalidAuthUser = {
        user: {
          email: "joao.silva@test.com",
          password: "1234567",
        },
      };

      const { body, status } = await global.testRequest
        .post("/auth")
        .send(invalidAuthUser);

      expect(status).toBe(HttpStatus.BAD_REQUEST);
      expect(body.message).toMatch(
        "Could not find a User with this email and password."
      );
    });
    it("Should return a error when user with email not exist", async () => {
      const invalidAuthUser = {
        user: {
          email: "joao.silva.2@test.com",
          password: "123456789",
        },
      };

      const { body, status } = await global.testRequest
        .post("/auth")
        .send(invalidAuthUser);

      expect(status).toBe(HttpStatus.BAD_REQUEST);
      expect(body.message).toMatch("Could not find a User with this email.");
    });
  });
  describe("When finding user", () => {
    it("should return a user when id is valid", async () => {
      const userId = "61f00edd78ee8e4d31e9b7b0";

      const { body, status } = await global.testRequest
        .get(`/users/${userId}`)
        .set({ authorization: userWithAcessToken.access_token });
      const { first_name, last_name } = body;

      expect(status).toBe(HttpStatus.OK);
      expect(first_name).toMatch("maria");
      expect(last_name).toMatch("silva");
    });

    it("Should return a validation error when id is not valid", async () => {
      const invalidId = "123";

      const { body, status } = await global.testRequest
        .get(`/users/${invalidId}`)
        .set({ authorization: userWithAcessToken.access_token });
      expect(status).toBe(HttpStatus.BAD_REQUEST);
      expect(body.message).toMatch("Invalid id.");
    });
  });
  describe("When updating user", () => {
    it("should return a user when body is valid", async () => {
      const user = {
        first_name: "MARIA",
        last_name: "SILVA",
      };
      const userId = "61f00edd78ee8e4d31e9b7b0";

      const { body, status } = await global.testRequest
        .patch(`/users/${userId}`)
        .send(user)
        .set({ authorization: userWithAcessToken.access_token });
      const { first_name, last_name } = body;
      expect(status).toBe(HttpStatus.OK);
      expect(first_name).toMatch("MARIA");
      expect(last_name).toMatch("SILVA");
    });

    it("Should return a validation error when id is not valid", async () => {
      const user = {
        first_name: "MARIA",
        last_name: "SILVA",
      };
      const invalidId = "123";

      const { body, status } = await global.testRequest
        .patch(`/users/${invalidId}`)
        .send(user)
        .set({ authorization: userWithAcessToken.access_token });
      expect(status).toBe(HttpStatus.BAD_REQUEST);
      expect(body.message).toMatch("Invalid id.");
    });
  });
  describe("When deleting user", () => {
    it("should return delete a user when id is valid", async () => {
      const userId = "61f00edd78ee8e4d31e9b7b0";

      const { body, status } = await global.testRequest
        .delete(`/users/${userId}`)
        .set({ authorization: userWithAcessToken.access_token });
      expect(status).toBe(HttpStatus.OK);
      expect(body.message).toMatch(
        `User with id ${userId} successfully deleted.`
      );
    });

    it("Should return a validation error when id is not valid or found", async () => {
      const invalidId = "61f00edd78ee8e4d31e9b7b0";

      const { body, status } = await global.testRequest
        .delete(`/users/${invalidId}`)
        .set({ authorization: userWithAcessToken.access_token });
      expect(status).toBe(HttpStatus.BAD_REQUEST);
      expect(body.message).toMatch("Could not find a User with this id.");
    });
  });
});
