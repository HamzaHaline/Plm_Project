var logs = require('../controllers/logs.server.controller');

module.exports = function(app) {
    app.route('/logs/user/:userId').get(logs.list);
};