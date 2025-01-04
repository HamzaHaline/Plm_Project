#!/bin/bash

ps -ef | grep plm | grep node | grep -v grep | awk '{print $2}' | sudo xargs kill -9
ps -ef | grep server.js | grep node | grep -v grep | awk '{print $2}' | sudo xargs kill -9
