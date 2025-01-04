var productionLines = require('../controllers/productionLines.server.controller');

module.exports = function(app) {
    // app.route('/products').post(products.create).get(products.list);
    app.route('/productionLines/user/:userId').post(productionLines.create).get(productionLines.list);
    app.route('/productionLines/productionLine/:productionLineId/user/:userId').get(productionLines.read).put(productionLines.update).delete(productionLines.delete);
    app.route('/productionLines/productionLineName/:productionLineName/user/:userId').get(productionLines.getProductionLineByName);

    app.route('/productionLines/markComplete/productionLine/:productionLineId/user/:userId').put(productionLines.markComplete);
    app.route('/productionLines/getEfficiencies/st/:startTime/et/:endTime/user/:userId').get(productionLines.getEfficiencies);
};