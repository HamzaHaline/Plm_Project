var mongoose = require('mongoose'),
    Ingredient = require('mongoose').model('Ingredient'),
    IngredientLot = require('mongoose').model('IngredientLot'),
    IngredientProduct = require('mongoose').model('IngredientProduct'),
    IngredientFreshness = require('mongoose').model('IngredientFreshness'),
    Product = require('mongoose').model('Product'),
    ProductFreshness = require('mongoose').model('ProductFreshness'),
    DistributorNetwork = require('mongoose').model('DistributorNetwork'),
	Schema = mongoose.Schema;

//exports.updateAverageAdd = function(res, next, ingredientName, date, numUnit, callback) {
//    Ingredient.findOne({nameUnique: ingredientName.toLowerCase()}, function(err, ingredient){
//        if (err) return next(err);
//        else if (!ingredient) return res.status(400).send('Ingredient '+ingredientName+' does not exist. 007');
//        else {
//            var oldNumUnit = ingredient.numUnit;
//            IngredientFreshness.findOne({ingredientNameUnique: ingredientName.toLowerCase()}, function(err, fresh){
//
//                if (err) return next(err);
//                else if (fresh) {
//                    console.log('freshness already exists');
//                    var averageMilli = fresh.averageMilli;
//                    console.log('average '+averageMilli);
//                    var newAverageMilli = Math.floor((Number(averageMilli)*Number(oldNumUnit) + date.getTime()*Number(numUnit)) / (Number(oldNumUnit) + Number(numUnit)));
//                    console.log('now date '+date.getTime());
//                    console.log('old num '+oldNumUnit+'numUnit '+numUnit);
//                    console.log('new average '+newAverageMilli);
//                    fresh.update({averageMilli: newAverageMilli}, function(err, obj){
//                        callback();
//                    });
//                }
//                else {
//                    var newFresh = new IngredientFreshness();
//                    newFresh.ingredientName = ingredientName;
//                    newFresh.ingredientNameUnique = ingredientName.toLowerCase();
//                    newFresh.averageMilli = date.getTime();
//                    newFresh.oldestMilli = date.getTime();
//                    newFresh.save(function(err, obj){
//                        callback();
//                    });
//                }
//            });
//        }
//    });
//};
//
//exports.updateAverageDelete = function(res, next, date, ingredientName, numUnit, callback) {
//    Ingredient.findOne({nameUnique: ingredientName.toLowerCase()}, function(err, ingredient){
//        if (err) return next(err);
//        else if (!ingredient) return res.status(400).send('Ingredient '+ingredientName+' does not exist. 006');
//        else {
//            var oldNumUnit = ingredient.numUnit;
//            IngredientFreshness.findOne({ingredientNameUnique: ingredientName.toLowerCase()}, function(err, fresh){
//                if (err) return next(err);
//                else if (fresh) {
//                    var averageMilli = fresh.averageMilli;
//                    IngredientLot.getOldestLot(res, ingredientName.toLowerCase(), function(lot){
//                        if (lot && oldNumUnit != numUnit) {
//                            var newAverageMilli = Math.floor((averageMilli * oldNumUnit - lot.date.getTime() * numUnit) / (oldNumUnit - numUnit));
//                            console.log("OLD AVERAGE "+averageMilli+"NEW AVERAGE "+newAverageMilli);
//                            fresh.update({averageMilli: newAverageMilli}, function(err, obj){
//                                callback();
//                            });
//                        }
//                        else {
//                            fresh.remove(function(err){
//                                callback();
//                            });
//                        }
//                    });
//                } else {
//                    callback();
//                }
////                else {
////                    return res.status(400).send('Ingredient '+ingredientName+' does not exist.');
////                }
//            });
//        }
//    });
//};
//
//exports.updateOldestDelete = function(res, next, date, ingredientName, numUnit, callback) {
//    Ingredient.findOne({nameUnique: ingredientName.toLowerCase()}, function(err, ingredient){
//        if (err) return next(err);
//        else if (!ingredient) return res.status(400).send('Ingredient '+ingredientName+' does not exist. 005');
//        else {
//            var oldNumUnit = ingredient.numUnit;
//            IngredientFreshness.findOne({ingredientNameUnique: ingredientName.toLowerCase()}, function(err, fresh){
//                if (err) return next(err);
//                else if (fresh) {
//                    IngredientLot.getOldestLot(res, ingredientName.toLowerCase(), function(lot){
//                        if (lot) {
//                            fresh.update({oldestMilli: lot.date.getTime()}, function(err, obj){
//                                callback();
//                            });
//                        } else {
//                            fresh.remove(function(err){
//                                callback();
//                            });
//                        }
//                    });
//                }
//                else {
//                    callback();
//                }
////                else {
////                    return res.status(400).send('Ingredient '+ingredientName+' does not exist.');
////                }
//            });
//        }
//    });
//};

