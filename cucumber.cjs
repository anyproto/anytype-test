// Common requirements that are shared across all test types
const commonRequire = [
  "--require-module ts-node/register",
  "--require support/types/dataTypes.ts", // Only load shared types
  "--require support/helpers/**/*.ts", // Shared helpers
].join(" ");

// Format configurations
const commonFormats = [
  "--format json:results/cucumber-report.json",
  "--format html:results/cucumber-report.html",
  "--format @cucumber/pretty-formatter",
].join(" ");

// Test type specific paths
const apiConfig = [
  "--require support/hooks/api.hooks.ts",
  "--require support/api/**/*.ts",
  "--require step_definitions/api/**/*.ts",
  "features/api/**/*.feature",
].join(" ");

const desktopConfig = [
  "--require support/hooks/desktop.hooks.ts",
  "--require support/api/**/*.ts", // API is shared with desktop tests
  "--require step_definitions/desktop/**/*.ts",
  "features/desktop/**/*.feature",
].join(" ");

const iosConfig = [
  "--require support/hooks/ios.hooks.ts",
  "--require support/api/**/*.ts", // API is shared with iOS tests
  "--require step_definitions/ios/*.ts",
  "features/ios/*.feature",
].join(" ");

// Common configurations for retry mechanism
const commonRetry = [
  "--retry 1",
].join(" ");

module.exports = {
  default: `${commonRequire} ${apiConfig} ${commonFormats} ${commonRetry}`,
  api: `${commonRequire} ${apiConfig} ${commonFormats} ${commonRetry}`,
  desktop: `${commonRequire} ${desktopConfig} ${commonFormats} ${commonRetry}`,
  ios: `${commonRequire} ${iosConfig} ${commonFormats} ${commonRetry}`,
};
