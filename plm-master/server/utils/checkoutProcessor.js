var mongoose = require('mongoose');
var User = mongoose.model('User');
var Order = mongoose.model('Order');
var Ingredient = mongoose.model('Ingredient');
var IngredientPrice = mongoose.model('IngredientPrice');
var IngredientFreshness = mongoose.model('IngredientFreshness');
var ProductFreshness = mongoose.model('ProductFreshness');
var Vendor = mongoose.model('Vendor');
var VendorPrice = mongoose.model('VendorPrice');
var DistributorNetwork = mongoose.model('DistributorNetwork');
var Storage = mongoose.model('Storage');
var Formula = mongoose.model('Formula');
var Product = mongoose.model('Product');
var ProductionLine = mongoose.model('ProductionLine');
var IngredientLot = mongoose.model('IngredientLot');
var IngredientProduct = mongoose.model('IngredientProduct');
var validator = require('./validator');
var postProcessor = require('./postProcessorCreateUpdate');
var validatorDelete = require('./validatorDelete');
var deleteProcessor = require('./postProcessorDelete');
var checkoutProcessor = require('./checkoutProcessor');
var logger = require('./logger');
var freshness = require('./freshness');
var modifierCreateUpdate = require('./modifierCreateUpdate');

/*************

CHECKOUT ORDER PROCESSOR

*************/

exports.checkoutOrders = function(req, res, next, model, userId, username) {
    model.find({userId: userId, isPending: false}, function(err, items) {
        if (err) {
            return next(err);
        }
        else {
            validateOrders(items, res, next, function(wSpace, rSpace, fSpace){
                console.log("Orders validated. Added to pending");
                checkoutOrdersHelper(res, next, 0, items, username, function(){
                    res.send(items);
                });
            });
        }
    });
};

var checkoutOrdersHelper = function(res, next, i, items, username, callback) {
    if (i == items.length) {
        callback();
    } else {
        var order = items[i];
        var date = new Date();
        order.update({isPending: true, tag: date.getTime().toString()}, function(err, obj){
            logger.log(username, 'checkout', order, Order);
            checkoutOrdersHelper(res, next, i+1, items, username, callback);
        });
    }
}

exports.orderArrived = function(req, res, next, order, model) {
    console.log("orderArrived()");
    console.log("order:");
    console.log(order);
    modifierCreateUpdate.modify('update', model, order, '', res, next, function(err, obj){
        order = obj;
        addIngredientLotsHelper(req, res, next, 0, order, order.ingredientLots, function(){
            deleteProcessor.process(model, order, '', res, next);
            updateStorage(order);
            User.findById(req.params.userId, function(err, user){
                if (user) logger.log(user.username, 'order arrived', order, Order);
                res.send(order);
            });
        });
    });
}

//var addIngredientLots = function(req, res, next, items, i, callback){
//    if (i == items.length) {
//        console.log('called');
//        callback();
//    } else {
//        var order = items[i];
//        var assignments = order.ingredientLots;
//        addIngredientLotsHelper(req, res, next, 0, order, assignments, function(){
//            addIngredientLots(req, res, next, items, i+1, callback);
//        });
//    }
//};

var addIngredientLotsHelper = function(req, res, next, j, order, assignments, callback) {
    console.log("addIngredientLotsHelper()");
    console.log("j: " + j);
    if (j == assignments.length) callback();
    else {
        var assignment = assignments[j];
        var lotNumber = assignment.lotNumber;
        var lotNumberUnique = assignment.lotNumber.toLowerCase();
        var numPackage = assignment.package;
        IngredientLot.findOne({ingredientNameUnique: order.ingredientName.toLowerCase(),
                               vendorNameUnique: order.vendorName.toLowerCase(),
                               lotNumberUnique: lotNumberUnique}, function(err, ingredientLot){
             Ingredient.findOne({nameUnique: order.ingredientName.toLowerCase()}, function(err, ingredient){
                 if (err) return next(err);
                 else if (!ingredientLot) {
                    if (err) return next(err);
                    else if (!ingredient) return res.status(400).send('Ingredient '+order.ingredientName+' does not exist. 001');
                    else {
                        var newIngredientLot = new IngredientLot();
                        newIngredientLot.ingredientName = order.ingredientName;
                        newIngredientLot.ingredientNameUnique = order.ingredientName.toLowerCase();
                        newIngredientLot.ingredientId = order.ingredientId;
                        newIngredientLot.nativeUnit = ingredient.nativeUnit;
                        newIngredientLot.numUnit = numPackage * ingredient.numUnitPerPackage;
                        newIngredientLot.date = new Date();
                        newIngredientLot.lotNumber = lotNumber;
                        newIngredientLot.lotNumberUnique = lotNumberUnique;
                        newIngredientLot.vendorName = order.vendorName;
                        newIngredientLot.vendorNameUnique = order.vendorName.toLowerCase();
                        newIngredientLot.save(function(err){
                            addIngredientFreshness(res, next, order.ingredientName, function(){
                                console.log('called here 1');
                                addIngredientLotsHelper(req, res, next, j+1, order, assignments, callback);
                            });
                        });
                    }
                 }
                 else {
                    var oldNumUnit = ingredientLot.numUnit;
                    var newNumUnit = numPackage * ingredient.numUnitPerPackage + oldNumUnit;
                    console.log("oldNumUnit: " + oldNumUnit);
                    console.log("numPackage: " + numPackage);
                    console.log("ingredient:");
                    console.log(ingredient);
                    console.log("newNumUnit: " + newNumUnit); 
                    ingredientLot.update({numUnit: newNumUnit}, function(err, obj){
                        addIngredientFreshness(res, next, order.ingredientName, function(){
                            console.log('called here 2');
                            addIngredientLotsHelper(req, res, next, j+1, order, assignments, callback);
                        });
                    });
                 }
             });
        });
    }
}

