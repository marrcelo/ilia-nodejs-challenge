import HttpStatus from "http-status-codes";

describe("App", () => {
  it("Should get HttpStatus.OK", async () => {
    const response = await global.testRequest.get("/");
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.text).toMatch("Server running at http://localhost:3001");
  });
  it("Should get HttpStatus.NOT_FOUND on invalid url", async () => {
    const endpoint = "/invalid";
    const response = await global.testRequest.get(endpoint);
    expect(response.status).toBe(HttpStatus.NOT_FOUND);
  });
});
