var vendors = require('../controllers/vendors.server.controller');
var utils = require('../utils/utils');

module.exports = function(app) {
    app.route('/vendors/user/:userId').post(vendors.create);
    app.route('/vendors/user/:userId').get(vendors.list);
    app.route('/vendors/vendor/:vendorId/user/:userId').put(vendors.update).get(vendors.read).delete(vendors.delete);
    app.route('/vendors/vendorNames/user/:userId').get(vendors.listNames);
};