var addIngredientFreshness = function(res, next, ingredientName, callback) {
    IngredientFreshness.findOne({ingredientNameUnique: ingredientName.toLowerCase()}, function(err, fresh){
        if (err) return next(err);
        else if (!fresh) {
            var newFresh = new IngredientFreshness();
            newFresh.ingredientName = ingredientName;
            newFresh.ingredientNameUnique = ingredientName.toLowerCase();
            newFresh.save(function(err){
                callback();
            });
        } else {
            callback();
        }
    })
}

var updateStorage = function(order) {
    var ingredientId = order.ingredientId;
    var space = order.space;
    console.log("CALLED())()()()())()()()())(");
    console.log(order);
    Ingredient.findById(ingredientId, function(err, ingredient){
        console.log(ingredient);
        if (err) return next(err);
        else if (!ingredient) return res.status(400).send('Ingredinet '+order.ingredientName+' does not exist any more');
        else {
            Storage.findOne({temperatureZone: ingredient.temperatureZone}, function(err, storage){
                if (err) return next(err);
                else {
                    var capacity = storage.capacity;
                    var newOccupied = storage.currentOccupiedSpace + space;
                    var newEmpty = capacity - newOccupied;
                    storage.update({currentOccupiedSpace: newOccupied, currentEmptySpace: newEmpty}, function(err, obj){

                    });
                }
            })
        }
    });
};

var validateOrders = function(items, res, next, callback) {
    validateOrdersHelper(0, items, res, next, 0, 0, 0, function(wSpace, rSpace, fSpace){
        callback(wSpace, rSpace, fSpace);
    });
};

var validateOrdersHelper = function(i, items, res, next, wSpace, rSpace, fSpace, callback) {
    if (i == items.length) {
        checkSpaces(res, next, wSpace, rSpace, fSpace, function(){
            callback(wSpace, rSpace, fSpace);
        });
    } else {
        var order = items[i];
        if (order.vendorName == null || order.vendorName == '') {
            res.status(400).send('Vendor has not been chosen for ingredient '+order.ingredientName+'.');
            return;
        }
        var space = order.space;
        Ingredient.findOne({nameUnique: order.ingredientName.toLowerCase()}, function(err, obj){
            if (err) return next(err);
            else if (!obj) {
                res.status(400).send('Ingredient '+order.ingredientName+' does not exist. 002');
                return;
            } else {
                var temperatureZone = obj.temperatureZone;
                if (temperatureZone == 'warehouse' && obj.packageName != 'railcar' && obj.packageName != 'truckload') wSpace += space;
                else if (temperatureZone == 'refrigerator' && obj.packageName != 'railcar' && obj.packageName != 'truckload') rSpace += space;
                else if (temperatureZone == 'freezer' && obj.packageName != 'railcar' && obj.packageName != 'truckload') fSpace += space;
                console.log('***********'+space);
                validateOrdersHelper(i+1, items, res, next, wSpace, rSpace, fSpace, callback);
            }
        });
    }
};

