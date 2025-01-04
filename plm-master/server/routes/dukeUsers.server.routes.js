// dukeUsers.server.routes.js

var dukeUsers = require('../controllers/dukeUsers.server.controller'),
	passport = require('passport');

module.exports = function(app) {

	app.route('/duke-users-bypass').post(dukeUsers.loggingInViaOAuth);//.get(users.list);

	//not modified yet
	/*
	app.route('/users/searchedUser/:searchedUserId/user/:userId').get(users.read).put(users.update).delete(users.delete);

    app.route('/users/authenticate').post(users.authenticate);

	app.route('/register')
		.get(users.renderRegister)
		.post(users.register);

	app.get('/logout', users.logout);*/
};