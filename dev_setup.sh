#!/bin/bash

# Change modifier
chmod +x build_run.sh

# Generate a new UUID
NEW_UUID=$(uuidgen)

# Create .env file with the UUID
echo "VITE_BASE_PATH=${NEW_UUID}" > .env

# Write UUID to qbid.txt
echo "${NEW_UUID}" > qbid.txt

# Find and replace all occurrences of "####VAR:FOLDER_ID####" with the generated UUID
find . -type f -name "*.ts" -o -name "build_run.sh" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.md" -o -name "*.html" -o -name "*.css" | xargs sed -i "s/####VAR:FOLDER_ID####/${NEW_UUID}/g"

echo "Setup complete! Generated UUID: ${NEW_UUID}"
