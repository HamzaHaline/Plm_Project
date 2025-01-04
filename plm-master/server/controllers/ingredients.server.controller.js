var Ingredient = require('mongoose').model('Ingredient');
var IngredientLot = require('mongoose').model('IngredientLot');
var IngredientProduct = require('mongoose').model('IngredientProduct');
var IngredientFreshness = require('mongoose').model('IngredientFreshness');
var Vendor = require('mongoose').model('Vendor');
var User = require('mongoose').model('User');
var Storage = require('mongoose').model('Storage');
var utils = require('../utils/utils');
var freshness = require('../utils/freshness');
var bulkImport = require('../utils/bulkImportIngredients');
var fs = require('fs');
var Converter = require("csvtojson").Converter;

exports.create = function(req, res, next) {
    utils.doWithAccess(req, res, next, Ingredient, 'create', req.params.userId, '', true, true);
};

exports.list = function(req, res, next) {
    utils.doWithAccess(req, res, next, Ingredient, 'list', req.params.userId, '', false, false);
};

exports.read = function(req, res, next) {
	utils.doWithAccess(req, res, next, Ingredient, 'read', req.params.userId, req.params.ingredientId, false, false);
};

exports.update = function(req, res, next) {
	utils.doWithAccess(req, res, next, Ingredient, 'update', req.params.userId, req.params.ingredientId, true, true);
};

exports.delete = function(req, res, next) {
    utils.doWithAccess(req, res, next, Ingredient, 'delete', req.params.userId, req.params.ingredientId, true, true);
};

exports.getOldestLot = function(req, res, next) {
    console.log("Getting oldest lot");
    IngredientLot.find({ingredientId: req.params.ingredientId}, {},
               {sort: {date: 1} },function(err, lots){
        if (err) return next(err);
        else if (lots.length == 0) res.send(lots);
        else {
            res.send(lots[0]);
        }
    });
};

exports.listLotNumbers = function(req, res, next) {
    console.log("Listing Lot Numbers");
    Ingredient.findById(req.params.ingredientId, function(err, ingredient){
        IngredientLot.find({ingredientNameUnique: ingredient.nameUnique}, function(err, items){
            res.json(items);
        });
    })

};

exports.listIngredientProductLotNumbers = function(req, res, next) {
    console.log("Listing Lot Numbers");
    Ingredient.findById(req.params.ingredientId, function(err, ingredient){
        IngredientProduct.find({ingredientNameUnique: ingredient.nameUnique}, function(err, items){
            res.json(items);
        });
    })

};

exports.getRecall = function(req, res, next) {

    IngredientProduct.find({lotId: req.params.lotId}, function(err, ingredients){
        if (err) return next(err);
        else res.json(ingredients);
    });
};

exports.getRecallAlternate = function(req, res, next) {
    const ingredientNameUnique =  req.params.ingredientName.toLowerCase();
    const lotNumberUnique = req.params.lotNumber.toLowerCase();
    const vendorNameUnique = req.params.vendorName!="null" ? req.params.vendorName.toLowerCase() : "";
    console.log("Received request to process alternative recall with the following parameters:\n" +
        "ingredientNameUnique: " + ingredientNameUnique + "\n" +
        "lotNumberUnique: " + lotNumberUnique + "\n" + 
        "vendorNameUnique: " + vendorNameUnique);
    IngredientProduct.find({ingredientNameUnique: ingredientNameUnique, lotNumberUnique: lotNumberUnique,
                            vendorNameUnique: vendorNameUnique}, function(err, ingredients){
        // console.log(req.params.ingredientName.toLowerCase()+' '+req.params.lotNumber.toLowerCase()+' '+req.params.vendorName.toLowerCase());
        console.log("Found the following in IngredientProduct:");
        console.log(ingredients);
        if (err) return next(err);
        else res.json(ingredients);
    });
};

exports.listIngredients = function(req, res, next){
    Ingredient.find({isIntermediate: false}, function(err, items){
        if (err) return next(err);
        else res.json(items);
    });
};

exports.listIntermediate = function(req, res, next){
    Ingredient.find({isIntermediate: true}, function(err, items){
        if (err) return next(err);
        else res.json(items);
    });
};

exports.listNames = function(req, res, next) {
    Ingredient.aggregate([
        { "$project": {
            "_id": 0,
            "ingredientName": "$name"
        }}
    ], function(err, ingredients){
        res.json(ingredients);
    })
}

exports.getFresh = function(req, res, next) {
    console.log("get fresh called");
    Ingredient.find({}, function(err, ingredients){
        getFreshHelper(req, res, next, 0, ingredients, function(){
            console.log('got it?');
            IngredientFreshness.find({}, function(err, fresh){
                //console.log(fresh);
                res.json(fresh);
            });
        });
    });
}

var getFreshHelper = function(req, res, next, i, ingredients, callback){
    console.log(i+' '+ingredients.length)
    if (i == ingredients.length){
        callback();
    } else {
        var ingredient = ingredients[i];
        var ingredientName = ingredient.name;
        freshness.getLatestInfo(res, next, ingredientName, function(){
            getFreshHelper(req, res, next, i+1, ingredients, callback);
        });
    }
}

