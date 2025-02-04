#!/usr/bin/env bash

# Set error handling
set -e

# Define variables
HEART_REPO="https://github.com/anyproto/anytype-heart.git"
TARGET_DIR="mw/anytype-heart"

# Check if target directory exists
if [ -d "$TARGET_DIR" ]; then
    echo "Directory $TARGET_DIR already exists. Removing it..."
    rm -rf "$TARGET_DIR"
fi

# Create parent directory if it doesn't exist
mkdir -p "mw"

# Clone the repository
echo "Cloning anytype-heart repository..."
git clone "$HEART_REPO" "$TARGET_DIR"

# Change to the repository directory
cd "$TARGET_DIR"

# Checkout main branch
echo "Checking out main branch..."
git checkout main

echo "Successfully cloned anytype-heart repository to $TARGET_DIR" 