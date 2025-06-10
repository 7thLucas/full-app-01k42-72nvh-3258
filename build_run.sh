#!/bin/bash

bun install
bun run build
sudo mkdir -p /var/www/qb-poc-preview
sudo rm -rf /var/www/qb-poc-preview/####VAR:FOLDER_ID####
sudo mv dist /var/www/qb-poc-preview/####VAR:FOLDER_ID####
sudo chown -R www-data:www-data /var/www/qb-poc-preview/