exports.getLatestInfo = function(res, next, ingredientName, callback) {
    if (!ingredientName) return res.json([]);

    var nowDate = new Date();
    var nowTime = nowDate.getTime();
    IngredientFreshness.findOne({ingredientNameUnique: ingredientName.toLowerCase()}, function(err, fresh){
        if (err) return next(err);
        else if (fresh){
            IngredientLot.find({ingredientNameUnique: ingredientName.toLowerCase()}, function(err, lots){
                 if (err) return next(err);
                 else if (!lots) callback();
                 else {
                    var totTime = 0;
                    var totUnit = 0;
                    for (var i = 0; i < lots.length; i++) {
                        var lot = lots[i];
                        var thenTime = lot.date.getTime();
                        var numUnit = lot.numUnit;
                        totUnit += numUnit;
                        totTime += (nowTime - thenTime)*numUnit;
                    }
                    var averageDiff = Math.floor((totTime/totUnit)/1000/60);

                    IngredientLot.getOldestLot(res, ingredientName.toLowerCase(), function(lot){
                        console.log('updating freshness data');
                        var oldestDiff = Math.floor((nowTime - lot.date.getTime())/1000/60);
                        console.log('oldestDiff '+oldestDiff);
                        var oldestMinute = Math.floor(oldestDiff % 60);
                        var oldestHour = Math.floor((oldestDiff/60) % 24);
                        var oldestDay = Math.floor(oldestDiff/60/24);

                        console.log('averageDiff '+averageDiff);
                        var averageMinute = Math.floor(averageDiff % 60);
                        var averageHour = Math.floor((averageDiff/60) % 24);
                        var averageDay = Math.floor(averageDiff/60/24);

                        fresh.update({oldestDay: oldestDay,
                                      oldestHour: oldestHour,
                                      oldestMinute: oldestMinute,
                                      averageDay: averageDay,
                                      averageHour: averageHour,
                                      averageMinute: averageMinute}, function(err, obj){
                                        console.log('updated freshness data');
                                        //console.log(fresh);
                                        callback();
                                      });
                    });
                }
            });
        }
        else {
            callback();
        }
    });
}

