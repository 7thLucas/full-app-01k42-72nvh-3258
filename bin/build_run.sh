#!/bin/bash

# Ensure script is running from the project root (parent of bin)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT" || exit 1

bun install
bun run build

# Check if --local flag is passed
if [[ "$1" != "--local" ]]; then
    sudo mkdir -p /var/www/qb-poc-preview
    sudo rm -rf /var/www/qb-poc-preview/fullapp
    sudo mv dist /var/www/qb-poc-preview/fullapp
    sudo chown -R www-data:www-data /var/www/qb-poc-preview/
fi
