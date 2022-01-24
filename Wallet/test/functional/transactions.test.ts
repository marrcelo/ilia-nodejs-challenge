import { TransactionModel } from "@src/models/transaction-model";
import { isValidObjectId } from "mongoose";
import HttpStatus from "http-status-codes";
import initialTransactions from "@test/fixtures/initialTransactions.json";

describe("Transactions functional tests", () => {
  beforeAll(async () => {
    await TransactionModel.deleteMany({});
    await TransactionModel.insertMany(initialTransactions);
  });

  it("should return a transaction", async () => {
    const newTransaction = {
      amount: 15,
      user_id: "507f1f77bcf86cd799439011",
      type: "CREDIT",
    };
    const { body, status } = await global.testRequest
      .post("/transactions")
      .send(newTransaction);
    const { amount, user_id, type, _id } = body;

    expect(status).toBe(HttpStatus.CREATED);
    expect(isValidObjectId(_id)).toBeTruthy();
    expect({ amount, user_id, type }).toEqual(newTransaction);
  });

  it("Should return a validation error when a field is missing", async () => {
    const invalidTransaction = {
      user_id: "507f1f77bcf86cd799439011",
      type: "CREDIT",
    };
    const { body, status } = await global.testRequest
      .post("/transactions")
      .send(invalidTransaction);

    expect(status).toBe(HttpStatus.BAD_REQUEST);
    expect(body.message).toMatch("Validation Error: Invalid request.");
    expect(body.error).toBeTruthy();
  });
  it("Should return a pagination search when getting transactions", async () => {
    const { body, status } = await global.testRequest.get("/transactions");

    expect(status).toBe(HttpStatus.OK);
    expect(body.totalDocs).toBe(11);
    expect(Object.keys(body)).toEqual([
      "limit",
      "hasPrevPage",
      "hasNextPage",
      "hasMore",
      "docs",
      "totalDocs",
      "totalPages",
      "page",
      "pagingCounter",
    ]);
  });
  it("Should return  error when  trying to get transactions with invalid query", async () => {
    const { body, status } = await global.testRequest
      .get("/transactions")
      .query({ limit: -1 });

    expect(status).toBe(HttpStatus.BAD_REQUEST);
    expect(body.message).toMatch("Validation Error: Invalid query request.");
    expect(body.error).toBeTruthy();
  });
});
