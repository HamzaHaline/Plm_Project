var mongoose = require('mongoose');
var User = mongoose.model('User');
var Order = mongoose.model('Order');
var Ingredient = mongoose.model('Ingredient');
var IngredientPrice = mongoose.model('IngredientPrice');
var Vendor = mongoose.model('Vendor');
var VendorPrice = mongoose.model('VendorPrice');
var Storage = mongoose.model('Storage');
var Formula = mongoose.model('Formula');
var ProductionLine = mongoose.model('ProductionLine');

exports.process = function(model, item, itemId, res, next) {
    if (model == Vendor) {
        processVendor(item, itemId, res, next);
    }
    else if (model == Ingredient) {
        processIngredient(item, itemId, res, next);
    }
    else if (model == Formula) {
        processFormula(item, itemId, res, next);
    }
    else if (model == Storage) {
        processStorage(item, itemId, res, next);
    }
    else if (model == ProductionLine) {
        processProductionLine(item, itemId, res, next);
    }
//    else if (model == Order) {
//        processOrder(item, res, next);
//    }
};



var processIngredient = function(item, itemId, res, next) {
    console.log(item);
    var oldItem = item;
    var oldTemperatureZone = item.temperatureZone;
    var oldSpace = oldItem.space;
    console.log(itemId);
    Ingredient.findById(itemId, function(err, newItem){
        var newSpace = newItem.space;
        var newTemperatureZone = newItem.temperatureZone;
        if (oldTemperatureZone == newTemperatureZone) {
            console.log("()()()()()"+newSpace);
            console.log("<><><><><>"+oldSpace);
            Storage.findOne({temperatureZone: newTemperatureZone}, function(err, storage){
                var capacity = storage.capacity;
                var occupied = storage.currentOccupiedSpace;
                var newOccupied = occupied - oldSpace + newSpace;
                var newEmpty = capacity - newOccupied;
                storage.update({currentOccupiedSpace: newOccupied, currentEmptySpace: newEmpty}, function(err, obj){
                    console.log(oldSpace+' '+newSpace);
                    if (err) return next(err);
                });
            });
        } else {
            Storage.findOne({temperatureZone: newTemperatureZone}, function(err, storage){
                var capacity = storage.capacity;
                var occupied = storage.currentOccupiedSpace;
                var newOccupied = occupied + newSpace;
                var newEmpty = capacity - newOccupied;
                storage.update({currentOccupiedSpace: newOccupied, currentEmptySpace: newEmpty}, function(err, obj){
                    console.log(oldSpace+' '+newSpace);
                    console.log(newOccupied+' '+newEmpty);
                    if (err) return next(err);
                    else {
                        Storage.findOne({temperatureZone: oldTemperatureZone}, function(err, storage2){
                            var capacity2 = storage2.capacity;
                            var occupied2 = storage2.currentOccupiedSpace;
                            var newOccupied2 = occupied2 - oldSpace;
                            var newEmpty2 = capacity2 - newOccupied2;
                            storage2.update({currentOccupiedSpace: newOccupied2, currentEmptySpace: newEmpty2}, function(err, obj){
                                if (err) return next(err);
                            });
                        });
                    }
                });
            });
        }
    });
};

var processCart = function(item, res, next) { //
    var ingredientId = item.ingredientId;
    var newSpace;
    Inventory.findOne({ingredientId: ingredientId}, function(err, obj){
        if (err) return next(err);
        else if (!obj) {
            res.status(400);
            res.send("Ingredient doesn't exist in inventory");
        }
        else {
            newSpace = obj.space - item.space;
            updateInventory(ingredientId, newSpace, res, next, function(err){
                if (err) return next(err);
                else {
                    updateIngredient(ingredientId, item.space, obj.space, res, next);
                }
            });
        }
    });
};

