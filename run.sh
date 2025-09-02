#!/bin/bash
cd /home/nathanael/quantumbytes-ai-codegen/repos/full-app-01k42-72nvh-3258
echo 'Starting goose run full-app-01k42-72nvh-3258'
goose run -i instruction.txt -n full-app-01k42-72nvh-3258
echo 'Goose run completed full-app-01k42-72nvh-3258'
touch /home/nathanael/quantumbytes-ai-codegen/repos/full-app-01k42-72nvh-3258/done.txt