var checkSpaces = function(res, next, wSpace, rSpace, fSpace, callback) {
    Storage.find({}, function(err, objs){
        if (err) return next(err);
        else {
            for (var i = 0; i < objs.length; i++) {
                var obj = objs[i];
                console.log(obj.temperatureZone);
                if (obj.temperatureZone == 'warehouse' && wSpace > obj.currentEmptySpace) {
                    res.status(400).send('Capacity left: '+obj.currentEmptySpace+' sqft will be exceeded for '+ obj.temperatureZone +
                    '. The total space that will be occupied by items in your cart for warehouse is '+ wSpace+'.');
                    return;
                }
                if (obj.temperatureZone == 'refrigerator' && rSpace > obj.currentEmptySpace) {
                    res.status(400).send('Capacity left: '+obj.currentEmptySpace+' sqft will be exceeded for '+ obj.temperatureZone +
                    '. The total space that will be occupied by items in your cart for refrigerator is '+ rSpace+'.');
                    return;
                }
                if (obj.temperatureZone == 'freezer' && fSpace > obj.currentEmptySpace) {
                    res.status(400).send('Capacity left: '+obj.currentEmptySpace+' sqft will be exceeded for '+ obj.temperatureZone +
                    '. The total space that will be occupied by items in your cart for freezer is '+ fSpace+'.');
                    return;
                }
            }
            console.log(wSpace+' '+rSpace+' '+fSpace);
            callback();
        }
    });
};


/*************

CHECKOUT FORMULA PROCESSOR

*************/

exports.checkoutFormula = function(req, res, next, model, username) { //main checkout method
    console.log("Checking out formula");
    var formulaId = req.params.formulaId;
    var quantity = req.params.quantity;
    var productionLineName = req.params.productionLineName;
    console.log("formulaId: " + formulaId);
    console.log("quantity: " + quantity);
    console.log("productionLineName: " + productionLineName);

    Formula.findById(formulaId, function(err, formula){
        if (err) return next(err);
        else if (!formula){
            return res.status(400).send('Formula does not exist');
        } else {
            checkProductAmount(req, res, next, formula, quantity, function(){
                //passed check that amount is larger than minimum required
                checkNewStorageHelper(req, res, next, formula, quantity, function(totalSpace){
                    var multiplier = quantity/formula.unitsProvided;
                    console.log('quantity is '+quantity);
                    console.log('unitsProvided is '+formula.unitsProvided);
                    console.log('multiplier is '+multiplier);
                    
                    var ingredients = formula.ingredients;

                    checkIngredientHelper(req, res, next, multiplier, 0, ingredients, [], true, function(missingIngredientsArray, viable){
                          if (req.params.action === 'review') {
                              return res.json(missingIngredientsArray);
                          } else {
                              ProductionLine.findOne({nameUnique: productionLineName.toLowerCase()}, function(err, productionLine){
                                   if (!productionLine) return res.status(400).send('Production line does not exist');
                                   else if (!productionLine.isIdle) return res.status(400).send('Production line is currently used by '+productionLine.currentFormula);
                                   else {
                                      if (viable) { //check complete
                                         var date = new Date();
                                         console.log('About to update ingredient quantity');
                                         updateIngredientHelper(req, res, next, multiplier, ingredients, formula, 0, 0, [], date, function(newSpentMoney, arrayInProductOut) {
                                             addProduct(req, res, next, formula, quantity, arrayInProductOut, date, productionLine, function(lotNumber) {
                                                 updateProductionLineAfterCheckout(res, next, productionLine, formula, date, quantity,
                                                    newSpentMoney, totalSpace, arrayInProductOut, lotNumber,
                                                    ()=>{logger.log(username, 'send to prod', formula, Formula); res.json(productionLine); console.log("Finished checkout process")});
                                             });
                                         });
                                      } else {
                                         return res.status(406).json(missingIngredientsArray);
                                      }
                                   }
                              });
                          }
                    });
                });
            });
        }
    });
};

var updateProductionLineAfterCheckout = function(res, next, productionLine, formula, date, quantity, newSpentMoney, totalSpace, arrayInProductOut, lotNumber, next) {
    var dates = productionLine.dates;
    dates = (dates == null) ? [] : dates;
    var newTuple = new Object();
    newTuple.startDate = date;
    dates.push(newTuple);
    productionLine.update({isIdle: false, currentFormula: formula.name, dates: dates,
                           quantity: quantity, newSpentMoney: newSpentMoney, totalSpace: totalSpace, 
                           arrayInProductOut:arrayInProductOut,
                           lotNumber: lotNumber}, function(err, obj){
        next();
    });
}