var updateInventory = function(ingredientId, newSpace, res, next, callback) {
    Inventory.findOneAndUpdate({ingredientId: ingredientId}, {space: newSpace}, function(err, obj) {
        if (err) return next(err);
        else if (newSpace == 0){
            obj.remove(function(err){
                callback(err);
            });
        }
        else {
            callback(err);
        }
    });
};

var updateIngredient = function(ingredientId, cartQuantity, oldQuantity, res, next) {
    Ingredient.findById(ingredientId, function(err, ingredient){
        if (err) return next(err);
        else if (!ingredient) {
            res.status(400);
            res.send("Ingredient doesn't exist");
        }
        else {
            var moneyProd = ingredient.moneyProd;
            var moneySpent = ingredient.moneySpent;
            var newMoneyProd = moneyProd+1.0*cartQuantity*(moneySpent-moneyProd)/oldQuantity;
            //console.log(newMoneyProd);
            ingredient.update({moneyProd: newMoneyProd}, function(err, obj){
                if (err) return next(err);
            });
        }
    });
};


var processStorage = function(item, itemId, res, next) {
    console.log('changing empty space');
    var newLeft = item.capacity - item.currentOccupiedSpace;
    console.log(newLeft);
    Storage.findByIdAndUpdate(itemId, {currentEmptySpace: newLeft}, function(err, obj) {
        if (err) return next(err);
    });
};

var processVendor = function(item, itemId, res, next) {
    Ingredient.find({}, function(err, ingredients){
        if (err) return next(err);
        else {
            for (var i = 0; i < ingredients.length; i++) {
                var currentIngredient = ingredients[i];
                var vendors = currentIngredient.vendors;
                var newVendors = [];
                for (var j = 0; j<vendors.length; j++) {
                    var vendor = vendors[j];
                    console.log(vendor);
                    if (vendor.vendorId.toString() === itemId) {
                        vendor.vendorName = item.name;
                    }
                    newVendors.push(vendor);
                }
                currentIngredient.update({vendors: newVendors}, function(err, obj){
                    if (err) return next(err);
                })
            }
        }
    });
}

var processFormula = function(item, itemId, res, next){
    var oldProductionLineNames = item.productionLines;
    Formula.findById(itemId, function(err, formula){
        var newProductionLineNames = formula.productionLines;
        processFormulaHelperDeleteOld(res, next, 0, item, newProductionLineNames, oldProductionLineNames, function(){

        });
    });
}

var processFormulaHelperDeleteOld = function(res, next, i, formula, newProductionLineNames, oldProductionLineNames, callback){
    if (i == oldProductionLineNames.length) {
        processFormulaHelperAddNew(res, next, 0, formula, newProductionLineNames, oldProductionLineNames, callback)
    }
    else {
        var oldProductionLineName = oldProductionLineNames[i];
        if (!newProductionLineNames.includes(oldProductionLineName)) {
            ProductionLine.findOne({nameUnique: oldProductionLineName.toLowerCase()}, function(err, pl){
                if (err) return next(err);
                else if (!pl){
                    return res.status(400).send('Production Line '+oldProductionLineName+' does not exist');
                }
                else {
                    var formulasInProductionLine = pl.formulaNames;
                    var newArray = [];
                    for (var j = 0; j < formulasInProductionLine.length; j++) {
                        if (formulasInProductionLine[j] != formula.name) {
                            newArray.push(formulasInProductionLine[j]);
                        }
                    }
                    pl.update({formulaNames: newArray}, function(err, newPl){
                        processFormulaHelperDeleteOld(res, next, i+1, formula, newProductionLineNames, oldProductionLineNames, callback);
                    });
                }
            });
        }
        else {
            processFormulaHelperDeleteOld(res, next, i+1, formula, newProductionLineNames, oldProductionLineNames, callback);
        }
    }
}

