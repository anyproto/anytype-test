# Test Repository

Welcome to the **Test Repository for Anytype**. This repository is used to manage and run end-to-end (E2E) tests across different platforms using various testing technologies.

## Table of Contents

- [Test Repository](#test-repository)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Project Structure](#project-structure)
  - [Testing Platforms and Tech Stack](#testing-platforms-and-tech-stack)
  - [Run tests](#run-tests)
    - [API and Desktop Tests](#api-and-desktop-tests)
    - [Anytype-heart compatibility tests](#anytype-heart-compatibility-tests)
      - [Running Tests with Local Middleware](#running-tests-with-local-middleware)
    - [iOS Tests](#ios-tests)
  - [Writing New Tests](#writing-new-tests)
    - [API and iOS Tests with Cucumber](#api-and-ios-tests-with-cucumber)
      - [Cucumber Feature Files](#cucumber-feature-files)
      - [Step Definitions](#step-definitions)
    - [Desktop Tests with Playwright](#desktop-tests-with-playwright)
  - [Maintenance](#maintenance)
    - [Adding New Heart Versions](#adding-new-heart-versions)
    - [CI/CD Integration](#cicd-integration)
    - [Troubleshooting](#troubleshooting)

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

## Project Structure

The project follows this directory structure:

```
anytype-test/
├── config/                 # Configuration files for different test environments
│   ├── ios.conf.ts         # iOS test configuration
│   ├── desktop.config.ts   # Desktop test configuration
│   └── testios.conf.ts     # Test iOS configuration
├── features/               # Cucumber feature files (BDD scenarios)
│   ├── api/                # API feature tests
│   ├── desktop/            # Desktop feature tests
│   └── ios/                # iOS feature tests
├── step_definitions/       # Step definitions for Cucumber
│   ├── api/                # API test step definitions
│   └── ios/                # iOS test step definitions
├── support/                # Support code for tests
│   ├── api/                # API support files
│   ├── ios/                # iOS support files
│   ├── hooks/              # Test hooks
│   ├── page_objects/       # Page object models
│   └── types/              # TypeScript types
├── playwright_tests/       # Playwright test files for desktop testing
│   ├── setup/              # Test setup files
│   └── utils/              # Utility functions for tests
├── mw/                     # Middleware directory for heart testing
├── heartsFolder/           # Storage for different versions of Anytype heart
├── pb/                     # Protocol buffers
├── results/                # Test results
│   └── screenshots/        # Test screenshots
├── assets/                 # Static assets for tests
└── getHearts.sh            # Script to download heart versions
```

## Testing Platforms and Tech Stack

This repository contains tests for three main platforms, each with its own technology stack:

1. **API Tests**
   - **Framework**: Cucumber.js
   - **Language**: TypeScript
   - **Tools**: gRPC for communication with Anytype-heart middleware
   - **Location**: `features/api/` and `step_definitions/api/`

2. **Desktop Tests**
   - **Framework**: Playwright (not using Cucumber)
   - **Language**: TypeScript
   - **Tools**: Electron-playwright-helpers
   - **Location**: `playwright_tests/`

3. **iOS Tests**
   - **Framework**: Cucumber.js with WebdriverIO
   - **Language**: TypeScript
   - **Tools**: Appium, XCUITest
   - **Location**: `features/ios/` and `step_definitions/ios/`

## Run tests

### API and Desktop Tests

The project offers several test commands:

```bash
# Run API tests
npm run test:api

# Run desktop tests with Playwright
npm run test:desktop

# Run end-to-end tests
npm run test:e2e

# Run smoke tests
npm run test:smoke

# Run sync tests
npm run test:sync
```

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

1. **Set the Version in the .feature File:**

  In the .feature file, you can set the version variable in the Scenario Outline or Server Test Step:
  
  - Use `"default"` to use the local middleware built with Go
  - Use a specific version like `"v0.38.0"` to use that particular version of the heart middleware

   For example, you can set the versions like this:
   ```bash
   Examples:
      | version1 | version2 |
      | "default" | "v0.38.0" |
   ```
   Or like this:
   ```bash
   Given the server "v0.38.0" 1 is running
   ```
   2. **Clone the `anytype-heart` Repository (for "default" version only):**

   If using the "default" version, clone the anytype-heart repository into the anytype-test/mw folder:
   ```bash
   git clone https://github.com/anyproto/anytype-heart.git anytype-test/mw/anytype-heart
   ```
   
1. **Follow the Instructions for `anytype-heart` (for "default" version only):**

   When using the "default" version, navigate to the anytype-heart repository and follow the setup and build instructions provided in its README file.

### iOS Tests

To run tests for iOS applications, follow these steps:

1. **Prerequisites for iOS Testing:**
   - macOS operating system
   - Xcode installed with iOS simulators
   - Valid Apple Developer account (for testing on real devices)

2. **Environment Setup:**
   - If you encounter "simctl is not in path" error, add Xcode developer tools to your PATH:
     ```bash
     # Add this to your ~/.zshrc or ~/.bash_profile
     export PATH=$PATH:/Applications/Xcode.app/Contents/Developer/usr/bin
     
     # Then reload your shell configuration
     source ~/.zshrc  # or source ~/.bash_profile
     ```
   - Set up the required environment variables for device identification:
     ```bash
     # For simulator testing, set the UDIDs of your test devices
     export IPHONE_A_UDID="your-first-device-udid"  # e.g., "CF76C796-DB3A-4A51-B52F-340201F8D980"
     export IPHONE_B_UDID="your-second-device-udid" # e.g., "556B179D-A81B-4367-91F4-FD1361A45935"
     ```
   - To get the UDID of your simulators, run:
     ```bash
     xcrun simctl list devices
     ```

3. **Setup iOS Test Environment:**
   ```bash
   xcrun simctl list devices
   ```

4. **Run iOS Tests:**
   ```bash
   npm run test:ios
   ```

   This will execute the test suite on the default iOS simulator. To specify a particular device or iOS version:
   ```bash
   npm run test:ios -- --device="iPhone 14"
   ```

5. **Running Tests on Physical Devices:**
   - Connect your iOS device via USB
   - Trust the development computer on your iOS device
   - Ensure your device is listed in Xcode
   ```bash
   npm run test:ios -- --device=physical
   ```

Note: Make sure your iOS app is properly configured with the correct provisioning profiles and certificates before running tests on physical devices.

## Writing New Tests

The approach to writing tests varies depending on the platform you're targeting:

### API and iOS Tests with Cucumber

API and iOS tests use Cucumber's Behavior-Driven Development (BDD) approach:

#### Cucumber Feature Files

New tests are written using Cucumber's Gherkin syntax in `.feature` files. These files should be placed in the appropriate subdirectory:

- API tests: `features/api/`
- iOS tests: `features/ios/`

Example feature file structure:

```gherkin
@tag
Feature: Feature name

  Background:
    Given common setup steps

  Scenario: Test specific functionality
    When a user does something
    Then a certain result should happen
```

#### Step Definitions

Implement the step definitions for your feature tests in the corresponding step_definitions directory:

- API steps: `step_definitions/api/`
- iOS steps: `step_definitions/ios/`

```typescript
import { Given, When, Then } from '@cucumber/cucumber';

Given('common setup steps', async function() {
  // Implementation
});

When('a user does something', async function() {
  // Implementation
});

Then('a certain result should happen', async function() {
  // Implementation
});
```

### Desktop Tests with Playwright

Desktop tests use Playwright directly without Cucumber:

1. Create a new spec file in the `playwright_tests/` directory
2. Use the Page Object Model pattern for better maintainability
3. Run with `npm run test:desktop`

Example:

```typescript
import { test, expect } from '@playwright/test';
import { electronApp } from 'electron-playwright-helpers';

test('basic desktop test', async ({ page }) => {
  // Setup application window
  const electronWindow = await electronApp.firstWindow();
  
  // Interact with the application
  await electronWindow.locator('button.action').click();
  
  // Perform assertions
  await expect(electronWindow.locator('h1')).toHaveText('Expected Text');
});
```

## Maintenance

### Adding New Heart Versions

When new versions of Anytype-heart are released:

1. Update the version information in the compatibility tests
2. Use the `getHearts.sh` script to download the new versions

### CI/CD Integration

The tests are configured to run in CI/CD environments. See the workflows in the `.github/` directory for details on how the tests are executed automatically.

### Troubleshooting

Common issues and their solutions:

1. **Test failures due to timing issues**: Increase wait times or implement more robust waiting mechanisms
2. **iOS simulator not found**: Ensure the correct simulator is installed and specified in the configuration
3. **Middleware connection issues**: Check that the Anytype-heart is properly configured and running
