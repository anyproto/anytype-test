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
  - [Project Structure](#project-structure)
  - [Test Execution](#test-execution)
    - [Test Commands structure (not all available yet)](#test-commands-structure-not-all-available-yet)
  - [Configuration Files](#configuration-files)

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

## Project Structure

Our test automation framework is organized as follows:
ANYTYPE-TEST/
├── features/                      # Gherkin feature files
│   ├── api/                      # API-specific features
│   ├── desktop/                  # Desktop-specific features
│   └── ios/                      # iOS-specific features
│
├── step_definitions/             # Step definitions for features
│   ├── api/                      # API test steps
│   ├── desktop/                  # Desktop UI test steps
│   └── ios/                      # iOS test steps
│
├── support/                      # Support code and utilities
│   ├── api/
│   │   ├── clients/             # High-level API clients
│   │   │   ├── accountApi.ts
│   │   │   ├── metricsApi.ts
│   │   │   └── etc...
│   │   └── services/            # Low-level services
│   │       ├── grpc-client.ts
│   │       ├── grpc-server.ts
│   │       └── streamRequest.ts
│   │
│   ├── server/                  # Server-related utilities
│   │   └── heartResolve.ts
│   │
│   ├── types/                   # Shared type definitions
│   │   └── dataTypes.ts
│   │
│   ├── helpers/                 # Shared utilities
│   │   ├── store.ts
│   │   └── proxy.ts
│   │
│   └── hooks/                   # Test lifecycle hooks
│       ├── api.hooks.ts
│       ├── desktop.hooks.ts
│       └── ios.hooks.ts
│
├── config/                      # Platform configurations
│   ├── api.config.js           # API-specific config
│   ├── desktop.config.js       # Desktop-specific config
│   └── ios.config.js           # iOS-specific config
│
├── test-results/               # Test outputs
│   ├── screenshots/
│   └── reports/

## Test Execution

### Test Commands structure (not all available yet)

```bash
# Platform-specific tests
npm run test:api            # Run API tests
npm run test:desktop       # Run Desktop tests
npm run test:ios          # Run iOS tests

# Tagged tests for specific platforms
npm run test:api:e2e      # Run API tests with @e2e tag
npm run test:desktop:comp # Run Desktop tests with @compatibility tag
npm run test:ios:chat     # Run iOS tests with @chat tag

# Combined test runs
npm run test:all          # Run all tests sequentially
npm run test:all:parallel # Run all tests in parallel

```
## Configuration Files

- `cucumber.js` - Test profiles and execution settings
- `config/*.config.js` - Platform-specific configurations
- `tsconfig.json` - TypeScript settings

Each platform (API, Desktop, iOS) has its own configuration file in the config/ directory that defines platform-specific settings like timeouts, capabilities, and environment variables.