exports.markComplete = function(req, res, next){
    var date = new Date();
    console.log("Marking complete");
    ProductionLine.findById(req.params.productionLineId, function(err, pl){
        if (err) return next(err);
        else if (!pl) return res.status(400).send('Production line does not exist');
        else {
            console.log("PL found");
            var quantity = pl.quantity;
            var newSpentMoney = pl.newSpentMoney;
            var totalSpace = pl.totalSpace;
            Formula.findOne({nameUnique: pl.currentFormula.toLowerCase()}, function(err, formula){
                if (err) return next(err);
                else if (!formula) return res.status(400).send('Formula does not exist');
                else {
                    console.log("Formula found");
                    var totalProvided = formula.totalProvided;
                    var totalCost = formula.totalCost;

                    console.log('Before update formula');
                    formula.update({totalProvided: Number(totalProvided)+Number(quantity), totalCost:totalCost+newSpentMoney}, function(err, obj) {
                      if (err) return next(err);
                      else {
                        console.log("Formula updated successfully");
                        updateStorageAfterCheckoutIP(res, req, next, formula, totalSpace);
                        console.log(formula.isIntermediate);

                        updateProductionLineAfterComplete(res, next, pl, date, function(arrayInProductOut){
                            User.findById(req.params.userId, function(err, user){
                                if (!formula.isIntermediate) {
                                    //TODO: add ingredientLotUsedInProduct in the product object
                                    updateProduct(req, res, next, formula, quantity, arrayInProductOut, date, pl, function() {
                                        updateIngredientProduct(req, res, next, pl, formula, date, function(){
                                            addDistributorNetwork(req, res, next, formula, pl, date, function(){
                                                logger.log(user.username, 'mark complete', pl, ProductionLine);
                                                return res.send(pl);
                                            })
                                        });
                                    });
                                } else {
                                    //TODO: add ingredient and ingerdientLot object if intermediate
                                    addIntermediateProductIngredientLot(req, res, next, formula, quantity, totalSpace, date, pl, function(){
                                        updateProduct(req, res, next, formula, quantity, arrayInProductOut, date, pl, function() {
                                            updateIngredientProduct(req, res, next, pl, formula, date, function(){
                                                logger.log(user.username, 'mark complete', pl, ProductionLine);
                                                return res.send(pl);
                                            });
                                        });
                                    });
                                }
                            });
                        });
                      }
                    });
                }
            });
        }
    });
}

var updateProductionLineAfterComplete = function(res, next, productionLine, date, callback) {
    console.log("Updating Production Line");
    var dates = productionLine.dates;
    dates = (dates == null) ? [] : dates;
    var lastDate = dates[dates.length - 1];
    lastDate.endDate = date;
    dates[dates.length] = lastDate;
    productionLine.update({isIdle: true, dates: dates, currentFormula: null}, function(err, obj){
        callback(productionLine.arrayInProductOut);
    });
}

var checkProductAmount = function(req, res, next, formula, quantity, callback) { // check amount larger than min
    var unitsProvided = formula.unitsProvided;
    if (quantity < unitsProvided) {
        return res.status(400).send('The amount provided must be at least '+unitsProvided+'.');
    } else {
        console.log("production is larger than minimum requirement, which is " + unitsProvided);
        callback();
    }
};

var checkNewStorageHelper = function(req, res, next, formula, quantity, callback) { // check space if intermediate
    if (formula.isIntermediate){
        Storage.findOne({temperatureZone: formula.temperatureZone}, function(err, storage){
            var currentEmpty = storage.currentEmptySpace;
            Ingredient.getPackageSpace(formula.packageName, function(space){
                var totalSpace = Math.ceil(quantity/formula.numUnitPerPackage)*space;
                if (totalSpace > currentEmpty) {
                    res.status(400).send('Storage left for '+formula.temperatureZone+' will be exceeded by the produced product\'s total space: '+totalSpace);
                } else {
                    if (formula.packageName == null || formula.temperatureZone == null || formula.nativeUnit == null || formula.nativeUnit == '' || formula.numUnitPerPackage == null){
                        return res.status(400).send('Not all information (package name/temperature zone/native unit/native units per package) is given for this intermediate product.');
                    } else {
                        callback(totalSpace);
                    }
                }
            });
        });
    } else {
        console.log("formula is not intermediate, bypassing storage checker");
        callback(0);
    }
};

