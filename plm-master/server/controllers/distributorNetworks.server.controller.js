var User = require('mongoose').model('User');
var DistributorNetwork = require('mongoose').model('DistributorNetwork');
var ProductFreshness = require('mongoose').model('ProductFreshness');
var Product = require('mongoose').model('Product');
var utils = require('../utils/utils');
var freshness = require('../utils/freshness');

exports.create = function(req, res, next) {
    utils.doWithAccess(req, res, next, DistributorNetwork, 'create', req.params.userId, '', true, true);
};

exports.list = function(req, res, next) {
    utils.doWithAccess(req, res, next, DistributorNetwork, 'list', req.params.userId, '', false, false);
};

exports.read = function(req, res, next) {
	utils.doWithAccess(req, res, next, DistributorNetwork, 'read', req.params.userId, req.params.distributorNetworkId, false, false);
};

exports.update = function(req, res, next) {
    utils.doWithAccess(req, res, next, DistributorNetwork, 'update', req.params.userId, req.params.distributorNetworkId, true, true);
};

exports.delete = function(req, res, next) {
	utils.doWithAccess(req, res, next, DistributorNetwork, 'delete', req.params.userId, req.params.distributorNetworkId, true, true);
};

exports.updateNetwork = function(req, res, next){
    var items = req.body;
    var date = new Date();
    console.log("selling items");
    console.log(items);
    updateNetworkHelper(res, next, date, 0, items, function(){
        res.json(items);
    });
};

var updateNetworkHelper = function(res, next, date, i, items, callback) {
    if (i == items.length) {
        callback();
    } else {
        var item = items[i];
        var productName = item.productName;
        var quantity = Number(item.quantity);
        var totalRevenue = Number(item.totalRevenue);
        console.log("selling item "+productName);
        console.log(item);
        DistributorNetwork.findOne({productNameUnique: productName.toLowerCase()}, function(err, dn){
            if (err) return next(err);
            else {
                lotPickerHelper(res, next, productName, quantity, function(){
                    console.log("quantity to sell = "+quantity);
                    console.log("quantity in total = "+dn.numUnit);
                    console.log("quantity sold = "+dn.numSold);
                    if (quantity + dn.numSold > dn.numUnit) return res.status(400).send('Action Denied. Quantity of product '+
                        productName+' in storage is '+(dn.numUnit - dn.numSold));
                    var newSoldUnit = dn.numSold + quantity;
                    var newTotalRevenue = dn.totalRevenue + totalRevenue;
                    console.log("newSoldUnit "+newSoldUnit+" newTotalRevenue "+newTotalRevenue);
                    dn.update({totalRevenue: newTotalRevenue, numSold:newSoldUnit}, function(err, obj){
                        if (newSoldUnit == dn.numUnit) {
                            //dn.remove(function(err){
                                ProductFreshness.findOne({productNameUnique: productName.toLowerCase()}, function(err, fresh){
                                    fresh.remove(function(err){
                                        updateNetworkHelper(res, next, date, i+1, items, callback);
                                    })
                                })
                            //})
                        } else {
//                            freshness.updateProductAverageDelete(res, next, date, dn, quantity, function(){
//                                freshness.updateProductOldestDelete(res, next, date, dn, quantity, function(){
                                    updateNetworkHelper(res, next, date, i+1, items, callback);
//                                })
//                            })
                        }
                    });
                });
            }
        });
    }
};

var lotPickerHelper = function(res, next, productName, quantity, callback) {  
    console.log(productName);
    Product.getOldestLot(res, productName.toLowerCase(), function(lot){
        if (quantity < lot.numUnitLeft) {
            var newNumUnit = lot.numUnitLeft - quantity;
            lot.update({numUnitLeft: newNumUnit}, function(err, obj){
                callback();
            });
        } else if (quantity == lot.numUnitLeft) {
            lot.update({numUnitLeft: 0, empty: true}, function(err){
                callback();
            });
        } else {
            lot.update({numUnitLeft: 0, empty: true}, function(err){
                lotPickerHelper(res, next, productName, quantity - lot.numUnitLeft, callback);
            });
        }
    });
};

exports.getFresh = function(req, res, next) {
    console.log("get product fresh called");
    DistributorNetwork.find({}, function(err, dns){
        getFreshHelper(req, res, next, 0, dns, function(){
            ProductFreshness.find({}, function(err, fresh){
                //console.log(fresh);
                res.json(fresh);
            });
        });
    });
}

var getFreshHelper = function(req, res, next, i, dns, callback){
    console.log(i+' '+dns.length)
    if (i == dns.length){
        callback();
    } else {
        var dn = dns[i];
        var productName = dn.productName;
        freshness.getProductLatestInfo(res, next, productName, function(){
            getFreshHelper(req, res, next, i+1, dns, callback);
        });
    }
}
