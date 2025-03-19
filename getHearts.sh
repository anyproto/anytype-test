#!/usr/bin/env bash
set -e

REPO="anyproto/anytype-heart"
GITHUB="api.github.com"
HEARTS_FOLDER="./heartsFolder"
NUM_VERSIONS=3
FILE="addon.tar.gz"
FEATURE_FILE_SYNC_PROD="./features/api/compatibilitySyncProd.feature"
FEATURE_FILE_LOCAL="./features/api/compatibilityLocal.feature"
FEATURE_FILE_SYNC_STAGING="./features/api/compatibilitySyncStaging.feature"

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
    FILE="addon.zip"
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
release_info=$(curl -sL "https://$GITHUB/repos/$REPO/releases?per_page=100")

# Extract the N latest major versions
all_versions=($(echo "$release_info" \
    | jq -r '.[] | .tag_name' \
    | grep -Eo '^v[0-9]+\.[0-9]+' \
    | sort -V \
    | uniq \
    | tail -n $NUM_VERSIONS))

echo "Processing all versions" >&2

###############################################
# Function to process and download releases
###############################################
process_releases() {
    local versions=("$@")
    local processed_versions=()

    for i in "${!versions[@]}"; do
        major_version="${versions[$i]}"
        echo "Processing latest release for major version $major_version..." >&2

        # Grab up to the top 2 tags that start with this major version
        release_tags=($(echo "$release_info" \
          | jq -r --arg version "$major_version" \
            '.[] | select(.tag_name | startswith($version)) | .tag_name' \
          | head -n 2))

        for release_tag in "${release_tags[@]}"; do
            echo "Trying release: $release_tag" >&2

            asset_id=$(echo "$release_info" \
              | jq -r --arg tag "$release_tag" --arg arch "$arch" \
                '.[] 
                 | select(.tag_name == $tag) 
                 | .assets[] 
                 | select(.name | test(".*_" + $arch)) 
                 | .id')

            if [ -z "$asset_id" ]; then
                echo "Asset not found for release $release_tag, trying next release..." >&2
                continue
            fi

            version_folder="$HEARTS_FOLDER/$(echo "$release_tag" | sed 's/^v//')"
            if [ -d "$version_folder" ] && [ "$(ls -A "$version_folder")" ]; then
                echo "Folder $version_folder already exists and is not empty. Skipping download." >&2
                processed_versions+=("$release_tag")
                break
            fi

            mkdir -p "$version_folder"
            file_path="$version_folder/$FILE"
            echo "Downloading file for $release_tag..." >&2
            curl -sL -H 'Accept: application/octet-stream' \
                 "https://$GITHUB/repos/$REPO/releases/assets/$asset_id" \
                 > "$file_path"

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

all_processed_versions=($(process_releases "${all_versions[@]}"))

###############################################
# Function to append version combinations
###############################################
append_combinations() {
    local file="$1"
    shift
    local versions=("$@")
    
    # Add combinations of different versions
    for ((i = 0; i < ${#versions[@]}; i++)); do
        for ((j = i + 1; j < ${#versions[@]}; j++)); do

            # If this is local, skip ONLY "v0.40.*" -> "v0.39.*"
            if [[ "$file" == "$FEATURE_FILE_LOCAL" ]]; then
              if [[ "${versions[$i]}" == v0.40.* && "${versions[$j]}" == v0.39.* ]]; then
                # Skip the pair only in this order: 40 --> 39
                continue
              fi
            fi

            echo "   | \"${versions[$i]}\" | \"${versions[$j]}\" |" >> "$file"
        done
    done
    
    # Add combination of last version with itself
    local last_idx=$((${#versions[@]} - 1))
    echo "   | \"${versions[$last_idx]}\" | \"${versions[$last_idx]}\" |" >> "$file"
    
    # Add combination of last version with second-to-last version (if available)
    if [ ${#versions[@]} -ge 2 ]; then
        local second_last_idx=$((${#versions[@]} - 2))

        # If it's the local file AND the pair is 40.x -> 39.x, then skip the echo
        if [[ "$file" == "$FEATURE_FILE_LOCAL" ]] \
           && [[ "${versions[$last_idx]}" == v0.40.* ]] \
           && [[ "${versions[$second_last_idx]}" == v0.39.* ]]; then
            # Do nothing: skip writing the line
            :
        else
            # Otherwise, write it out
            echo "   | \"${versions[$last_idx]}\" | \"${versions[$second_last_idx]}\" |" >> "$file"
        fi
    fi
}

###############################################
# Generate combinations in each feature file
###############################################
append_combinations "$FEATURE_FILE_SYNC_PROD"   "${all_processed_versions[@]}"
append_combinations "$FEATURE_FILE_LOCAL"       "${all_processed_versions[@]}"
append_combinations "$FEATURE_FILE_SYNC_STAGING" "${all_processed_versions[@]}"

printf "All tasks completed. Compatibility combinations appended.\n" >&2
