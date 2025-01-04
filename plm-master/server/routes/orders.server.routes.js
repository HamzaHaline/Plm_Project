var orders = require('../controllers/orders.server.controller');

module.exports = function(app) {
    // app.route('/orders').post(orders.create).get(orders.list);
    app.route('/orders/user/:userId').post(orders.create).get(orders.listPartial);
    app.route('/orders/order/:orderId/user/:userId').get(orders.read).put(orders.update).delete(orders.delete);
    app.route('/orders/checkout/user/:userId').delete(orders.checkout);

    app.route('/orders/pendingsOnly/user/:userId').get(orders.getPendingsOnly);
    app.route('/orders/rawOnly/user/:userId').get(orders.getRawOnly);
    app.route('/orders/checkoutOneOrder/user/:userId').post(orders.cargoArrived);
};