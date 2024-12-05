import type { Config } from "jest";

const config: Config = {
  transform: {
    "^.+\\.(ts|js|tsx|jsx)$": "@swc/jest",
  },
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jset.setup.js"],
  modulePaths: ["<rootDir>/src/**/*.test.(ts|js|tsx|jsx)"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default config;
