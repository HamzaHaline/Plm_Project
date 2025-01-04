var User = require('mongoose').model('User');
var Vendor = require('mongoose').model('Vendor');
var utils = require('../utils/utils');

exports.create = function(req, res, next) {
    utils.doWithAccess(req, res, next, Vendor, 'create', req.params.userId, '', true, true);
};

exports.list = function(req, res, next) {
    utils.doWithAccess(req, res, next, Vendor, 'list', req.params.userId, '', false, false);
};

exports.read = function(req, res, next) {
	utils.doWithAccess(req, res, next, Vendor, 'read', req.params.userId, req.params.vendorId, false, false);
};

exports.update = function(req, res, next) {
    utils.doWithAccess(req, res, next, Vendor, 'update', req.params.userId, req.params.vendorId, true, true);
};

exports.delete = function(req, res, next) {
	utils.doWithAccess(req, res, next, Vendor, 'delete', req.params.userId, req.params.vendorId, true, true);
};

exports.listNames = function(req, res, next) {
    Vendor.aggregate([
        { "$project": {
            "_id": 0,
            "vendorName": "$name"
        }}
    ], function(err, vendors){
        res.json(vendors);
    });
}