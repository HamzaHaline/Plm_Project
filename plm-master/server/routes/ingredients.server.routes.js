var ingredients = require('../controllers/ingredients.server.controller');

module.exports = function(app) {
    app.route('/ingredients/user/:userId').post(ingredients.create).get(ingredients.list);
    app.route('/ingredients/ingredient/:ingredientId/user/:userId').get(ingredients.read).put(ingredients.update).delete(ingredients.delete);
    //app.route('/ingredients/bulkImport').post(ingredients.bulkImportIngredients);
    app.route('/ingredients/ingredientNames/user/:userId').get(ingredients.listNames);
    app.route('/ingredients/allIngredients/user/:userId').get(ingredients.listIngredients);
    app.route('/ingredients/allIntermediates/user/:userId').get(ingredients.listIntermediate);
    app.route('/ingredients/allLotNumbers/ingredient/:ingredientId/user/:userId').get(ingredients.listLotNumbers);
    app.route('/ingredients/listIngredientProductLotNumbers/ingredient/:ingredientId/user/:userId').get(ingredients.listIngredientProductLotNumbers);
    app.route('/ingredients/oldestLot/ingredient/:ingredientId/user/:userId').get(ingredients.getOldestLot);
    app.route('/ingredients/recall/lot/:lotId/user/:userId').get(ingredients.getRecall);
    app.route('/ingredients/recall/lot/:lotNumber/ingredient/:ingredientName/vendor/:vendorName/user/:userId').get(ingredients.getRecallAlternate);
    app.route('/ingredients/fresh/user/:userId').get(ingredients.getFresh);
    app.route('/ingredients/lot/:lotId/quantity/:quantity/user/:userId').put(ingredients.editLot);

};