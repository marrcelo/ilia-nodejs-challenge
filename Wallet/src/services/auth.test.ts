import { generateToken, decodeToken } from "./auth";

describe("Auth service unit tests", () => {
  describe("When decoding a token", () => {
    it("should decode token to initial value", async () => {
      const initialValue = "test";
      const token = generateToken(initialValue);
      expect(decodeToken(token).sub).toBe(initialValue);
    });
  });
});
