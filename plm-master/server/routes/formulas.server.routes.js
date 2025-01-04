var formulas = require('../controllers/formulas.server.controller');

module.exports = function(app) {
    app.route('/formulas/user/:userId').post(formulas.create).get(formulas.list);
    app.route('/formulas/formula/:formulaId/user/:userId').get(formulas.read).put(formulas.update).delete(formulas.delete);
    //app.route('/formulas/bulkImport').post(formulas.bulkImportFormulas);
    app.route('/formulas/checkout/:action/formula/:formulaId/amount/:quantity/productionLine/:productionLineName/user/:userId').delete(formulas.checkout);
    app.route('/formulas/formulaNames/user/:userId').get(formulas.listNames);
    app.route('/formulas/formulaName/:formulaName/user/:userId').get(formulas.getFormulaByName);

};