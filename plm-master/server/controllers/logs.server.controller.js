var Log = require('mongoose').model('Log');
var utils = require('../utils/utils');

exports.list = function(req, res, next) {
	utils.doWithAccess(req, res, next, Log, 'list', req.params.userId, '', false, false);
};