#!/bin/bash

# Change modifier
chmod +x build_run.sh

# Parse command line arguments
NEW_UUID=""
for arg in "$@"; do
    case $arg in
        --id=*)
            NEW_UUID="${arg#*=}"
            shift
            ;;
    esac
done

# Generate a new UUID if not provided
if [ -z "$NEW_UUID" ]; then
    NEW_UUID=$(uuidgen)
fi

# Create .env file with the UUID
echo "VITE_BASE_PATH=/${NEW_UUID}" > .env

# Write UUID to qbid.txt
echo "${NEW_UUID}" > qbid.txt

# Find and replace all occurrences of "####VAR:FOLDER_ID####" with the generated UUID
find . -type f -name "*.ts" -o -name "build_run.sh" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.md" -o -name "*.html" -o -name "*.css" | xargs sed -i "s/####VAR:FOLDER_ID####/${NEW_UUID}/g"

echo "Setup complete! Generated UUID: ${NEW_UUID}"
