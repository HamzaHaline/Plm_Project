var Storage = require('mongoose').model('Storage');
var User = require('mongoose').model('User');
var utils = require('../utils/utils');

exports.create = function(req, res, next) {
    utils.doWithAccess(req, res, next, Storage, 'create', req.params.userId, '', true, true);
};

exports.list = function(req, res, next) {
	utils.doWithAccess(req, res, next, Storage, 'list', req.params.userId, '', false, false);
};

exports.read = function(req, res, next) {
	utils.doWithAccess(req, res, next, Storage, 'read', req.params.userId, req.params.storageId, false, false);
};

exports.update = function(req, res, next) {
	utils.doWithAccess(req, res, next, Storage, 'update', req.params.userId, req.params.storageId, true, true);
};

exports.delete = function(req, res, next) {
	utils.doWithAccess(req, res, next, Storage, 'delete', req.params.userId, req.params.storageId, true, true);
};