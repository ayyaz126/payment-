/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/test/**/*.test.ts"], // ✅ Match tests inside src/test/...
  moduleFileExtensions: ["ts", "js"],
  verbose: true,
};
