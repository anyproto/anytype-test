#!/usr/bin/env bash

REPO="anyproto/anytype-heart"
GITHUB="api.github.com"
HEARTS_FOLDER="./heartsFolder"
NUM_VERSIONS=3  # Number of latest major versions to process
FILE="addon.tar.gz"  # Default file name for non-Windows platforms
FEATURE_FILE="./features/compatibility.feature"  # Output feature file

platform=${1:-ubuntu-latest};
arch=$2;
folder="build";

if [ "$platform" = "ubuntu-latest" ]; then
  arch="linux-$arch";
  folder="$arch";
elif [ "$platform" = "macos-12" ]; then
  arch="darwin-$arch";
  folder="$arch";
elif [ "$platform" = "windows-latest" ]; then
  arch="windows";
  folder="dist";
  FILE="addon.zip"  # File name for Windows platform
fi;

echo "Arch: $arch"
echo "Folder: $folder"
echo ""

if [ "$arch" = "" ]; then
  echo "ERROR: arch not found"
  exit 1
fi;

# Fetch the list of releases
release_info=$(curl -sL https://$GITHUB/repos/$REPO/releases?per_page=100)

# Extract and process the latest major versions
versions=($(echo "$release_info" | jq -r '.[] | .tag_name' | grep -Eo '^v[0-9]+\.[0-9]+' | sort -V | uniq | tail -n $NUM_VERSIONS))

# Process each version
for i in "${!versions[@]}"; do
  major_version="${versions[$i]}"
  echo "Processing latest release for major version $major_version..."
  
  # Find the latest release for this major version
  release_tag=$(echo "$release_info" | jq -r --arg version "$major_version" '.[] | select(.tag_name | startswith($version)) | .tag_name' | head -n 1)
  
  if [ -z "$release_tag" ]; then
    echo "ERROR: No release found for major version $major_version"
    continue
  fi

  echo "Latest release: $release_tag"
  
  # Get the asset ID for the release
  asset_id=$(echo "$release_info" | jq -r --arg tag "$release_tag" --arg arch "$arch" '.[] | select(.tag_name == $tag) | .assets[] | select(.name | test(".*_" + $arch)) | .id')

  if [ -z "$asset_id" ]; then
    echo "ERROR: Asset not found for release $release_tag"
    continue
  fi

  # Create a version-specific folder in heartsFolder
  version_folder="$HEARTS_FOLDER/$(echo $release_tag | sed 's/^v//')"
  mkdir -p "$version_folder"

  # Define the file path where the downloaded file will be saved
  file_path="$version_folder/$FILE"
  
  echo "Downloading file for $release_tag..."
  curl -sL -H 'Accept: application/octet-stream' "https://$GITHUB/repos/$REPO/releases/assets/$asset_id" > "$file_path"
  
  echo "Uncompressing..."
  if [ "$platform" = "windows-latest" ]; then
    unzip "$file_path" -d "$version_folder"
  else 
    tar -zxf "$file_path" -C "$version_folder"
  fi

  # Cleanup
  rm "$file_path"
  
  printf "Done for $release_tag!\n"

  # Save the release tag for later use
  versions[$i]=$release_tag
done

# Append version combinations to compatibility.feature
for ((i = 0; i < ${#versions[@]}; i++)); do
  for ((j = i + 1; j < ${#versions[@]}; j++)); do
    echo "      | \"${versions[$i]}\" | \"${versions[$j]}\" |" >> "$FEATURE_FILE"
  done
done

printf "All tasks completed. Compatibility combinations appended to $FEATURE_FILE.\n"
