var users = require('../controllers/users.server.controller'),
	passport = require('passport');

module.exports = function(app) {
	app.route('/users/user/:userId').post(users.create).get(users.list);

	app.route('/users/searchedUser/:searchedUserId/user/:userId').get(users.read).put(users.update).delete(users.delete);

    app.route('/users/authenticate').post(users.authenticate);

	app.route('/register')
		.get(users.renderRegister)
		.post(users.register);

//	app.route('/login')
//		.get(users.renderLogin)
//		.post(passport.authenticate('local', {
//			successRedirect: '/',
//			failureRedirect: '/login',
//			failureFlash: true
//		}));

	app.get('/logout', users.logout);
//
//	app.get('/oauth/facebook', passport.authenticate('facebook', {
//		failureRedirect: '/login',
//		scope:['email']
//	}));
//
//	app.get('/oauth/facebook/callback', passport.authenticate('facebook', {
//		failureRedirect: '/login',
//		successRedirect: '/',
//		scope:['email']
//	}));
//
//	app.get('/oauth/twitter', passport.authenticate('twitter', {
//		failureRedirect: '/login'
//	}));
//
//	app.get('/oauth/twitter/callback', passport.authenticate('twitter', {
//		failureRedirect: '/login',
//		successRedirect: '/'
//	}));
};