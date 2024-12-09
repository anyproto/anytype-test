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

// Replace module.exports with module.exports
module.exports = {
  default: `${commonRequire} ${apiConfig} ${commonFormats}`,
  api: `${commonRequire} ${apiConfig} ${commonFormats}`,
  desktop: `${commonRequire} ${desktopConfig} ${commonFormats}`,
  ios: `${commonRequire} ${iosConfig} ${commonFormats}`,

  // Parallel execution configs
  "parallel-api": `${commonRequire} ${apiConfig} ${commonFormats} --parallel 2`,
  "parallel-desktop": `${commonRequire} ${desktopConfig} ${commonFormats} --parallel 2`,
  "parallel-ios": `${commonRequire} ${iosConfig} ${commonFormats} --parallel 2`,
};
