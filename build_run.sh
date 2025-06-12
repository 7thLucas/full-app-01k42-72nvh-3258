#!/bin/bash

bun install
bun run build
# Check if --local flag is passed
if [[ "$1" != "--local" ]]; then
    sudo mkdir -p /var/www/qb-poc-preview
    sudo rm -rf /var/www/qb-poc-preview/01JGXM8F9QR2N3P4K5T6V7W8X9
    sudo mv dist /var/www/qb-poc-preview/01JGXM8F9QR2N3P4K5T6V7W8X9
    sudo chown -R www-data:www-data /var/www/qb-poc-preview/
fi
