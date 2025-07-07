#!/bin/bash

# Get the latest successful run of the ipa workflow
LATEST_RUN=$(gh run list --repo anyproto/anytype-swift --workflow ipa.yaml --status success --limit 1 --json url --jq '.[0].url')

if [ -z "$LATEST_RUN" ]; then
    echo "No successful runs found"
    exit 1
fi

echo "Found latest run: $LATEST_RUN"

# Call download_app.sh with the latest run URL
"$(dirname "$0")/download_app_ios.sh" "$LATEST_RUN" 