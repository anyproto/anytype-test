#!/bin/bash

source ./scripts/env.sh

# Define colors
RED='\033[0;31m'
NC='\033[0m' # No Color

open -a Simulator

# Display Xcode version and available runtimes
echo "Xcode info:"
xcodebuild -version

# Function to check if iOS runtime exists
check_ios_runtime() {
    local runtime="com.apple.CoreSimulator.SimRuntime.iOS-${IOS_VERSION//./-}"
    if ! xcrun simctl list runtimes --json | jq -e ".runtimes[] | select(.identifier == \"$runtime\")" > /dev/null; then
        echo "Available runtimes:"
        xcrun simctl list runtimes
        echo -e "${RED}Error: iOS $IOS_VERSION runtime not found!${NC}. Check .env or .env.local file."
        exit 1
    fi
}

# Function to check if device model exists
check_device_model() {
    local model=$1
    local device_type="com.apple.CoreSimulator.SimDeviceType.${model// /-}"
    if ! xcrun simctl list devicetypes --json | jq -e ".devicetypes[] | select(.identifier == \"$device_type\")" > /dev/null; then
        echo "Available device types:"
        xcrun simctl list devicetypes
        echo -e "${RED}Error: Device model '$model' not found!${NC}. Check .env or .env.local file."
        exit 1
    fi
}

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

    # Check if device model exists
    check_device_model "$model"

    echo "Looking for existing $model..."
    local uuid=$(find_simulator "$model")

    if [ -z "$uuid" ]; then
        echo "Creating new simulator for $user..."
        uuid=$(xcrun simctl create \
            "$model" \
            "com.apple.CoreSimulator.SimDeviceType.${model// /-}" \
            "com.apple.CoreSimulator.SimRuntime.iOS-${IOS_VERSION//./-}")
        
        if [ -z "$uuid" ]; then
            echo -e "${RED}Error: Failed to create simulator for $user with model $model${NC}"
            exit 1
        fi
    else
        echo "Found existing simulator for $user with UDID: $uuid"
    fi

    # Export UUID to the provided variable name
    eval "$uuid_var=$uuid"
}

# Function to check simulator state
check_simulator_state() {
    local uuid=$1
    local state=$(xcrun simctl list devices --json | jq -r ".devices | to_entries[] | .value[] | select(.udid == \"$uuid\") | .state")
    echo "$state"
}

# Function to boot simulator without waiting
boot_simulator() {
    local uuid=$1
    local name=$2
    
    local state=$(check_simulator_state "$uuid")
    if [ "$state" = "Booted" ]; then
        echo "$name simulator is already booted"
        return
    fi

    echo "Booting $name simulator..."
    if ! xcrun simctl boot "$uuid"; then
        echo -e "${RED}Error: Failed to boot $name simulator${NC}"
        exit 1
    fi
}

# Function to wait for simulator to be fully booted
wait_for_simulator() {
    local uuid=$1
    local name=$2
    
    echo "Waiting for $name simulator to fully boot..."
    
    # Wait up to 30 seconds for simulator to boot
    local timeout=30
    local count=0
    
    while [ $count -lt $timeout ]; do
        if xcrun simctl bootstatus "$uuid" > /dev/null 2>&1; then
            echo "$name simulator successfully booted"
            return 0
        fi
        sleep 1
        count=$((count + 1))
    done
    
    echo -e "${RED}Error: $name simulator failed to boot within $timeout seconds${NC}"
    exit 1
}

# Check if iOS runtime exists before proceeding
check_ios_runtime

# Find or create simulators for both users
find_or_create_simulator "$IPHONE_MODEL_A" "User A" "USER_A_IOS_UUID"
find_or_create_simulator "$IPHONE_MODEL_B" "User B" "USER_B_IOS_UUID"

# Boot both simulators (without waiting for each one individually)
echo "Starting both simulators..."
boot_simulator "$USER_A_IOS_UUID" "User A"
boot_simulator "$USER_B_IOS_UUID" "User B"

# Wait for both simulators to be fully booted
echo "Waiting for simulators to fully boot..."
wait_for_simulator "$USER_A_IOS_UUID" "User A"
wait_for_simulator "$USER_B_IOS_UUID" "User B"

# Print UDIDs for debugging
echo "User A simulator UDID: $USER_A_IOS_UUID"
echo "User B simulator UDID: $USER_B_IOS_UUID"

# Export UDIDs to environment variables and save to env.export
echo "USER_A_IOS_UUID=$USER_A_IOS_UUID" > .env.export
echo "USER_B_IOS_UUID=$USER_B_IOS_UUID" >> .env.export

echo "Simulators successfully created and booted!" 
