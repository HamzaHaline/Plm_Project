var ingredientLots = require('../controllers/ingredientLots.server.controller');

module.exports = function(app) {
    // app.route('/ingredientLots').post(ingredientLots.create).get(ingredientLots.list);
    app.route('/ingredientLots/user/:userId').post(ingredientLots.create).get(ingredientLots.list);
    app.route('/ingredientLots/ingredientLot/:ingredientLotId/user/:userId').get(ingredientLots.read).put(ingredientLots.update).delete(ingredientLots.delete);
};