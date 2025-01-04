#!/bin/bash
sudo npm install
sudo echo "Starting server..." && \
sudo nohup npm run start-https >/dev/null 2>&1 & 

