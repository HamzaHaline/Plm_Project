'use strict';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./config/config'),
	mongoose = require('./config/mongoose'),
	express = require('./config/express'),
	passport = require('./config/passport');

var db = mongoose(),
	app = express(),
	passport = passport();

var multer = require('multer');

//app.use(function(req, res, next) {
// res.setHeader('Access-Control-Allow-Origin', '*');
// res.setHeader('Access-Control-Allow-Credentials', 'true');
// res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
// res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
// res.setHeader('Cache-Control', 'no-cache');
// next();
//});
var User = require('mongoose').model('User');
var Storage = require('mongoose').model('Storage');
User.findOne({username: 'admin'}, function(err, obj){
    if (!obj) {
        var admin = new User();
        admin.username = 'admin';
        admin.password = 'whatismongoose';
        admin.email = 'admin@realproducers.net';
        admin.isAdmin = true;
        admin.isManager = true;
        admin.loggedIn = false;
        admin.fromDukeOAuth = false;
        admin.save(function(err){
            //console.log(admin);
        });
    }
});

Storage.findOne({temperatureZone: 'freezer'}, function(err, obj){
    if (!obj) {
        var storage = new Storage();
        storage.temperatureZone = 'freezer';
        storage.capacity = 20000;
        storage.currentEmptySpace = 20000;
        storage.currentOccupiedSpace = 0;
        storage.save(function(err){
            //console.log(admin);
        });
    }
});

Storage.findOne({temperatureZone: 'refrigerator'}, function(err, obj){
    if (!obj) {
        var storage = new Storage();
        storage.temperatureZone = 'refrigerator';
        storage.capacity = 20000;
        storage.currentEmptySpace = 20000;
        storage.currentOccupiedSpace = 0;
        storage.save(function(err){
            //console.log(admin);
        });
    }
});

Storage.findOne({temperatureZone: 'warehouse'}, function(err, obj){
    if (!obj) {
        var storage = new Storage();
        storage.temperatureZone = 'warehouse';
        storage.capacity = 20000;
        storage.currentEmptySpace = 20000;
        storage.currentOccupiedSpace = 0;
        storage.save(function(err){
            //console.log(admin);
        });
    }
});

 var fs = require('fs'),
    https = require('https'),
    http = require('http');

//for certificate
/*
const PROD = true;
const lex = require('greenlock-express').create({
  server: PROD ? 'https://acme-v01.api.letsencrypt.org/directory' : 'staging',
  challenges: { 'http-01': require('le-challenge-fs').create({ webrootPath: '/tmp/acme-challenges' }) },
  store: require('le-store-certbot').create({ webrootPath: '/tmp/acme-challenges' }), 
  approveDomains: ['real-producers.colab.duke.edu', 'vcm-3107.vm.duke.edu']/*(opts, certs, cb) => {
    if (certs) {
      // change domain list here
      opts.domains = ['real-producers.colab.duke.edu', 'vcm-3107.vm.duke.edu']
    } else { 
      // change default email to accept agreement
      opts.email = 'ds318@duke.edu'; 
      opts.agreeTos = true;
    }
    cb(null, { options: opts, certs: certs });
  }*//*
});
const middlewareWrapper = lex.middleware;

const redirectHttps = require('redirect-https');
http.createServer(lex.middleware(redirectHttps())).listen(80);

https.createServer(
  lex.httpsOptions, 
  middlewareWrapper(app)
).listen(433);

*/

    //http.createServer(function(req, res) {   
      //  res.writeHead(301, {"Location": "https://" + req.headers['host'] + req.url});
        //res.end();
    //}).listen(80);


    https.createServer({
      key: fs.readFileSync('./domain.key'),
      cert: fs.readFileSync('./chained.pem')
    }, app).listen(config.port);

//app.use(function (err, req, res, next) {
    //  console.error(err.stack);
    //  res.status(901).send('Admin required');
//})

    //reroute http to https
    // set up plain http server
    var http = require('http');
    http.createServer(function(req, res) {   
        res.writeHead(301, {"Location": "https://" + req.headers['host'] + req.url});
        res.end();
    }).listen(80);


// app.listen(config.port);

module.exports = app;
console.log(process.env.NODE_ENV + ' Back-end running at https://localhost:' + config.port);
