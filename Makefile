run-ios-simulators:
	@echo "Starting iOS simulators..."
	@./scripts/create-simulators.sh

download_latest_app_ios:
	@./scripts/download_latest_app_ios.sh

download_app_ios:
	@if [ -z "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		echo "Usage: make download_app_ios <github-actions-run-url>"; \
		exit 1; \
	fi
	@./scripts/download_app_ios.sh "$(filter-out $@,$(MAKECMDGOALS))"

%:
	@:
