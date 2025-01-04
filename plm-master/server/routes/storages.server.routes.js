var storages = require('../controllers/storages.server.controller');

module.exports = function(app) {
    app.route('/storages/user/:userId').post(storages.create).get(storages.list);
    app.route('/storages/storage/:storageId/user/:userId').get(storages.read).put(storages.update).delete(storages.delete);

};