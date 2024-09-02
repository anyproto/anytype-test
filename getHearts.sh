#!/usr/bin/env bash
set -e

REPO="anyproto/anytype-heart"
GITHUB="api.github.com"
HEARTS_FOLDER="./heartsFolder"
NUM_VERSIONS=3 # Number of latest major versions to process
FILE="addon.tar.gz" # Default file name for non-Windows platforms
FEATURE_FILE_SYNC="./features/compatibilitySync.feature" # Output feature file
FEATURE_FILE_LOCAL="./features/compatibilityLocal.feature" # Output feature file

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
    echo "ERROR: Unknown platform $platform"
    exit 1
    ;;
esac

echo "Platform: $platform"
echo "Arch: $arch"
echo "Folder: $folder"
echo ""

if [ -z "$arch" ]; then
  echo "ERROR: arch not specified"
  exit 1
fi

# Rest of the script remains the same...
# Fetch the list of releases
release_info=$(curl -sL https://$GITHUB/repos/$REPO/releases?per_page=100)
# Extract and process the latest major versions
versions=($(echo "$release_info" | jq -r '.[] | .tag_name' | grep -Eo '^v[0-9]+\.[0-9]+' | sort -V | uniq | tail -n $NUM_VERSIONS))
# Process each version
for i in "${!versions[@]}"; do
 major_version="${versions[$i]}"
 echo "Processing latest release for major version $major_version..."
 # Find the latest two releases for this major version
 release_tags=($(echo "$release_info" | jq -r --arg version "$major_version" '.[] | select(.tag_name | startswith($version)) | .tag_name' | head -n 2))
 for release_tag in "${release_tags[@]}"; do
   echo "Trying release: $release_tag"
   # Get the asset ID for the release
   asset_id=$(echo "$release_info" | jq -r --arg tag "$release_tag" --arg arch "$arch" '.[] | select(.tag_name == $tag) | .assets[] | select(.name | test(".*_" + $arch)) | .id')
   if [ -z "$asset_id" ]; then
     echo "Asset not found for release $release_tag, trying next release..."
     continue
   fi
   # Create a version-specific folder in heartsFolder
   version_folder="$HEARTS_FOLDER/$(echo $release_tag | sed 's/^v//')"
   # Check if the folder already exists and is not empty
   if [ -d "$version_folder" ] && [ "$(ls -A $version_folder)" ]; then
     echo "Folder $version_folder already exists and is not empty. Skipping download."
     versions[$i]=$release_tag
     break
   fi
   mkdir -p "$version_folder"
   # Define the file path where the downloaded file will be saved
   file_path="$version_folder/$FILE"
   echo "Downloading file for $release_tag..."
   curl -sL -H 'Accept: application/octet-stream' "https://$GITHUB/repos/$REPO/releases/assets/$asset_id" > "$file_path"
   echo "Uncompressing..."
   if [[ "$platform" == windows* ]]; then
     unzip "$file_path" -d "$version_folder"
   else
     tar -zxf "$file_path" -C "$version_folder"
   fi
   # Cleanup
   rm "$file_path"
   printf "Done for $release_tag!\n"
   # Save the release tag for later use
   versions[$i]=$release_tag
   break
 done
 if [ -z "${versions[$i]}" ]; then
   echo "ERROR: No suitable release found for major version $major_version"
 fi
done
# Append version combinations to compatibility.feature
for ((i = 0; i < ${#versions[@]}; i++)); do
 for ((j = i + 1; j < ${#versions[@]}; j++)); do
   echo "      | \"${versions[$i]}\" | \"${versions[$j]}\" |" >> "$FEATURE_FILE_SYNC"
   echo "      | \"${versions[$i]}\" | \"${versions[$j]}\" |" >> "$FEATURE_FILE_LOCAL"
 done
done
printf "All tasks completed. Compatibility combinations appended to $FEATURE_FILE_SYNC and $FEATURE_FILE_LOCAL.\n"
