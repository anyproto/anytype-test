#!/usr/bin/env bash
set -e

REPO="anyproto/anytype-heart"
GITHUB="api.github.com"
HEARTS_FOLDER="./heartsFolder"
NUM_VERSIONS=3 # Number of latest major versions to process
FILE="addon.tar.gz" # Default file name for non-Windows platforms
FEATURE_FILE_SYNC_PROD="./features/compatibilitySyncProd.feature" # Output feature file
FEATURE_FILE_LOCAL="./features/compatibilityLocal.feature" # Output feature file
FEATURE_FILE_SYNC_STAGING="./features/compatibilitySyncStaging.feature" 
platform="${1:-ubuntu-latest}"
arch="$2"
folder="build"

case "$platform" in
  ubuntu*)
    arch="linux-$arch"
    folder="$arch"
    ;;
  macos*)
    arch="darwin-$arch"
    folder="$arch"
    ;;
  windows*)
    arch="windows"
    folder="dist"
    FILE="addon.zip" # File name for Windows platform
    ;;
  *)
    echo "ERROR: Unknown platform $platform" >&2
    exit 1
    ;;
esac

echo "Platform: $platform" >&2
echo "Arch: $arch" >&2
echo "Folder: $folder" >&2
echo "" >&2

if [ -z "$arch" ]; then
  echo "ERROR: arch not specified" >&2
  exit 1
fi

# Fetch the list of releases
release_info=$(curl -sL https://$GITHUB/repos/$REPO/releases?per_page=100)

# Extract and process the latest major versions
all_versions=($(echo "$release_info" | jq -r '.[] | .tag_name' | grep -Eo '^v[0-9]+\.[0-9]+' | sort -V | uniq | tail -n $NUM_VERSIONS))

# Filter versions >= v0.35.0 for prod and staging
filtered_versions=($(for v in "${all_versions[@]}"; do if [[ "$v" > "v0.34.9" ]]; then echo "$v"; fi; done))

echo "Processing all versions for compatibilityLocal.feature" >&2
echo "Processing versions >= v0.35.0 for compatibilitySyncProd.feature and compatibilitySyncStaging.feature" >&2

# Function to process and download releases
process_releases() {
    local versions=("$@")
    local processed_versions=()
    for i in "${!versions[@]}"; do
        major_version="${versions[$i]}"
        echo "Processing latest release for major version $major_version..." >&2
        release_tags=($(echo "$release_info" | jq -r --arg version "$major_version" '.[] | select(.tag_name | startswith($version)) | .tag_name' | head -n 2))
        for release_tag in "${release_tags[@]}"; do
            echo "Trying release: $release_tag" >&2
            asset_id=$(echo "$release_info" | jq -r --arg tag "$release_tag" --arg arch "$arch" '.[] | select(.tag_name == $tag) | .assets[] | select(.name | test(".*_" + $arch)) | .id')
            if [ -z "$asset_id" ]; then
                echo "Asset not found for release $release_tag, trying next release..." >&2
                continue
            fi
            version_folder="$HEARTS_FOLDER/$(echo $release_tag | sed 's/^v//')"
            if [ -d "$version_folder" ] && [ "$(ls -A $version_folder)" ]; then
                echo "Folder $version_folder already exists and is not empty. Skipping download." >&2
                processed_versions+=("$release_tag")
                break
            fi
            mkdir -p "$version_folder"
            file_path="$version_folder/$FILE"
            echo "Downloading file for $release_tag..." >&2
            curl -sL -H 'Accept: application/octet-stream' "https://$GITHUB/repos/$REPO/releases/assets/$asset_id" > "$file_path"
            echo "Uncompressing..." >&2
            if [[ "$platform" == windows* ]]; then
                unzip "$file_path" -d "$version_folder"
            else
                tar -zxf "$file_path" -C "$version_folder"
            fi
            rm "$file_path"
            printf "Done for $release_tag!\n" >&2
            processed_versions+=("$release_tag")
            break
        done
        if [ -z "${processed_versions[$i]}" ]; then
            echo "ERROR: No suitable release found for major version $major_version" >&2
        fi
    done
    echo "${processed_versions[@]}"
}

# Process all versions for local
all_processed_versions=($(process_releases "${all_versions[@]}"))

# Process filtered versions for prod and staging
filtered_processed_versions=($(process_releases "${filtered_versions[@]}"))

# Function to append combinations to a file
append_combinations() {
    local file="$1"
    shift
    local versions=("$@")
    for ((i = 0; i < ${#versions[@]}; i++)); do
        for ((j = i + 1; j < ${#versions[@]}; j++)); do
            echo "   | \"${versions[$i]}\" | \"${versions[$j]}\" |" >> "$file"
        done
    done
}

# Append combinations to feature files
append_combinations "$FEATURE_FILE_SYNC_PROD" "${filtered_processed_versions[@]}"
append_combinations "$FEATURE_FILE_LOCAL" "${all_processed_versions[@]}"
append_combinations "$FEATURE_FILE_SYNC_STAGING" "${filtered_processed_versions[@]}"

printf "All tasks completed. Compatibility combinations appended to feature files.\n" >&2
