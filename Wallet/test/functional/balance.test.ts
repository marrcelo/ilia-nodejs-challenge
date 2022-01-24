import { TransactionModel } from "@src/models/transaction-model";
import HttpStatus from "http-status-codes";
import initialTransactions from "@test/fixtures/initialTransactions.json";

describe("Transactions functional tests", () => {
  beforeAll(async () => {
    await TransactionModel.deleteMany({});
  });
  it("Should retrun 0 when not found any transactions", async () => {
    const { body, status } = await global.testRequest.get("/balance");

    expect(status).toBe(HttpStatus.OK);
    expect(body.amount).toBe(0);
  });

  it("Should return total amount for transactions", async () => {
    await TransactionModel.insertMany(initialTransactions);

    const { body, status } = await global.testRequest.get("/balance");

    expect(status).toBe(HttpStatus.OK);
    expect(body.amount).toBe(100);
  });
});
