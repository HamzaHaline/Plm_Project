var config = require('./config'),
	express = require('express'),
	bodyParser = require('body-parser'),
	passport = require('passport'),
	flash = require('connect-flash'),
	session = require('express-session'),
	multer = require('multer');

module.exports = function() {
	var app = express();

	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(multer({
    	dest: "./uploads/"
	}).any());
	app.use(bodyParser.json());

	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: 'OurSuperSecretCookieSecret'
	}));
//
//    var engine = ReactEngine.server.create();
//    app.engine('.js', engine);

    app.set('views', './server/views');
    app.set('view engine', 'ejs');

	app.use(flash());
	app.use(passport.initialize());
	app.use(passport.session());

	require('../server/routes/index.server.routes.js')(app);
	require('../server/routes/users.server.routes.js')(app);
	require('../server/routes/vendors.server.routes.js')(app);
	require('../server/routes/ingredients.server.routes.js')(app);
	require('../server/routes/storages.server.routes.js')(app);
	require('../server/routes/orders.server.routes.js')(app);
	require('../server/routes/uploads.server.routes.js')(app);
	require('../server/routes/dukeUsers.server.routes.js')(app);
	require('../server/routes/logs.server.routes.js')(app);
	require('../server/routes/formulas.server.routes.js')(app);
	require('../server/routes/products.server.routes.js')(app);
	require('../server/routes/ingredientLots.server.routes.js')(app);
	require('../server/routes/productionLines.server.routes.js')(app);
	require('../server/routes/distributorNetworks.server.routes.js')(app);
	app.use(express.static('./public'));

	return app;
};