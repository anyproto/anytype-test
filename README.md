# Test Repository

Welcome to the **Test Repository for Anytype**. This repository is used to manage and run end-to-end (E2E) tests using Cucumber, Playwright, and TypeScript.

## Table of Contents

- [Test Repository](#test-repository)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Run tests](#run-tests)
    - [Anytype-heart compatibility tests](#anytype-heart-compatibility-tests)

## Prerequisites

Before setting up the project, make sure you have the following installed:

- npm

## Installation

Clone the repository and install the necessary dependencies.

```bash
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