//exports.updateProductAverageAdd = function(res, next, dn, date, numUnit, callback) {
//    var oldNumUnit = numUnit;
//    ProductFreshness.findOne({productNameUnique: dn.productNameUnique}, function(err, fresh){
//        if (err) return next(err);
//        else if (fresh) {
//            console.log('freshness already exists');
//            var averageMilli = fresh.averageMilli;
//            console.log('average '+averageMilli);
//            var newAverageMilli = Math.floor((Number(averageMilli)*Number(oldNumUnit) + date.getTime()*Number(numUnit)) / (Number(oldNumUnit) + Number(numUnit)));
//            console.log('now date '+date.getTime());
//            console.log('old num '+oldNumUnit+'numUnit '+numUnit);
//            console.log('new average '+newAverageMilli);
//            fresh.update({averageMilli: newAverageMilli}, function(err, obj){
//                callback();
//            });
//        }
//        else {
//            var newFresh = new ProductFreshness();
//            newFresh.productName = dn.productName;
//            newFresh.productNameUnique = dn.productNameUnique;
//            newFresh.averageMilli = date.getTime();
//            newFresh.oldestMilli = date.getTime();
//            newFresh.save(function(err, obj){
//                callback();
//            });
//        }
//    });
//};
//
//exports.updateProductAverageDelete = function(res, next, date, dn, numUnit, callback) {
//    var oldNumUnit = dn.numUnit;
//    ProductFreshness.findOne({productNameUnique: dn.productNameUnique}, function(err, fresh){
//        if (err) return next(err);
//        else if (fresh) {
//            var averageMilli = fresh.averageMilli;
//            Product.getOldestLot(res, dn.productNameUnique, function(lot){
//                if (lot) {
//                    var newAverageMilli = Math.floor((averageMilli * oldNumUnit - lot.date.getTime() * numUnit) / (oldNumUnit - numUnit));
//                    console.log("OLD AVERAGE "+averageMilli+"NEW AVERAGE "+newAverageMilli);
//                    fresh.update({averageMilli: newAverageMilli}, function(err, obj){
//                        callback();
//                    });
//                }
//                else {
//                    fresh.remove(function(err){
//                        callback();
//                    });
//                }
//            });
//        } else {
//            callback();
//        }
//    });
//};
//
//exports.updateProductOldestDelete = function(res, next, date, dn, numUnit, callback) {
//    var oldNumUnit = numUnit;
//    ProductFreshness.findOne({productNameUnique: dn.productNameUnique}, function(err, fresh){
//        if (err) return next(err);
//        else if (fresh) {
//            Product.getOldestLot(res, dn.productNameUnique, function(lot){
//                if (lot) {
//                    fresh.update({oldestMilli: lot.date.getTime()}, function(err, obj){
//                        callback();
//                    });
//                } else {
//                    fresh.remove(function(err){
//                        callback();
//                    });
//                }
//            });
//        }
//        else {
//            callback();
//        }
//    });
//};

exports.getProductLatestInfo = function(res, next, productName, callback) {
    if (!productName) return res.json([]);

    var nowDate = new Date();
    var nowTime = nowDate.getTime();
    ProductFreshness.findOne({productNameUnique: productName.toLowerCase()}, function(err, fresh){
        if (err) return next(err);
        else if (fresh){
            Product.find({nameUnique: productName.toLowerCase(), empty: false, isIdle: true}, function(err, lots){
                 if (err) return next(err);
                 else if (!lots) callback();
                 else {
                    var totTime = 0;
                    var totUnit = 0;
                    for (var i = 0; i < lots.length; i++) {
                        var lot = lots[i];
                        var thenTime = lot.date.getTime();
                        var numUnit = lot.numUnit;
                        totUnit += numUnit;
                        totTime += (nowTime - thenTime)*numUnit;
                    }
                    var averageDiff = Math.floor((totTime/totUnit)/1000/60);

                    Product.getOldestLot(res, productName.toLowerCase(), function(lot){
                        console.log('updating freshness data');
                        var oldestDiff = Math.floor((nowTime - lot.date.getTime())/1000/60);
                        console.log('oldestDiff '+oldestDiff);
                        var oldestMinute = Math.floor(oldestDiff % 60);
                        var oldestHour = Math.floor((oldestDiff/60) % 24);
                        var oldestDay = Math.floor(oldestDiff/60/24);

                        console.log('averageDiff '+averageDiff);
                        var averageMinute = Math.floor(averageDiff % 60);
                        var averageHour = Math.floor((averageDiff/60) % 24);
                        var averageDay = Math.floor(averageDiff/60/24);

                        fresh.update({oldestDay: oldestDay,
                                      oldestHour: oldestHour,
                                      oldestMinute: oldestMinute,
                                      averageDay: averageDay,
                                      averageHour: averageHour,
                                      averageMinute: averageMinute}, function(err, obj){
                                        console.log('updated freshness data');
                                        //console.log(fresh);
                                        callback();
                                      });
                    });
                }
            });
        }
        else {
            callback();
        }
    });
}