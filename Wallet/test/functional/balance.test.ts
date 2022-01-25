import { TransactionModel } from "@src/models/transaction-model";
import HttpStatus from "http-status-codes";
import initialTransactions from "@test/fixtures/initialTransactions.json";
import { generateToken } from "@src/services/auth";

const userId = "4baa56f1230048567300485c";

describe("Transactions functional tests", () => {
  beforeEach(async () => {
    await TransactionModel.deleteMany({});
  });
  it("Should retrun 0 when not found any transactions", async () => {
    const authorization = generateToken(userId);

    const { body, status } = await global.testRequest
      .get("/balance")
      .set({ authorization });

    expect(status).toBe(HttpStatus.OK);
    expect(body.amount).toBe(0);
  });

  it("Should return total amount for transactions", async () => {
    await TransactionModel.insertMany(initialTransactions);
    const authorization = generateToken(userId);

    const { body, status } = await global.testRequest
      .get("/balance")
      .set({ authorization });

    expect(status).toBe(HttpStatus.OK);
    expect(body.amount).toBe(50);
  });

  it("Should return a unauthorized error when missing authorization", async () => {
    await TransactionModel.insertMany(initialTransactions);

    const { body, status } = await global.testRequest.get("/balance");

    expect(status).toBe(HttpStatus.UNAUTHORIZED);
    expect(body.message).toMatch("Missing authorization token.");
  });

  it("Should return a unauthorized error when authorization token is malformed", async () => {
    await TransactionModel.insertMany(initialTransactions);

    const { body, status } = await global.testRequest
      .get("/balance")
      .set({ authorization: "malformed" });

    expect(status).toBe(HttpStatus.UNAUTHORIZED);
    expect(body.message).toMatch("Authorization token malformed.");
  });
});
