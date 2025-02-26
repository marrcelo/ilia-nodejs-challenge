import "dotenv-safe/config";
import "./util/module-alias";
import * as database from "@src/database";
import logger from "@src/logger";
import bodyParser from "body-parser";
import express from "express";
import swaggerUi from "swagger-ui-express";
import pinoHttp from "pino-http";
import swaggerDocument from "./api-docs.json";
import authMiddleware from "./middlewares/auth";
import { createTransaction } from "./use-cases/create-transaction/create-transaction";
import getBalance from "./use-cases/get-balance/get.balance";
import { getTransactions } from "./use-cases/get-transactions/get-transactions";

export const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(pinoHttp());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) =>
  res.send({
    message: `Server running at http://localhost:${process.env.PORT}`,
  })
);

app.post("/transactions", authMiddleware, createTransaction);
app.get("/transactions", authMiddleware, getTransactions);
app.get("/balance", authMiddleware, getBalance);

export const server = app.listen(process.env.PORT, () => {
  logger.info(
    `Server running at http://localhost:${process.env.PORT}  on ${process.env.NODE_ENV}`
  );
});

database.connect();

export const gracefulShutdownHandler = function gracefulShutdownHandler(
  signal: NodeJS.SignalsListener
) {
  logger.warn(`Caught ${signal}, gracefully shutting down`);

  setTimeout(() => {
    logger.warn("Shutting down application");
    server.close(async function closeProcess() {
      await database.close();

      logger.warn("All requests stopped, shutting down");
      process.exit(0);
    });
  }, 0);
};

process.on("SIGINT", gracefulShutdownHandler);
process.on("SIGTERM", gracefulShutdownHandler);
process.on("SIGQUIT", gracefulShutdownHandler);

process.on("unhandledRejection", (reason, promise) => {
  logger.error(
    `App exiting due to an unhandled promise: ${promise} and reason: ${reason}`
  );
  throw reason;
});

process.on("uncaughtException", (error) => {
  logger.error(`App exiting due to an uncaught exception: ${error}`);
  process.exit(1);
});
