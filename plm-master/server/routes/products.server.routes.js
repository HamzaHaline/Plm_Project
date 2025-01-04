var products = require('../controllers/products.server.controller');

module.exports = function(app) {
    // app.route('/products').post(products.create).get(products.list);
    app.route('/products/user/:userId').post(products.create).get(products.list);
    app.route('/products/product/:productId/user/:userId').get(products.read).put(products.update).delete(products.delete);
};