# Test Repository

Welcome to the **Test Repository for Anytype**. This repository is used to manage and run end-to-end (E2E) tests using Cucumber, Playwright, and TypeScript.

## Table of Contents

- [Test Repository](#test-repository)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Run tests](#run-tests)
    - [Anytype-heart compatibility tests](#anytype-heart-compatibility-tests)
      - [Running Tests with Local Middleware](#running-tests-with-local-middleware)

## Prerequisites

Before setting up the project, make sure you have the following installed:

- Node.js and npm
- Go (for local middleware testing)

## Installation

Clone the repository and install the necessary dependencies.

```bash
git clone https://github.com/anyproto/anytype-test.git
npm install
```
## Run tests

### Anytype-heart compatibility tests
To test the compatibility of the latest 3 Anytype-heart versions, run the bash script first to populate the test scripts with versions and download them:
```bash
./getHearts.sh <macos|ubuntu|windows> <arm64|amd64>
```
Replace `<macos|ubuntu|windows>` with your operating system and `<arm64|amd64>` with your architecture.
Then run tests with:
```bash
npm run test:comp
```
#### Running Tests with Local Middleware

To run tests using the local middleware, follow these steps:

1. **Set the Version to "default" in the .feature File:**

  In the .feature file, set the version variable to "default" in the Scenario Outline or Server Test Step. This configuration tells the testing framework to use the local middleware built with Go instead of a specific version.

   For example, you can set the versions like this:
   ```bash
   Examples:
      | version1 | version2 |
      | "default" | "default" |
   ```
   Or like this:
   ```bash
   Given the server "default" 1 is running
   ```
   2. **Clone the `anytype-heart` Repository:**

   Clone the anytype-heart repository into the anytype-test/cmd folder:
   ```bash
   git clone https://github.com/anyproto/anytype-heart.git anytype-test/cmd/anytype-heart
   ```
   
3. **Follow the Instructions for `anytype-heart`:**

   Navigate to the anytype-heart repository and follow the setup and build instructions provided in its README file.
