const dotenv = require("dotenv-safe");
const path = require("path");

dotenv.config({ path: `${__dirname}/.env.test` });

const { resolve } = path;

const root = resolve(__dirname);

module.exports = {
  rootDir: root,
  displayName: "root-tests",
  testMatch: ["<rootDir>/src/**/*.test.ts", "<rootDir>/src/**/*.*.test.ts"],
  testEnvironment: "node",
  clearMocks: true,
  preset: "ts-jest",
  moduleNameMapper: {
    "@src/(.*)": "<rootDir>/src/$1",
    "@test/(.*)": "<rootDir>/test/$1",
  },
};
