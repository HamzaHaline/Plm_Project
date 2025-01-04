# Real Producers

## Deployment Guide

* see DEPLOYMENT_GUIDE.md

## Developer Guide

* see https://docs.google.com/document/d/1RgTQ27bdRb8LPWwH0axzr8eZSquyOJQLRVT44cJuwJ8/edit?usp=sharing

## To get it running

* run "npm install"

* run "npm start" to run the front-end

## Introduction

Real Producers is a Production Lifecycle Manager tool currently under development. It manages all the relevant data on food import from vendors and outport to production. 

## To install everything

* Softwares needed to be installed: Node.js, Express.js, MongoDB 

* To install Node.js: follow [these instructions](https://nodejs.org/en/download/package-manager/).

* To install MongoDB: follow [the instructions](https://nodejs.org/en/download/package-manager/) on the official website.

## To run the server

* In the folder with server.js file, type "npm install --save"

* type "mongod" to run the MongoDB instance

* run "npm run start-dev" to run both ends at the same time. The front end will be listening on port 443 (default https port), and the back-end on port 1337

* run "npm start" to run just the front-end

* run "node server.js" to run just the back-end.

* Hint: to run locally, remove the .env file if it exists 

## Testing
* Testing variables are configured in `src/resources/testConfig.js`. Many front-end component imports the file for now.

## To deploy on Servers

__ Note: Mongodb is already running on servers as a service. This means you do not need to run mongodb separately when you want to start the server__

### Test Server

* On the test server shell, go to ~/../plm by running `cd ~/../pcm`, then run `sudo npm run start-https`. To view the content, go to https://real-producers-test.colab.duke.edu in your browser

### Production server

* The production server is kept running by the following command `sudo nohup npm run start-https >/dev/null 2>&1 &`. This prevents the process from hanging up after the user who typed this command logs out from the ssh session.

* To update content in the production server, do `cd pcm`, then simply run `git pull`. To view the content, go to https://real-producers.colab.duke.edu in your browser

### To use https on servers:

* run `sudo npm run start-https`. This will start the web view on port 443, which is the default https port. 

### Troubleshooting

* If you see permission denied when trying to run commands in the plm directory, run "sudo chmod -R 777 ." inside the directory and the problem should go away


* If you cannot connect to the remote server in the browser, open the .env file (if it is not already there, create one) and have the following line: `HOST=real-producers.colab.duke.edu (for production server)` or `HOST=real-producers-test.colab.duke.edu` (for test server). On the contrary, if you are trying to run the server locally and access it via localhost, then remove the .env file if there is one.

## Design rules
* Every url that is passed as argument should not end with '/'