var updateStorageAfterCheckoutIP = function(req, res, next, formula, totalSpace){ // update storage if intermediate
    if (formula.isIntermediate) {
        Storage.findOne({temperatureZone: formula.temperatureZone}, function(err, storage){
            var capacity = storage.capacity;
            var newOccupied = storage.currentOccupiedSpace + totalSpace;
            var newEmpty = capacity - newOccupied;
            storage.update({currentOccupiedSpace: newOccupied, currentEmptySpace: newEmpty}, function(err, obj){

            });
        });
    }
}

var checkIngredientHelper = function(req, res, next, multiplier, i, ingredients, missingIngredientArray, viable, callback) { // c
    if (i === ingredients.length) {
        callback(missingIngredientArray, viable);
    } else {
        const currentIngredient = ingredients[i];
        const totalAmountNeeded = multiplier*currentIngredient.quantity;
        const ingredientName = currentIngredient.ingredientName;
        console.log("Need " + totalAmountNeeded + " units of " + ingredientName);

        Ingredient.findOne({nameUnique: ingredientName.toLowerCase()}, function(err, ingredient){
            if (err) return next(err);
            else if (!ingredient) return res.status(400).send('Ingredient '+currentIngredient.ingredientName+' does not exist. 000');
            else {
                if (totalAmountNeeded > ingredient.numUnit) {
                    //do not have enough ingredients in stock;
                    viable = false;
                }
                var ingredientDelta = new Object();
                ingredientDelta.ingredientId = ingredient._id;
                ingredientDelta.isIntermediate = ingredient.isIntermediate;
                ingredientDelta.ingredientName = currentIngredient.ingredientName;
                ingredientDelta.totalAmountNeeded = totalAmountNeeded;
                ingredientDelta.currentUnit = ingredient.numUnit;
                ingredientDelta.numUnitPerPackage = ingredient.numUnitPerPackage;
                ingredientDelta.vendors = ingredient.vendors;
                ingredientDelta.delta = (totalAmountNeeded - ingredient.numUnit) > 0 ? totalAmountNeeded - ingredient.numUnit : 0;
                missingIngredientArray.push(ingredientDelta);
                console.log(totalAmountNeeded+' '+ingredient.numUnit);
                console.log(missingIngredientArray);
                checkIngredientHelper(req, res, next, multiplier, i+1, ingredients, missingIngredientArray, viable, callback);
            }
        });
    }
}

var updateIngredientHelper = function(req, res, next, multiplier, ingredients, formula, newSpentMoney, i, arrayInProduct, date, callback) {
    if (i === ingredients.length) {
        callback(newSpentMoney, arrayInProduct);
    } else {
        console.log("updating ingredient " + i);
        var currentIngredient = ingredients[i];
        console.log('multiplier is '+multiplier);
        console.log('formula name is '+formula.name);
        const ingredientName = currentIngredient.ingredientName;
        console.log("ingredientName is " + ingredientName);
        const amountNeeded = currentIngredient.quantity*multiplier;
        console.log("amountNeeded is " + amountNeeded);
        lotPickerHelper(req, res, next, ingredientName, amountNeeded, arrayInProduct, date, formula, function(arrayInProductOut){
            //arrayInProductOut array of ingredient lots used by production
            //lot has been removed and updated already
            console.log('lot picker completed');
            Ingredient.findOne({nameUnique: ingredientName.toLowerCase()}, function(err, ingredient){
                console.log("updating the ingredient collection");
                var numUnit = ingredient.numUnit;
                console.log("original number of units: " + numUnit);
                console.log("amountNeeded is " + amountNeeded);
                var newNumUnit = numUnit - amountNeeded;
                console.log("remaining number of units is " + newNumUnit);
                const numUnitPerPackage = ingredient.numUnitPerPackage;
                console.log("Number of units per package: " + numUnitPerPackage);
                var remainingPackages = Math.ceil(1.0*newNumUnit/numUnitPerPackage);
                console.log("remaining number of packages: " + remainingPackages);
                // console.log("AMOUNT++++ "+currentIngredient.quantity*multiplier);
                var moneyProd = ingredient.moneyProd;
                var moneySpent = ingredient.moneySpent;
                var newMoneyProd = moneyProd+1.0*currentIngredient.quantity*multiplier*(moneySpent-moneyProd)/numUnit;
                newSpentMoney += 1.0*currentIngredient.quantity*multiplier*(moneySpent-moneyProd)/numUnit;

                if (newNumUnit <= 0) {
                    IngredientFreshness.findOne({ingredientNameUnique: ingredient.nameUnique}, function(err, fresh){
                        fresh.remove(function(err){});
                    });
                }

                Ingredient.getPackageSpace(ingredient.packageName, function(retSpace){
                    var newSpace = remainingPackages * retSpace;
                    var oldSpace = ingredient.space;
                    console.log("originally occupying " + oldSpace + "sqft");
                    console.log("now occupying " + newSpace + "sqft");

                    ingredient.update({numUnit: newNumUnit, space: newSpace, moneyProd: newMoneyProd}, function(err, obj){
                        if (err) return next(err);
                        else {
                            const temperatureZone = ingredient.temperatureZone;
                            console.log("updating storage for " + temperatureZone);
                            Storage.findOne({temperatureZone: temperatureZone}, function(err, storage){
                                var capacity = storage.capacity;
                                var capacityEmpty = storage.currentEmptySpace;
                                var capacityOccupied = storage.currentOccupiedSpace;
                                console.log("Before updating, the storage has the following parameters:");
                                console.log("capcity: " + capacity);
                                console.log("used: " + capacityOccupied);
                                console.log("free: " + capacityEmpty);
                                //var subSpace = retSpace*Math.ceil(1.0*currentIngredient.quantity*multiplier/ingredient.numUnitPerPackage);
                                // var subSpace = oldSpace - newSpace;
                                const difference = newSpace - oldSpace;
                                const newCapacityOccupied = capacityOccupied + difference;
                                const newCapacityEmpty = capacityEmpty - difference;

                                console.log("Storage should be updated to the following parameters:");
                                console.log("used: " + newCapacityOccupied);
                                console.log("free: " + newCapacityEmpty);

                                storage.update({currentOccupiedSpace: newCapacityOccupied, currentEmptySpace: newCapacityEmpty}, function(err, obj){
                                    if (err) return next(err);
                                    else {
                                        // console.log(subSpace+' '+retSpace+' '+currentIngredient.quantity*multiplier/ingredient.numUnitPerPackage);
                                        console.log("Finished updating ingredient " + i + ", or " + ingredientName);
                                        updateIngredientHelper(req, res, next, multiplier, ingredients, formula, newSpentMoney, i+1, arrayInProductOut, date, callback);
                                    }
                                });
                            });
                        }
                    });
                });
            });
        });
    }
};

