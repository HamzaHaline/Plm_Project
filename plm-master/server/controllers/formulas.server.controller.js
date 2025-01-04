var Ingredient = require('mongoose').model('Ingredient');
var Vendor = require('mongoose').model('Vendor');
var User = require('mongoose').model('User');
var Formula = require('mongoose').model('Formula');
var utils = require('../utils/utils');
var fs = require('fs');
var Converter = require("csvtojson").Converter;
var converter = new Converter({});
var bulkImport = require('../utils/bulkImportFormulas');
var bulkImportInter = require('../utils/bulkImportIntermediate');

exports.create = function(req, res, next) {
    utils.doWithAccess(req, res, next, Formula, 'create', req.params.userId, '', true, true);
};

exports.list = function(req, res, next) {
    utils.doWithAccess(req, res, next, Formula, 'list', req.params.userId, '', false, false);
};

exports.read = function(req, res, next) {
	utils.doWithAccess(req, res, next, Formula, 'read', req.params.userId, req.params.formulaId, false, false);
};

exports.update = function(req, res, next) {
	utils.doWithAccess(req, res, next, Formula, 'update', req.params.userId, req.params.formulaId, false, true);
};

exports.delete = function(req, res, next) {
    console.log('3.23 '+req.params.formulaId);
    utils.doWithAccess(req, res, next, Formula, 'delete', req.params.userId, req.params.formulaId, true, true);
};

exports.checkout = function(req, res, next) {
    utils.doWithAccess(req, res, next, Formula, 'checkoutFormula', req.params.userId, req.params.formulaId, false, true); //
};

exports.listNames = function(req, res, next) {
    Formula.aggregate([
        { "$project": {
            "_id": 0,
            "formulaName": "$name"
        }}
    ], function(err, formulas){
        res.json(formulas);
    })
}

exports.bulkImportFormulas = function(req, res, next, contents, callback) {
    bulkImport.bulkImportFormulas(req, res, next, contents, function() {
        //res.send(contents);
        callback();
    });
};

exports.bulkImportIntermediate = function(req, res, next, contents, callback) {
    bulkImportInter.bulkImportIntermediates(req, res, next, contents, function() {
        //res.send(contents);
        callback();
    });
};

exports.getFormulaByName = function(req, res, next) {
    Formula.findOne({nameUnique: req.params.formulaName.toLowerCase()}, function(err, formula){
        if (err) return next(err);
        else return res.json(formula);
    });
}