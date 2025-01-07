# To get it running
cd plm-master

* run "npm install"

* run "npm start" to run the front-end

* If there is an error please install the packages required

Credentials : username :admin
              password :whatismongoose

## To install everything

* Softwares needed to be installed: Node.js, Express.js, MongoDB 

* To install Node.js: follow [these instructions](https://nodejs.org/en/download/package-manager/).

* To install MongoDB: follow [the instructions](https://nodejs.org/en/download/package-manager/) on the official website.

## To run the server

cd plm-master

* In the folder with server.js file, type "npm install --save"

* type "mongod" to run the MongoDB instance

* run "npm run start-dev" to run both ends at the same time. The front end will be listening on port 443 (default https port), and the back-end on port 1337

* run "npm start" to run just the front-end

* run "node server.js" to run just the back-end.

* Hint: to run locally, remove the .env file if it exists 