var lotPickerHelper = function(req, res, next, ingredientName, quantity, arrayInProduct, date, formula, callback) {
    // console.log('!!!!!!!!'+ingredientName);
    // console.log('!!!!!!!!'+quantity);
    // console.log('!!!!!!!!'+formula);
    console.log("Picking Lot with the following parameters.")
    console.log("ingredientName: " + ingredientName);
    console.log("quantity: " + quantity);
    console.log("formula:");
    console.log(formula);
    IngredientLot.getOldestLot(res, ingredientName.toLowerCase(), function(lot){
        // console.log('Before update ingredient-product');
//        updateIngredientProduct(req, res, next, ingredientName, formula, date, lot, function(){
            // console.log('After update ingredient-product');
//            var newIngredientProduct = new IngredientProduct();
//            newIngredientProduct.ingredientNameUnique = ingredientName.toLowerCase();
//            newIngredientProduct.vendorNameUnique = (lot.vendorNameUnique == null) ? lot.vendorNameUnique: '';
//            newIngredientProduct.lotNumberUnique = lot.lotNumberUnique;
//            newIngredientProduct.lotId = lot._id;
//            newIngredientProduct.productName = formula.name;

            var ingredientLotUsedInProduct = new Object();
            ingredientLotUsedInProduct.ingredientName = ingredientName;
            ingredientLotUsedInProduct.vendorName = lot.vendorName;
            ingredientLotUsedInProduct.lotNumber = lot.lotNumber;
            ingredientLotUsedInProduct.lotId = lot._id.toString();
            arrayInProduct.push(ingredientLotUsedInProduct);

            if (quantity < lot.numUnit) {
                var newNumUnit = lot.numUnit - quantity;
                lot.update({numUnit: newNumUnit}, function(err, obj){
//                    freshness.updateAverageDelete(res, next, date, ingredientName, quantity, function(){
                        callback(arrayInProduct);
//                    });
                });
            } else if (quantity == lot.numUnit) {
                lot.remove(function(err){
//                    freshness.updateAverageDelete(res, next, date, ingredientName, quantity, function(){
//                        freshness.updateOldestDelete(res, next, date, ingredientName, quantity, function(){
                            callback(arrayInProduct);
//                        });
//                    });
                });
            } else {
                lot.remove(function(err){
//                    freshness.updateAverageDelete(res, next, date, ingredientName, quantity, function(){
//                        freshness.updateOldestDelete(res, next, date, ingredientName, quantity, function(){
                            lotPickerHelper(req, res, next, ingredientName, quantity - lot.numUnit, arrayInProduct, date, formula, callback);
//                        });
//                    });
                });
            }
//        });
    });
};


