run-ios-simulators:
	@echo "Starting iOS simulators..."
	@./scripts/create-simulators.sh

run-ios-smoke-test:
	@npm run test:testios:smoke

run-ios-test:
	@npm run test:ios