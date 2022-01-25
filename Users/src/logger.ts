import pino from "pino";

export default pino({
  enabled: Boolean(process.env.LOGGER_ENABLED),
  level: process.env.LOGGER_LEVEL || "debug",
});
