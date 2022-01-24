const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: `${__dirname}/../.env.test` });

const { resolve } = path;

const root = resolve(__dirname, "..");
// eslint-disable-next-line import/no-dynamic-require
const rootConfig = require(`${root}/jest.config.js`);

module.exports = {
  ...rootConfig,
  ...{
    rootDir: root,
    displayName: "end2end-tests",
    setupFilesAfterEnv: ["<rootDir>/test/jest-setup.ts"],
    testMatch: ["<rootDir>/test/**/*.test.ts"],
  },
};