var processFormulaHelperAddNew = function(res, next, i, formula, newProductionLineNames, oldProductionLineNames, callback){
    if (i == newProductionLineNames.length) {
        callback();
    }
    else {
        var newProductionLineName = newProductionLineNames[i];
        if (!oldProductionLineNames.includes(newProductionLineName)){
            ProductionLine.findOne({nameUnique: newProductionLineName.toLowerCase()}, function(err, pl){
                if (err) return next(err);
                else if (!pl){
                    return res.status(400).send('Production Line '+newProductionLineName+' does not exist');
                } else {
                    var formulasInProductionLine = pl.formulaNames;
                    formulasInProductionLine = formulasInProductionLine ? formulasInProductionLine : [];
                    if (!formulasInProductionLine.includes(formula.name)){
                        formulasInProductionLine.push(formula.name);
                    }
                    pl.update({formulaNames: formulasInProductionLine}, function(err, newPl){
                        processFormulaHelperAddNew(res, next, i+1, formula, newProductionLineNames, oldProductionLineNames, callback);
                    });
                }
            });
        } else {
            processFormulaHelperAddNew(res, next, i+1, formula, newProductionLineNames, oldProductionLineNames, callback);
        }
    }
}

var processProductionLine = function(item, itemId, res, next){
    var oldFormulaNames = item.formulaNames;
    ProductionLine.findById(itemId, function(err, newProductionLine){
        var newFormulaNames = newProductionLine.formulaNames;
        processProductionLineHelperDeleteOld(res, next, 0, item, newFormulaNames, oldFormulaNames, function(){

        });
    });
}

var processProductionLineHelperDeleteOld = function(res, next, i, pl, newFormulaNames, oldFormulaNames, callback){
    if (i == oldFormulaNames.length) {
        processProductionLineHelperAddNew(res, next, 0, pl, newFormulaNames, oldFormulaNames, callback)
    }
    else {
        var oldFormulaName = oldFormulaNames[i];
        if (!newFormulaNames.includes(oldFormulaName)) {
            Formula.findOne({nameUnique: oldFormulaName.toLowerCase()}, function(err, formula){
                if (err) return next(err);
                else if (!formula){
                    return res.status(400).send('Formula '+oldFormulaName+' does not exist');
                }
                else {
                    var productionLinesInFormula = formula.productionLines;
                    var newArray = [];
                    for (var j = 0; j < productionLinesInFormula.length; j++) {
                        if (productionLinesInFormula[j] !== pl.name) {
                            newArray.push(productionLinesInFormula[j]);
                        }
                    }
                    formula.update({productionLines: newArray}, function(err, newFormula){
                        processProductionLineHelperDeleteOld(res, next, i+1, pl, newFormulaNames, oldFormulaNames, callback);
                    });
                }
            });
        }
        else {
            processProductionLineHelperDeleteOld(res, next, i+1, pl, newFormulaNames, oldFormulaNames, callback);
        }
    }
}

var processProductionLineHelperAddNew = function(res, next, i, pl, newFormulaNames, oldFormulaNames, callback){
    if (i == newFormulaNames.length) {
        callback();
    }
    else {
        var newFormulaName = newFormulaNames[i];
        if (!oldFormulaNames.includes(newFormulaName)){
            Formula.findOne({nameUnique: newFormulaName.toLowerCase()}, function(err, formula){
                if (err) return next(err);
                else if (!formula){
                    return res.status(400).send('Formula '+newFormulaName+' does not exist');
                } else {
                    var productionLinesInFormula = formula.productionLines;
                    productionLinesInFormula = productionLinesInFormula ? productionLinesInFormula : [];
                    if (!productionLinesInFormula.includes(pl.name)){
                        productionLinesInFormula.push(pl.name);
                    }
                    //console.log(productionLinesInFormula);
                    formula.update({productionLines: productionLinesInFormula}, function(err, newFormula){
                        processProductionLineHelperAddNew(res, next, i+1, pl, newFormulaNames, oldFormulaNames, callback);
                    });
                }
            });
        } else {
            processProductionLineHelperAddNew(res, next, i+1, pl, newFormulaNames, oldFormulaNames, callback);
        }
    }
}