var updateIngredientProduct = function(req, res, next, pl, formula, date, callback) {
    console.log('FFFFFFFFF='+formula);
    var arrayInProductOut = pl.arrayInProductOut;
    updateIngredientProductHelper(req, res, next, arrayInProductOut, formula, date, 0, pl, callback);
};

var updateIngredientProductHelper = function(req, res, next, arrayInProductOut, formula, date, i, pl, callback) {
    if (i == arrayInProductOut.length) {
        callback();
    } else {
        item = arrayInProductOut[i];
        var newIngredientProduct = new IngredientProduct();
        newIngredientProduct.ingredientNameUnique = item.ingredientName.toLowerCase();
        newIngredientProduct.vendorNameUnique = (item.vendorName == null) ? '': item.vendorName.toLowerCase();
        newIngredientProduct.lotNumber = item.lotNumber;
        newIngredientProduct.lotNumberUnique = item.lotNumber.toLowerCase();
        newIngredientProduct.lotId = item.lotId;
        newIngredientProduct.productName = formula.name;
        newIngredientProduct.date = date;
        newIngredientProduct.lotNumberProduct = pl.lotNumber;
        console.log(newIngredientProduct);
        newIngredientProduct.save(function(err){
            updateIngredientProductHelper(req, res, next, arrayInProductOut, formula, date, i+1, pl, callback);
        });
    }
}

var addProduct = function(req, res, next, formula, numUnit, arrayInProductOut, date, pl, callback){ //history
    var product = new Product();
    product.name = formula.name;
    product.nameUnique = formula.name.toLowerCase();
    product.numUnit = numUnit;
    product.numUnitLeft = numUnit;

    product.isIdle = false;
    product.productionLine = pl.name;

    product.empty = false;
    product.date = date;
    product.lotNumber = formula.isIntermediate? 'IP'+date.getTime() : 'PR'+date.getTime();
    product.ingredients = arrayInProductOut;
    product.lotNumberUnique = product.lotNumber.toLowerCase();
    product.save(function(err){
        console.log('Product '+formula.name+' added');
        if (err) return next(err);
        else {
//            addProductFreshness(res, next, formula.name, function(){
                callback(product.lotNumber);
//            });
        }
    })
};

var updateProduct = function(req, res, next, formula, numUnit, arrayInProductOut, date, pl, callback){ //history
    Product.findOne({lotNumber: pl.lotNumber}, function(err, product){
        product.update({date: date, isIdle: true}, function(err, obj){
            console.log('Product '+formula.name+' added');
            if (err) return next(err);
            else if (!formula.isIntermediate) {
                addProductFreshness(res, next, formula.name, function(){
                    callback();
                });
            } else {
                callback();
            }
        })
    })
};

var addProductFreshness = function(res, next, productName, callback) {
    ProductFreshness.findOne({productNameUnique: productName.toLowerCase()}, function(err, fresh){
        if (err) return next(err);
        else if (!fresh) {
            var newFresh = new ProductFreshness();
            newFresh.productName = productName;
            newFresh.productNameUnique = productName.toLowerCase();
            newFresh.save(function(err){
                callback();
            });
        } else {
            callback();
        }
    })
}

var addDistributorNetwork = function(req, res, next, formula, pl, date, callback){ //distribution
    DistributorNetwork.findOne({productNameUnique: formula.nameUnique}, function(err, dn){
        if (err) return next(err);
        else if (!dn) {
            var newDistributorNetworkItem = new DistributorNetwork();
            newDistributorNetworkItem.productName = formula.name;
            newDistributorNetworkItem.productNameUnique = formula.nameUnique;
            newDistributorNetworkItem.numUnit = pl.quantity;
            newDistributorNetworkItem.numSold = 0;
            newDistributorNetworkItem.totalRevenue = 0;
            newDistributorNetworkItem.totalCost = pl.newSpentMoney;
            newDistributorNetworkItem.save(function(err){
//                freshness.updateProductAverageAdd(res, next, newDistributorNetworkItem, date, pl.quantity, function(){
                    callback();
//                })
            });
        } else {
            var numUnit = dn.numUnit;
            var totalCost = dn.totalCost;
            dn.update({numUnit: numUnit + pl.quantity, totalCost: totalCost + pl.newSpentMoney}, function(err, obj){
//                freshness.updateProductAverageAdd(res, next, dn, date, pl.quantity, function(){
                    callback();
//                })
            });
        }
    })
};

