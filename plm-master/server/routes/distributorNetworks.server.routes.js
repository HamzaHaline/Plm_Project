var distributorNetworks = require('../controllers/distributorNetworks.server.controller');

module.exports = function(app) {
    // app.route('/products').post(products.create).get(products.list);
    app.route('/distributorNetworks/user/:userId').post(distributorNetworks.create).get(distributorNetworks.list);
    app.route('/distributorNetworks/distributorNetwork/:distributorNetworkId/user/:userId').get(distributorNetworks.read).put(distributorNetworks.update).delete(distributorNetworks.delete);

    app.route('/distributorNetworks/sell/user/:userId').put(distributorNetworks.updateNetwork);
    app.route('/distributorNetworks/fresh/user/:userId').get(distributorNetworks.getFresh);
};