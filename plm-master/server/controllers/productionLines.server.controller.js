var User = require('mongoose').model('User');
var ProductionLine = require('mongoose').model('ProductionLine');
var utils = require('../utils/utils');
var checkoutProcessor = require('../utils/checkoutProcessor');

exports.create = function(req, res, next) {
    utils.doWithAccess(req, res, next, ProductionLine, 'create', req.params.userId, '', true, true);
};

exports.list = function(req, res, next) {
    utils.doWithAccess(req, res, next, ProductionLine, 'list', req.params.userId, '', false, false);
};

exports.read = function(req, res, next) {
	utils.doWithAccess(req, res, next, ProductionLine, 'read', req.params.userId, req.params.productionLineId, false, false);
};

exports.update = function(req, res, next) {
    utils.doWithAccess(req, res, next, ProductionLine, 'update', req.params.userId, req.params.productionLineId, false, true);
};

exports.delete = function(req, res, next) {
	utils.doWithAccess(req, res, next, ProductionLine, 'delete', req.params.userId, req.params.productionLineId, true, true);
};

exports.markComplete = function(req, res, next) {
    checkoutProcessor.markComplete(req, res, next);
}

exports.getEfficiencies = function(req, res, next) {
    var startTime = req.params.startTime;
    var endTime = req.params.endTime;
    var retArr = [];
    ProductionLine.find({}, function(err, pls){
        getEfficienciesHelper(req, res, next, 0, pls, [], startTime, endTime, function(retArr){
            res.json(retArr);
        })
    });
}

var getEfficienciesHelper = function(req, res, next, i, pls, retArr, startTime, endTime, callback) {
    if (i == pls.length) {
        callback(retArr);
    } else {
        var pl = pls[i];
        var effObj = new Object();
        effObj.productionLineName = pl.name;
        pl.getUtility(startTime, endTime, function(eff){
            effObj.efficiency = eff;
            retArr.push(effObj);
            getEfficienciesHelper(req, res, next, i+1, pls, retArr, startTime, endTime, callback);
        });
    }
}

exports.getAllIdleServers = function(req, res, next) {
    ProductionLine.find({isIdle: true}, function(err, idles){
        if (err) return next(err);
        else return res.json(idles);
    });
}

exports.getProductionLineByName = function(req, res, next) {
    ProductionLine.findOne({nameUnique: req.params.productionLineName.toLowerCase()}, function(err, pl){
        if (err) return next(err);
        else return res.json(pl);
    });
}
