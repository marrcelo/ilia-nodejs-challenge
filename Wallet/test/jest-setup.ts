import { app, server } from "@src/index";
import mongoose from "mongoose";
import supertest from "supertest";

beforeAll(async () => {
  global.testRequest = supertest(app);
});

afterAll(async () => {
  server.close();
  await mongoose.disconnect();
});
