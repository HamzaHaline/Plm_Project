var User = require('mongoose').model('User');
var IngredientLot = require('mongoose').model('IngredientLot');
var utils = require('../utils/utils');

exports.create = function(req, res, next) {
    utils.doWithAccess(req, res, next, IngredientLot, 'create', req.params.userId, '', true, true);
};

exports.list = function(req, res, next) {
    utils.doWithAccess(req, res, next, IngredientLot, 'list', req.params.userId, '', false, false);
};

exports.read = function(req, res, next) {
	utils.doWithAccess(req, res, next, IngredientLot, 'read', req.params.userId, req.params.ingredientLotId, false, false);
};

exports.update = function(req, res, next) {
    utils.doWithAccess(req, res, next, IngredientLot, 'update', req.params.userId, req.params.ingredientLotId, true, true);
};

exports.delete = function(req, res, next) {
	utils.doWithAccess(req, res, next, IngredientLot, 'delete', req.params.userId, req.params.ingredientLotId, true, true);
};
