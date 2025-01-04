var config = require('./config'),
	mongoose = require('mongoose');

module.exports = function() {
	var db = mongoose.connect(config.db);

	require('../server/models/user.server.model');
	require('../server/models/vendor.server.model');
	require('../server/models/ingredient.server.model');
	require('../server/models/storage.server.model');
	require('../server/models/order.server.model');
	require('../server/models/formula.server.model');
	require('../server/models/log.server.model');
	require('../server/models/product.server.model');
    require('../server/models/ingredientLot.server.model');
    require('../server/models/ingredientProduct.server.model');
    require('../server/models/ingredientFreshness.server.model');
    require('../server/models/productFreshness.server.model');
    require('../server/models/productionLine.server.model');
    require('../server/models/distributorNetwork.server.model');

	return db;
};