var addIntermediateProductIngredientLot = function(req, res, next, formula, numUnit, totalSpace, date, pl, callback){ //lot
    Ingredient.findOne({nameUnique: formula.nameUnique}, function(err, ingredient){
        addIngredientFreshness(res, next, formula.name, function(){
            if (err) return next(err);
            else if (!ingredient){
                var newIngredient = new Ingredient();
                //TODO: update moneyspent and moneyprod, if needed
                newIngredient.name = formula.name;
                newIngredient.nameUnique = formula.nameUnique;
                newIngredient.packageName = formula.packageName;
                newIngredient.temperatureZone = formula.temperatureZone;
                newIngredient.nativeUnit = formula.nativeUnit;
                newIngredient.numUnitPerPackage = formula.numUnitPerPackage;
                newIngredient.numUnit = numUnit;
                newIngredient.space = totalSpace;
                newIngredient.isIntermediate = true;

                newIngredient.save(function(err){
                    if (err) return next(err);
                    else {
                        Ingredient.findOne({nameUnique: newIngredient.nameUnique}, function(err, obj){
                            var ingredientLot = new IngredientLot();
                            ingredientLot.ingredientName = newIngredient.name;
                            ingredientLot.ingredientNameUnique = newIngredient.nameUnique;
                            ingredientLot.ingredientId = obj._id;
                            ingredientLot.numUnit = numUnit;
                            ingredientLot.nativeUnit = newIngredient.nativeUnit;
                            ingredientLot.date = date;
                            ingredientLot.lotNumber = pl.lotNumber;
                            ingredientLot.lotNumberUnique = ingredientLot.lotNumber.toLowerCase();
                            //ingredientLot.vendorName = '(Intermediate Product)';
                            ingredientLot.save(function(err){
                                if (err) return next(err);
                                else {
    //                                freshness.updateAverageAdd(res, next, newIngredient.name, date, numUnit, function(){});
                                    callback();
                                }
                            });
                        });
                    }
                });
            } else {
                var newNumUnit = Number(ingredient.numUnit) + Number(numUnit);
                var newSpace = Number(ingredient.space) + Number(totalSpace);
    //            products = ingredient.products;
    //            var productInIngredient = new Object();
    //            productInIngredient.productName = formula.name;
    //            productInIngredient.date = date;
    //            productInIngredient.lotNumber = 'IP'+date.getTime();
    //            productInIngredient.vendorName = 'N/A';
    //            products.push(productInIngredient);
                ingredient.update({numUnit: newNumUnit, space: newSpace}, function(err, obj){
                    var ingredientLot = new IngredientLot();
                    ingredientLot.ingredientName = ingredient.name;
                    ingredientLot.ingredientNameUnique = ingredient.nameUnique;
                    ingredientLot.ingredientId = ingredient._id;
                    ingredientLot.numUnit = Number(numUnit);
                    ingredientLot.nativeUnit = ingredient.nativeUnit;
                    ingredientLot.date = date;
                    ingredientLot.lotNumber = pl.lotNumber;
                    ingredientLot.lotNumberUnique = ingredientLot.lotNumber.toLowerCase();
                    ingredientLot.save(function(err){
                        if (err) return next(err);
                        else
    //                    freshness.updateAverageAdd(res, next, ingredient.name, date, numUnit, function(){});
                            callback();
                    });
                });
            }
        });
    });
};

//var updateIngredientProduct = function(req, res, next, ingredientName, formula, date, lot, callback) { //recall report
////    if (i == ingredients.length) {
////        callback();
////    }
////    else {
//        console.log('FFFFFFFFF='+formula);
//        var newIngredientProduct = new IngredientProduct();
//        newIngredientProduct.ingredientNameUnique = ingredientName.toLowerCase();
//        newIngredientProduct.vendorNameUnique = (lot.vendorNameUnique == null) ? '' : lot.vendorNameUnique;
//        newIngredientProduct.lotNumberUnique = lot.lotNumberUnique;
//        newIngredientProduct.lotId = lot._id;
//        newIngredientProduct.productName = formula.name;
//        newIngredientProduct.date = date;
//        newIngredientProduct.lotNumber = (formula.isIntermediate) ? 'IP'+date.getTime() : 'PR'+date.getTime();
//        console.log(newIngredientProduct);
//        newIngredientProduct.save(function(err){
//            callback();
////            updateIngredientProduct(req, res, next, ingredients, formula, date, i+1);
//        });
////    }
//};

