import "dotenv-safe/config";
import "./util/module-alias";
import * as database from "@src/database";
import logger from "@src/logger";
import bodyParser from "body-parser";
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./api-docs.json";
import authMiddleware from "./middlewares/auth";
import { createUser } from "./use-cases/create-user/create-user";
import { getUsers } from "./use-cases/get-users/get-users";
import { updateUser } from "./use-cases/update-user/update-user";
import { deleteUser } from "./use-cases/delete-user/delete-user";
import { authUser } from "./use-cases/auth-user/auth-user";
import { getUserById } from "./use-cases/get-user-by-id/get-user-by-id";

export const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) =>
  res.send({
    message: `Server running at http://localhost:${process.env.PORT}`,
  })
);

app.post("/users", createUser);
app.get("/users", authMiddleware, getUsers);
app.get("/users/:id", authMiddleware, getUserById);
app.patch("/users/:id", authMiddleware, updateUser);
app.delete("/users/:id", authMiddleware, deleteUser);
app.post("/auth", authUser);

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
