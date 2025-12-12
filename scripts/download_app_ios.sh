#!/bin/bash

# Check if URL is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <github-actions-run-url>"
    exit 1
fi

# Extract run ID from URL
RUN_ID=$(echo "$1" | grep -o '[0-9]*$')
if [ -z "$RUN_ID" ]; then
    echo "Invalid GitHub Actions run URL"
    exit 1
fi

# Create build directory if it doesn't exist
mkdir -p build
cd build

rm -rf AnytypeIOS.zip
rm -rf AnytypeIOS
rm -rf "Anytype Dev.app"

# Download the artifact
echo "Downloading artifact from run $RUN_ID..."
gh run download $RUN_ID --repo anyproto/anytype-swift --name "AnytypeIOS"

# Check if download was successful
if [ $? -ne 0 ]; then
    echo "Failed to download artifact"
    exit 1
fi

# rm -rf AnytypeIOS
cd ..

echo "App downloaded and extracted to build/" 