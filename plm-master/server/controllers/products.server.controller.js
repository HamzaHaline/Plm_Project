var User = require('mongoose').model('User');
var Product = require('mongoose').model('Product');
var utils = require('../utils/utils');

exports.create = function(req, res, next) {
    utils.doWithAccess(req, res, next, Product, 'create', req.params.userId, '', true, true);
};

exports.list = function(req, res, next) {
    utils.doWithAccess(req, res, next, Product, 'list', req.params.userId, '', false, false);
};

exports.read = function(req, res, next) {
	utils.doWithAccess(req, res, next, Product, 'read', req.params.userId, req.params.productId, false, false);
};

exports.update = function(req, res, next) {
    utils.doWithAccess(req, res, next, Product, 'update', req.params.userId, req.params.productId, true, true);
};

exports.delete = function(req, res, next) {
	utils.doWithAccess(req, res, next, Product, 'delete', req.params.userId, req.params.productId, true, true);
};
