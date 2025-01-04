var mongoose = require('mongoose');
var User = mongoose.model('User');
var Order = mongoose.model('Order');
var Ingredient = mongoose.model('Ingredient');
var IngredientPrice = mongoose.model('IngredientPrice');
var Vendor = mongoose.model('Vendor');
var VendorPrice = mongoose.model('VendorPrice');
var Storage = mongoose.model('Storage');
var Formula = mongoose.model('Formula');
var Product = mongoose.model('Product');
var IngredientLot = mongoose.model('IngredientLot');
var ProductionLine = mongoose.model('ProductionLine');
var DistributorNetwork = mongoose.model('DistributorNetwork');

exports.modify = function(action, model, item, itemId, res, next, callback) {
    if (model == Order) {
        modifyOrder(item, res, next, function(err, obj){
            if (err) return next(err);
            else {
                callback(err, obj);
            }
        });
    }
    else if (model == Vendor) {
        modifyVendor(action, item, itemId, res, next, function(err, obj){
            if (err) next(err);
            else {
                callback(err, obj);
            }
        });
    }
    else if (model == Ingredient) {
        modifyIngredient(action, item, itemId, res, next, function(err, obj){
            if (err) next(err);
            else {
                callback(err, obj);
            }
        });
    }
    else if (model == Formula) {
        modifyFormula(action, item, itemId, res, next, function(err, obj){
            if (err) next(err);
            else {
                callback(err, obj);
            }
        });
    }
    else if (model == Product) {
        modifyProduct(action, item, itemId, res, next, function(err, obj){
            if (err) next(err);
            else {
                callback(err, obj);
            }
        });
    }
    else if (model == IngredientLot) {
        modifyIngredientLot(action, item, itemId, res, next, function(err, obj){
            if (err) next(err);
            else {
                callback(err, obj);
            }
        });
    }
    else if (model == ProductionLine) {

        modifyProductionLine(action, item, itemId, res, next, function(err, obj){
            if (err) next(err);
            else {
                callback(err, obj);
            }
        });
    }
    else if (model == DistributorNetwork) {
        modifyDistributorNetwork(action, item, itemId, res, next, function(err, obj){
            if (err) next(err);
            else {
                callback(err, obj);
            }
        });
    }
    else callback(false, item);
};

var modifyOrder = function(item, res, next, callback) { //add number of pounds to order
    var num = item.packageNum;
    Order.getNumSpaceAndNumUnits(item.ingredientName, item.packageNum, res, next, function(err, space, numUnit){
        if (err) {
            return next(err);
        }
        else {
            Ingredient.findOne({nameUnique: item.ingredientName.toLowerCase()}, function(err, ingredient){
                if (err) return next(err);
                else if (!ingredient){
                    return res.status(400).send('Ingredient does not exist');
                } else {
                    //var str = JSON.stringify(item).slice(0,-1)+',"space":'+space+',"numUnit":'+numUnit+',"totalPrice":'+item.price*item.packageNum+',"ingredientId":"'+ingredient._id+'"}';
                    item.space = space;
                    item.numUnit = numUnit;
                    item.totalPrice = item.price*item.packageNum;
                    item.ingredientId = ingredient._id;
                    callback(err, item);
                }
            });
        }
    });
};

var modifyVendor = function(action, item, itemId, res, next, callback) { //add unique lowercase code to check code uniqueness
    var code = item.code.toLowerCase();
    var str = JSON.stringify(item).slice(0,-1)+',"codeUnique":"'+code+'"}';
    item = JSON.parse(str);

    return callback(0, item);

};

var modifyIngredient = function(action, item, itemId, res, next, callback) {
    var vendors = item.vendors;
    var ingredientName = item.name;
    var packageName = item. packageName;
//    Ingredient.getPackageSpace(packageName, function(singleSpace){
//        if (singleSpace == -1) return res.status(400).send('Package name does\'t exist');
//        else {
//            console.log(Math.ceil(1.0 * item.numUnit / item.numUnitPerPackage));
//            var newSpace = Math.ceil(1.0 * item.numUnit / item.numUnitPerPackage) * singleSpace;
            var str = JSON.stringify(item).slice(0,-1)+',"nameUnique":"'+ingredientName.toLowerCase()+'"}';
            item = JSON.parse(str);
//            item.space = newSpace;
            if (vendors == null || vendors.length == 0){
                callback(0, item);
            } else {
                var newVendors = [];
                helperIngredient(vendors, 0, res, next, newVendors, function(err, obj){
                    item.vendors = obj;
                    callback(0, item);
                })
            }
//        }
//    });
};

