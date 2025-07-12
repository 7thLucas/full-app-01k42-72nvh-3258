#!/bin/bash

bun install
bun run build
# Check if --local flag is passed
if [[ "$1" != "--local" ]]; then
    sudo mkdir -p /var/www/qb-poc-preview
    sudo rm -rf /var/www/qb-poc-preview/homepage
    sudo mv dist /var/www/qb-poc-preview/homepage
    sudo chown -R www-data:www-data /var/www/qb-poc-preview/
fi
