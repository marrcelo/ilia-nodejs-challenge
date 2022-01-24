import { app, server } from "@src/index";
import supertest from "supertest";

beforeAll(async () => {
  global.testRequest = supertest(app);
});

afterAll(async () => {
  server.close();
});