var helperIngredient = function(vendors, i, res, next, array, callback) {
    if (i == vendors.length) {
        callback(0, array);
    } else {
        vendor = vendors[i];
//        console.log(vendor);
        var newVendor;
        Vendor.findOne({name: vendor.vendorName}, function(err, obj){
            if (err) next(err);
            else if (!obj) {
                res.send('Vendor '+vendor.vendorName+' does not exist.');
            }
            else {
//                console.log(i);
//                console.log(vendor);
                var str = JSON.stringify(vendor).slice(0,-1)+',"codeUnique":"'+obj.codeUnique+'","vendorId":"'+obj._id+'"}';
                newVendor = JSON.parse(str);
                array.push(newVendor);

                helperIngredient(vendors, i+1, res, next, array, callback);
            }
        });
    }
};

var modifyFormula = function(action, item, itemId, res, next, callback) { //add unique lowercase code to check code uniqueness
    var str = JSON.stringify(item).slice(0,-1)+',"nameUnique":"'+item.name.toLowerCase()+'"}';
    item = JSON.parse(str);
    var ingredients = item.ingredients;
    if (ingredients == null || ingredients.length == 0){
        callback(0, item);
    } else {
        var newIngredients = [];
        console.log('************');
        console.log(ingredients);
        helperFormula(ingredients, 0, res, next, newIngredients, function(err, obj){
            item.ingredients = obj;
            callback(0, item);
        })
//        callback(0, item);
    }

};

var helperFormula = function(ingredients, i, res, next, array, callback) {
    if (i == ingredients.length) {
        callback(0, array);
    } else {
        ingredient = ingredients[i];
//        console.log(vendor);
        var newIngredient;
        Ingredient.findOne({nameUnique: ingredient.ingredientName.toLowerCase()}, function(err, obj){
            if (err) next(err);
            else if (!obj) {
                res.send('Ingredient '+ingredient.ingredientName+' does not exist.');
            }
            else {
//                console.log(i);
                var str = JSON.stringify(ingredient).slice(0,-1)+',"nativeUnit":"'+obj.nativeUnit+'"}';
                newIngredient = JSON.parse(str);
                array.push(newIngredient);
                console.log(newIngredient);
                helperFormula(ingredients, i+1, res, next, array, callback);
            }
        });
    }
};

var modifyProduct = function(action, item, itemId, res, next, callback) { //add unique lowercase code to check code uniqueness
    var str = JSON.stringify(item).slice(0,-1)+',"lotNumberUnique":"'+item.lotNumber.toLowerCase()+',"nameUnique":"'+item.name.toLowerCase()+'"}';
    item = JSON.parse(str);
    callback(0, item);
};

var modifyIngredientLot = function(action, item, itemId, res, next, callback) { //add unique lowercase code to check code uniqueness
    //var str = JSON.stringify(item).slice(0,-1)+',"lotNumberUnique":"'+item.lotNumber.toLowerCase()+',"ingredientNameUnique":"'+item.ingredientName.toLowerCase()+',"vendorNameUnique":"'+item.vendorName.toLowerCase()+'"}';
    //item = JSON.parse(str);
    item.lotNumberUnique = item.lotNumber.toLowerCase();
    item.ingredientNameUnique = item.ingredientName.toLowerCase();
    item.vendorNameUnique = item.vendorName.toLowerCase();
    if (item.date == null) item.date = new Date();
    callback(0, item);
};

var modifyProductionLine = function(action, item, itemId, res, next, callback) { //add unique lowercase code to check code uniqueness
    console.log(item);
    item.nameUnique = item.name.toLowerCase();
    callback(0, item);
};