exports.bulkImportIngredients = function(req, res, next, contents, callback) {
    bulkImport.bulkImportIngredients(req, res, next, contents, function() {
        //res.send(contents);
        callback();
    });
};

exports.editLot = function(req, res, next) {
    console.log('editLot called');
    User.findById(req.params.userId, function(err, user){
        if (err) return next(err);
        else if (!user || !user.isAdmin) return res.status(400).send('Access denied');
        else {
            var lotId = req.params.lotId;
            var quantity = req.params.quantity;
            IngredientLot.findById(lotId, function(err, lot){
                if (err) return next(err);
                else if (!lot) return res.status(400).send('Lot not found');
                else {
                    lot.update({numUnit: quantity}, function(err, obj){
                      res.json(lot);
                    })
                    // var oldNumUnit = lot.numUnit;
                    // var newNumUnit = quantity;
                    // var numUnitDiff = newNumUnit - oldNumUnit;
                    // Ingredient.findOne({nameUnique: lot.ingredientNameUnique}, function(err, ingredient){
                    //     if (numUnitDiff > 0) {
                    //         checkSpace(req, res, next, numUnitDiff, ingredient, lot, function(totalIncreasedSpace){
                    //             console.log('editLot: increased space '+totalIncreasedSpace);
                    //             updateSpaceIncrease(req, res, next, lot, newNumUnit, oldNumUnit, totalIncreasedSpace, ingredient);
                    //         });
                    //     } else {
                    //         checkSpace(req, res, next, -numUnitDiff, ingredient, lot, function(totalDecreasedSpace){
                    //             console.log('editLot: decreased space '+totalDecreasedSpace);
                    //             updateSpaceDecrease(req, res, next, lot, newNumUnit, oldNumUnit, totalDecreasedSpace, ingredient);
                    //         });
                    //     }
                    // });
                }
            });
        }
    });
};

var checkSpace = function(req, res, next, numUnitDiff, ingredient, lot, callback) {
    Ingredient.getPackageSpace(ingredient.packageName, function(spacePerPackage){
        var totalChangedSpace = Math.ceil(numUnitDiff/ingredient.numUnitPerPackage)*spacePerPackage;
        if (numUnitDiff > 0) {
            Storage.findOne({temperatureZone: ingredient.temperatureZone}, function(err, storage){
                if (storage.currentEmptySpace < totalChangedSpace) return res.status(400).send('Action denied on lot '+lot.lotNumber+'. Storage limit '+storage.currentEmptySpace+' exceeded');
                else callback(totalChangedSpace);
            });
        } else {
            callback(totalChangedSpace);
        }
    });
};

var updateSpaceIncrease = function(req, res, next, lot, newNumUnit, oldNumUnit, totalIncreasedSpace, ingredient) {
    var diff = newNumUnit - oldNumUnit;
    lot.update({numUnit: newNumUnit}, function(err, obj){
        if (err) return next(err);
        else {
            var oldTotalNumUnit = ingredient.numUnit;
            var newTotalNumUnit = oldTotalNumUnit + diff;
            var oldSpace = ingredient.space;
            var newSpace = oldSpace + totalIncreasedSpace;
            ingredient.update({space: newSpace, numUnit: newTotalNumUnit}, function(err, obj2){
                if (err) return next(err);
                else {
                    Storage.findOne({temperatureZone: ingredient.temperatureZone}, function(err, storage){
                        var currentOccupiedSpace = storage.currentOccupiedSpace;
                        var currentEmptySpace = storage.currentEmptySpace;
                        var newCurrentOccupiedSpace = currentOccupiedSpace + totalIncreasedSpace;
                        var newCurrentEmptySpace = currentEmptySpace - totalIncreasedSpace;
                        storage.update({currentOccupiedSpace: newCurrentOccupiedSpace, currentEmptySpace:newCurrentEmptySpace}, function(err, obj3){
                            if (err) return next(err);
                            else return res.json(lot);
                        })
                    });
                }
            });
        }
    });
};

var updateSpaceDecrease = function(req, res, next, lot, newNumUnit, oldNumUnit, totalDecreasedSpace, ingredient) {
    var diff = oldNumUnit - newNumUnit;
    lot.update({numUnit: newNumUnit}, function(err, obj){
        if (err) return next(err);
        else {
            var oldTotalNumUnit = ingredient.numUnit;
            var newTotalNumUnit = oldTotalNumUnit - diff;
            var oldSpace = ingredient.space;
            var newSpace = oldSpace - totalDecreasedSpace;
            ingredient.update({space: newSpace, numUnit: newTotalNumUnit}, function(err, obj2){
                if (err) return next(err);
                else {
                    Storage.findOne({temperatureZone: ingredient.temperatureZone}, function(err, storage){
                        var currentOccupiedSpace = storage.currentOccupiedSpace;
                        var currentEmptySpace = storage.currentEmptySpace;
                        var newCurrentOccupiedSpace = currentOccupiedSpace - totalDecreasedSpace;
                        var newCurrentEmptySpace = currentEmptySpace + totalDecreasedSpace;
                        storage.update({currentOccupiedSpace: newCurrentOccupiedSpace, currentEmptySpace:newCurrentEmptySpace}, function(err, obj3){
                            if (err) return next(err);
                            else return res.json(lot);
                        })
                    });
                }
            });
        }
    });
};
