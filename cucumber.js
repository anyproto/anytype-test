/* const { setWorldConstructor } = require("@cucumber/cucumber");

class CustomWorld {
  constructor() {
    // Use environment variable to determine the node to use
    this.isProd = process.env.NODE_ENV === "prod" || false;
  }

  getIsProd() {
    return this.isProd;
  }
}

setWorldConstructor(CustomWorld);
 */
module.exports = {
  default: [
    "--require-module ts-node/register", // Load TypeScript module
    "--require support/**/*.ts", // Load step definitions and support files
    "features/**/*.feature", // Specify feature files
    "--format json:results/cucumber-report.json", // Generate JSON report
    "--format html:results/cucumber-report.html", // Generate HTML report
    "--format @cucumber/pretty-formatter", // Pretty format for console output
  ].join(" "),
};
