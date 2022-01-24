import "dotenv/config";
import "./util/module-alias";
import express from "express";
import logger from "@src/logger";
import * as database from "@src/database";
import { createTransaction } from "./use-cases/create-transaction/create-transaction";
import bodyParser from "body-parser";

export const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) =>
  res.send(`Server running at http://localhost:${process.env.PORT}`)
);

app.post("/transactions", createTransaction);

export const server = app.listen(process.env.PORT, () => {
  logger.info(`Server running at http://localhost:${process.env.PORT}`);
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
