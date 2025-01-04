// dukeUsers.server.controller.js
// var DukeUser = require('mongoose').model('DukeUser');
var User = require('mongoose').model('User');
var	passport = require('passport');
var utils = require('../utils/utils');


exports.loggingInViaOAuth = function(req, res, next) {	
    console.log("Entered loggingInViaOAuth() inside dukeUsers.server.controller.js");

	User.findOne( 
        {
            username: req.body.username,
            fromDukeOAuth: true,
        }, 
        function(err, user){
            console.log(req.body);
            if (err) return next(err);
            else if (!user) {
            // res.status(400);
            // res.send("Username does not exist");
            utils.bypassAndDo(req, res, next, User, 'create', null);
            }
            else {

        	   user.update(
                    {
                        loggedIn: true,
        				email: req.body.email
                    }, 
                    function(err, obj){
                        console.log("***************");
                        console.log(user);
        				res.json(user);
        	        }
                )
            }
        }
    );
	
};