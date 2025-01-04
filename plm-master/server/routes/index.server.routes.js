//router used by the template
module.exports = function(app) {
    var index = require('../controllers/index.server.controller');
    app.get('/testing', index.render);
};