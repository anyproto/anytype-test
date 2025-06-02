#!/bin/bash

source ./scripts/env.sh

open -a Simulator

# Display Xcode version and available runtimes
echo "Xcode info:"
xcodebuild -version
echo "Available iOS runtimes:"
xcrun simctl list runtimes

# Function to find existing simulator
find_simulator() {
    local model=$1
    local runtime="com.apple.CoreSimulator.SimRuntime.iOS-${IOS_VERSION//./-}"
    local device_type="com.apple.CoreSimulator.SimDeviceType.${model// /-}"
    
    # First try to find booted device
    local booted_uuid=$(xcrun simctl list devices --json | jq -r ".devices[\"$runtime\"] | .[] | select(.name == \"$model\" and .deviceTypeIdentifier == \"$device_type\" and .state == \"Booted\") | .udid" | head -n 1)
    
    if [ -n "$booted_uuid" ]; then
        echo "$booted_uuid"
        return
    fi
    
    # If no booted device found, look for any matching device
    xcrun simctl list devices --json | jq -r ".devices[\"$runtime\"] | .[] | select(.name == \"$model\" and .deviceTypeIdentifier == \"$device_type\") | .udid" | head -n 1
}

# Function to find or create simulator
find_or_create_simulator() {
    local model=$1
    local user=$2
    local uuid_var=$3

    echo "Looking for existing $model..."
    local uuid=$(find_simulator "$model")

    if [ -z "$uuid" ]; then
        echo "Creating new simulator for $user..."
        uuid=$(xcrun simctl create \
            "$model" \
            "com.apple.CoreSimulator.SimDeviceType.${model// /-}" \
            "com.apple.CoreSimulator.SimRuntime.iOS-${IOS_VERSION//./-}")
    else
        echo "Found existing simulator for $user with UDID: $uuid"
    fi

    # Export UUID to the provided variable name
    eval "$uuid_var=$uuid"
}

# Find or create simulators for both users
find_or_create_simulator "$IPHONE_MODEL_A" "User A" "USER_A_IOS_UUID"
find_or_create_simulator "$IPHONE_MODEL_B" "User B" "USER_B_IOS_UUID"

# Boot simulators
echo "Booting simulators..."
xcrun simctl boot "$USER_A_IOS_UUID"
xcrun simctl boot "$USER_B_IOS_UUID"

# Check boot status
echo "Checking boot status..."
xcrun simctl bootstatus "$USER_A_IOS_UUID"
xcrun simctl bootstatus "$USER_B_IOS_UUID"

# Print UDIDs for debugging
echo "User A simulator UDID: $USER_A_IOS_UUID"
echo "User B simulator UDID: $USER_B_IOS_UUID"

# Wait for simulators to fully boot
echo "Waiting 5 seconds for simulators to fully boot..."
sleep 5

# List all devices
echo "===== List of all simulators ====="
xcrun simctl list devices

# Check User A simulator state
echo "Checking User A simulator state:"
xcrun simctl list devices | grep "$USER_A_IOS_UUID" || true

# Check User B simulator state
echo "Checking User B simulator state:"
xcrun simctl list devices | grep "$USER_B_IOS_UUID" || true

# Export UDIDs to environment variables and save to env.export
echo "USER_A_IOS_UUID=$USER_A_IOS_UUID" > .env.export
echo "USER_B_IOS_UUID=$USER_B_IOS_UUID" >> .env.export

echo "Simulators successfully created and booted!" 
