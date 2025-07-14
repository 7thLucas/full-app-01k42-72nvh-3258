#!/bin/bash

# Change modifier
chmod +x build_run.sh

# Parse command line arguments
NEW_UUID=""
USER_ID=""
KEYSPACE=""
ROLE=""

for arg in "$@"; do
    case $arg in
        --id=*)
            NEW_UUID="${arg#*=}"
            shift
            ;;
        --userId=*)
            USER_ID="${arg#*=}"
            shift
            ;;
        --keyspace=*)
            KEYSPACE="${arg#*=}"
            shift
            ;;
        --role=*)
            ROLE="${arg#*=}"
            shift
            ;;
    esac
done

# Validate required parameters
if [ -z "$USER_ID" ] || [ -z "$KEYSPACE" ] || [ -z "$ROLE" ]; then
    echo "Error: Missing required parameters!"
    echo "Usage: $0 --userId=<user_id> --keyspace=<keyspace> --role=<role> [--id=<uuid>]"
    echo ""
    echo "Required parameters:"
    echo "  --userId=<user_id>     User identifier"
    echo "  --keyspace=<keyspace>  Keyspace name"
    echo "  --role=<role>          User role"
    echo ""
    echo "Optional parameters:"
    echo "  --id=<uuid>            Custom UUID (if not provided, one will be generated)"
    exit 1
fi

# Generate a new UUID if not provided
if [ -z "$NEW_UUID" ]; then
    NEW_UUID=$(uuidgen)
fi

# Create .env file with the UUID only if it doesn't exist
if [ ! -f ".env" ]; then
    echo "VITE_BASE_PATH=/${NEW_UUID}" > .env
fi

# Write UUID to qbid.txt
echo "${NEW_UUID}" > qbid.txt

# Find and replace all occurrences of "####VAR:FOLDER_ID####" with the generated UUID
# if os is mac, use sed -i ""
if [[ "$OSTYPE" == "darwin"* ]]; then
    find . -type f \( -name "*.ts" -o -name "*build_run.sh" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.md" -o -name "*.html" -o -name "*.css" \) -not -path "./node_modules/*" | xargs sed -i "" "s/####VAR:FOLDER_ID####/${NEW_UUID}/g"
else
    find . -type f \( -name "*.ts" -o -name "*build_run.sh" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.md" -o -name "*.html" -o -name "*.css" \) -not -path "./node_modules/*" | xargs sed -i "s/####VAR:FOLDER_ID####/${NEW_UUID}/g"
fi

# Find and replace all occurrences of "####VAR:KEYSPACE####" with the keyspace
# if os is mac, use sed -i ""
if [[ "$OSTYPE" == "darwin"* ]]; then
    find . -type f \( -name "*.ts" -o -name "config.ts" \) -not -path "./node_modules/*" | xargs sed -i "" "s/####VAR:KEYSPACE####/${KEYSPACE}/g"
else
    find . -type f \( -name "*.ts" -o -name "config.ts" \) -not -path "./node_modules/*" | xargs sed -i "s/####VAR:KEYSPACE####/${KEYSPACE}/g"
fi

# Find and replace all occurrences of "####VAR:ROLE####" with the role
# if os is mac, use sed -i ""
if [[ "$OSTYPE" == "darwin"* ]]; then
    find . -type f \( -name "*.ts" -o -name "config.ts" \) -not -path "./node_modules/*" | xargs sed -i "" "s/####VAR:ROLE####/${ROLE}/g"
else
    find . -type f \( -name "*.ts" -o -name "config.ts" \) -not -path "./node_modules/*" | xargs sed -i "s/####VAR:ROLE####/${ROLE}/g"
fi

# Find and replace all occurrences of "####VAR:USER_ID####" with the user id
# if os is mac, use sed -i ""
if [[ "$OSTYPE" == "darwin"* ]]; then
    find . -type f \( -name "*.ts" -o -name "config.ts" \) -not -path "./node_modules/*" | xargs sed -i "" "s/####VAR:USER_ID####/${USER_ID}/g"
else
    find . -type f \( -name "*.ts" -o -name "config.ts" \) -not -path "./node_modules/*" | xargs sed -i "s/####VAR:USER_ID####/${USER_ID}/g"
fi

echo "Setup complete!"
echo "Generated UUID: ${NEW_UUID}"
echo "User ID: ${USER_ID}"
echo "Keyspace: ${KEYSPACE}"
echo "Role: ${ROLE}"
