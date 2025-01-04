var Ingredient = require('mongoose').model('Ingredient');
var Vendor = require('mongoose').model('Vendor');
var User = require('mongoose').model('User');
var Storage = require('mongoose').model('Storage');
var utils = require('../utils/utils');
var logger = require('../utils/logger');
var fs = require('fs');
var Converter = require("csvtojson").Converter;

exports.bulkImportIngredients = function(req, res, next, contents, callback) {
    //console.log(contents);
    var jsonArray = [];
    const csv=require('csvtojson')
    csv({noheader:false})
    .fromString(contents)
    .on('json',(jsonObj)=>{
       jsonArray.push(jsonObj);
    })
    .on('done',()=>{
          console.log(jsonArray);
        User.findById(req.params.userId, function(err, user){
            validateBulkImport(req, res, next, jsonArray, 0, 0, 0, 0, function(){
                //do bulk import
                doBulkImport(user.username, req, res, next, jsonArray, 0, function(){
                    res.send("Bulk import success!");
                    callback();
                });
            })
        });

    })
};

//var checkSpaces = function(res, next, wSpace, rSpace, fSpace, callback) {
//    Storage.find({}, function(err, objs){
//        if (err) next(err);
//        else {
//            for (var i = 0; i < objs.length; i++) {
//                var obj = objs[i];
//                console.log(obj.temperatureZone);
//                if (obj.temperatureZone == 'warehouse' && wSpace > obj.currentEmptySpace) {
//                    res.status(400).send('Capacity left: '+obj.currentEmptySpace+' sqft will be exceeded for '+ obj.temperatureZone +
//                    '. The total space that will be occupied by items in your cart for this temperature is '+ wSpace+'.');
//                    return;
//                }
//                if (obj.temperatureZone == 'refrigerator' && rSpace > obj.currentEmptySpace) {
//                    res.status(400).send('Capacity left: '+obj.currentEmptySpace+' sqft will be exceeded for '+ obj.temperatureZone +
//                    '. The total space that will be occupied by items in your cart for this temperature is '+ rSpace+'.');
//                    return;
//                }
//                if (obj.temperatureZone == 'freezer' && fSpace > obj.currentEmptySpace) {
//                    res.status(400).send('Capacity left: '+obj.currentEmptySpace+' sqft will be exceeded for '+ obj.temperatureZone +
//                    '. The total space that will be occupied by items in your cart for this temperature is '+ fSpace+'.');
//                    return;
//                }
//            }
//            console.log(wSpace+' '+rSpace+' '+fSpace);
//            callback();
//        }
//    });
//};

//var updateStorage = function(wSpace, rSpace, fSpace) {
//    Storage.findOne({temperatureZone: 'warehouse'}, function(err, storage){
//        var capacity = storage.capacity;
//        var newOccupied = storage.currentOccupiedSpace + wSpace;
//        var newEmpty = capacity - newOccupied;
//        storage.update({currentOccupiedSpace: newOccupied, currentEmptySpace: newEmpty}, function(err, obj){
//
//        });
//    });
//    Storage.findOne({temperatureZone: 'refrigerator'}, function(err, storage){
//        var capacity = storage.capacity;
//        var newOccupied = storage.currentOccupiedSpace + rSpace;
//        var newEmpty = capacity - newOccupied;
//        storage.update({currentOccupiedSpace: newOccupied, currentEmptySpace: newEmpty}, function(err, obj){
//
//        });
//    });
//    Storage.findOne({temperatureZone: 'freezer'}, function(err, storage){
//        var capacity = storage.capacity;
//        var newOccupied = storage.currentOccupiedSpace + fSpace;
//        var newEmpty = capacity - newOccupied;
//        storage.update({currentOccupiedSpace: newOccupied, currentEmptySpace: newEmpty}, function(err, obj){
//
//        });
//    });
//};

var validateBulkImport = function(req, res, next, array, i, wSpace, rSpace, fSpace, callback){
    if (i == array.length) {
//        checkSpaces(res, next, wSpace, rSpace, fSpace, function(){
//            updateStorage(wSpace, rSpace, fSpace);
            callback();
//        });
    }
    else {
        var ingredient = array[i];
        //console.log(ingredient);
        var ingredientName = ingredient.INGREDIENT;
        var packageName = ingredient.PACKAGE;
        var vendorCode = ingredient["VENDOR FREIGHT CODE"];
        var vendorPrice = ingredient["PRICE PER PACKAGE"];
        var nativeUnit = ingredient["NATIVE UNIT"];
        var numUnitPerPackage = ingredient["UNITS PER PACKAGE"];
//        var amount = ingredient["AMOUNT (NATIVE UNITS)"];
        var temperatureZone = ingredient.TEMPERATURE;

        if (ingredientName == null || ingredientName == '') {
            res.status(400).send('Action denied on item '+(i+1)+' ('+ingredientName+'). Ingredient name cannot be empty');
            return;
        }
        if (packageName == null || packageName == '') {
            res.status(400).send('Action denied on item '+(i+1)+' ('+ingredientName+'). Package name cannot be empty');
            return;
        }
        if (vendorPrice == null || vendorPrice <= 0) {
            res.status(400).send('Action denied on item '+(i+1)+' ('+ingredientName+'). Price cannot be empty or zero');
            return;
        }
        if (nativeUnit == null || nativeUnit == '') {
            res.status(400).send('Action denied on item '+(i+1)+' ('+ingredientName+'). Native unit cannot be empty');
            return;
        }
        if (numUnitPerPackage == null || numUnitPerPackage <=0) {
            res.status(400).send('Action denied on item '+(i+1)+' ('+ingredientName+'). Unit per package name cannot be empty');
            return;
        }
//        if (amount == null || amount < 0) amount = 0;
        if (temperatureZone == null || temperatureZone == '') {
            res.status(400).send('Action denied on item '+(i+1)+' ('+ingredientName+'). Temperature zone cannot be empty');
            return;
        }

        var packageName = ingredient.PACKAGE.toLowerCase();
        var vendorCode = ingredient["VENDOR FREIGHT CODE"].toLowerCase();
        var temperatureZone = ingredient.TEMPERATURE.toLowerCase();

        if (temperatureZone == 'room temperature') temperatureZone = 'warehouse';
        else if (temperatureZone == 'frozen') temperatureZone = 'freezer';
        else if (temperatureZone == 'refrigerated') temperatureZone = 'refrigerator';
        else {
            res.status(400).send('Temperature "'+ingredient.TEMPERATURE+'" is not defined.');
            return;
        }
        //console.log("processing "+ingredientName);

        Ingredient.findOne({nameUnique: ingredientName.toLowerCase()}, function(err, obj){
            console.log("processing "+ingredientName);
            console.log(obj);
            if (err) return next(err);
            else if (obj) {
                console.log("ingredient "+ingredientName+" already exists");
                if (obj.temperatureZone != temperatureZone) {
                    res.status(400).send('Action denied on item '+(i+1)+' ('+ingredientName+'). Ingredient '+ingredientName+' can only be stored in '+obj.temperatureZone+'.');
                    return;
                } else if (obj.nativeUnit != nativeUnit.toLowerCase()) {
                    res.status(400).send('Action denied on item '+(i+1)+' ('+ingredientName+'). Ingredient '+ingredientName+' - native unit should be '+obj.nativeUnit+'.');
                    return;
                } else if (obj.numUnitPerPackage != numUnitPerPackage) {
                    res.status(400).send('Action denied on item '+(i+1)+' ('+ingredientName+'). Ingredient '+ingredientName+' - unit per package should be '+obj.numUnitPerPackage+'.');
                    return;
                } else if (obj.packageName != packageName) {
                    res.status(400).send('Action denied on item '+(i+1)+' ('+ingredientName+'). Ingredient '+ingredientName+' - package name should be '+obj.numUnitPerPackage+'.');
                    return;
                }
            }
            else {
                console.log("ingredient "+ingredientName+" does not exist");
            }

            if (vendorCode == null || vendorCode == '') {
//                Storage.findOne({temperatureZone: temperatureZone}, function(err, obj3){
//                    if (err) return next(err);
//                    else {
//                        if (obj3.currentEmptySpace < amount && packageName!='railcar' && packageName!='truckload') {
//                            res.status(400).send('Action denied on item '+(i+1)+' ('+ingredientName+'). Storage limit '+obj3.currentEmptySpace+' left for '+temperatureZone+' would be exceeded.');
//                            return;
//                        }
//                        else {
                            Ingredient.getPackageSpace(packageName, function(singleSpace){
                                if (singleSpace == -1) {
                                    res.status(400).send('Action denied on item '+(i+1)+' ('+ingredientName+'). Ingredient '+ingredientName+' - package name does not exist.');
                                    return;
                                } else {
//                                    var space = singleSpace*Math.ceil(1.0*amount/numUnitPerPackage);
//                                    if (temperatureZone == 'warehouse' && packageName != 'railcar' && packageName != 'truckload') wSpace += space;
//                                    else if (temperatureZone == 'refrigerator' && packageName != 'railcar' && packageName != 'truckload') rSpace += space;
//                                    else if (temperatureZone == 'freezer' && packageName != 'railcar' && packageName != 'truckload') fSpace += space;
//                                    else if (temperatureZone != 'warehouse' && temperatureZone != 'refrigerator' && temperatureZone != 'freezer') {
//                                        res.status(400).send('Temperature zone '+temperatureZone+' does not exist.');
//                                        return;
//                                    }
                                    validateBulkImport(req, res, next, array, i+1, wSpace, rSpace, fSpace, callback)
                                }
                            });
//                        }
//                    }
//                });
            } else {
                Vendor.findOne({codeUnique: vendorCode}, function(err, obj2){ //need to check if vendor already selling it
                    if (err) return next(err)
                    else if (!obj2) {
                        res.status(400).send('Action denied on item '+(i+1)+' ('+ingredientName+'). Vendor '+vendorCode+' does not exist.');
                        return;
                    } else {
//                        Storage.findOne({temperatureZone: temperatureZone}, function(err, obj3){
//                            if (err) return next(err);
//                            else {
//                                if (obj3.currentEmptySpace < amount && packageName!='railcar' && packageName!='truckload') {
//                                    res.status(400).send('Action denied on item '+(i+1)+' ('+ingredientName+'). Storage limit '+obj3.currentEmptySpace+' left for '+temperatureZone+' would be exceeded.');
//                                    return;
//                                }
//                                else {
                                    Ingredient.getPackageSpace(packageName, function(singleSpace){
                                        if (singleSpace == -1) {
                                            res.status(400).send('Action denied on item '+(i+1)+' ('+ingredientName+'). Ingredient '+ingredientName+' - package name does not exist.');
                                            return;
                                        } else {
//                                            var space = singleSpace*Math.ceil(1.0*amount/numUnitPerPackage);
//                                            if (temperatureZone == 'warehouse' && packageName != 'railcar' && packageName != 'truckload') wSpace += space;
//                                            else if (temperatureZone == 'refrigerator' && packageName != 'railcar' && packageName != 'truckload') rSpace += space;
//                                            else if (temperatureZone == 'freezer' && packageName != 'railcar' && packageName != 'truckload') fSpace += space;
//                                            else if (temperatureZone != 'warehouse' && temperatureZone != 'refrigerator' && temperatureZone != 'freezer'){
//                                                res.status(400).send('Temperature zone '+temperatureZone+' does not exist.');
//                                                return;
//                                            }
                                            validateBulkImport(req, res, next, array, i+1, wSpace, rSpace, fSpace, callback);
                                        }
                                    });
//                                }
//                            }
//                        });
                    }
                });
            }
        });
    }
};

var doBulkImport = function(username, req, res, next, array, i, callback){ // TODO: update inventory and storage
    if (i == array.length)
        callback();
    else {
        var ingredient = array[i];
        //console.log(ingredient);
        var ingredientName = ingredient.INGREDIENT;
        var packageName = ingredient.PACKAGE.toLowerCase();
        var vendorCode = ingredient["VENDOR FREIGHT CODE"].toLowerCase();
        var vendorPrice = ingredient["PRICE PER PACKAGE"];
        var nativeUnit = ingredient["NATIVE UNIT"];
        var numUnitPerPackage = ingredient["UNITS PER PACKAGE"];
//        var amount = ingredient["AMOUNT (NATIVE UNITS)"];
        var temperatureZone = ingredient.TEMPERATURE.toLowerCase();

//        if (!amount || amount < 0) amount = 0;
        if (temperatureZone == 'room temperature') temperatureZone = 'warehouse';
        else if (temperatureZone == 'frozen') temperatureZone = 'freezer';
        else if (temperatureZone == 'refrigerated') temperatureZone = 'refrigerator';
        else {
            res.status(400).send('Temperature "'+ingredient.TEMPERATURE+'" is not defined.');
            return;
        }
        //console.log("processing "+ingredientName);
        Ingredient.findOne({nameUnique: ingredientName.toLowerCase()}, function(err, obj){
//            Ingredient.getPackageSpace(packageName, function(singleSpace){
//                var space = singleSpace*Math.ceil(1.0*amount/numUnitPerPackage);

                console.log("processing "+ingredientName);
                console.log(obj);
                if (err) return next(err);
                else if (obj) {
                    console.log("ingredient "+ingredientName+" already exists");
                    if (vendorCode != null && vendorCode != '') {
                        Vendor.findOne({codeUnique: vendorCode}, function(err, obj2){ //need to check if vendor already selling it
                            var vendors = obj.vendors;
                            if (vendors == null || vendors.length == 0)
                                vendors = [];
                            console.log("old vendors");
                            console.log(vendors);
                            var newVendor = new Object();
                            newVendor.codeUnique = vendorCode;
                            newVendor.vendorName = obj2.name;
                            newVendor.vendorId = obj2._id;
                            newVendor.price = Number(vendorPrice);
                            vendors.push(newVendor);

//                        console.log(obj.space+' '+space+' '+obj.numUnit+' '+amount);
//                            var newSpace = Number(obj.space) + Number(space);
//                            var newNumUnit = Number(obj.numUnit) + Number(amount);
//                            obj.update({vendors: vendors, space: newSpace, numUnit:newNumUnit}, function(err, obj3){
                            obj.update({vendors: vendors}, function(err, obj3){
                                if (err) return next(err);
                                logger.log(username, 'update', obj, Ingredient);
                                doBulkImport(username, req, res, next, array, i+1, callback);
                            })
                        });
                    }
                }
                else {
                    console.log("ingredient "+ingredientName+" does not exist");
                    if (vendorCode != null && vendorCode != '') {
                        Vendor.findOne({codeUnique: vendorCode}, function(err, obj2){ //need to check if vendor already selling it
                            var vendors = [];
                            var newVendor = new Object();
                            newVendor.codeUnique = vendorCode;
                            newVendor.vendorName = obj2.name;
                            newVendor.vendorId = obj2._id;
                            newVendor.price = Number(vendorPrice);
                            vendors.push(newVendor);

                            var newIngredient = new Ingredient();
                            newIngredient.name = ingredientName;
                            newIngredient.nameUnique = ingredientName.toLowerCase();
                            newIngredient.nativeUnit = nativeUnit.toLowerCase();
                            newIngredient.numUnitPerPackage = numUnitPerPackage;
                            newIngredient.packageName = packageName;
                            newIngredient.temperatureZone = temperatureZone;
                            newIngredient.vendors = vendors;
                            newIngredient.isIntermediate = false;
//                            newIngredient.space = space;
//                            newIngredient.numUnit = amount;

                            newIngredient.save(function(err){
                                if (err) return next(err);
                                logger.log(username, 'create', newIngredient, Ingredient);
                                doBulkImport(username, req, res, next, array, i+1, callback);
                            });
                        });
                    } else {
                        var newIngredient = new Ingredient();
                        newIngredient.name = ingredientName;
                        newIngredient.nameUnique = ingredientName.toLowerCase();
                        newIngredient.nativeUnit = nativeUnit.toLowerCase();
                        newIngredient.numUnitPerPackage = numUnitPerPackage;
                        newIngredient.packageName = packageName;
                        newIngredient.temperatureZone = temperatureZone;
                        newIngredient.vendors = [];
                        newIngredient.isIntermediate = false;
//                        newIngredient.space = space;
//                        newIngredient.numUnit = amount;

                        newIngredient.save(function(err){
                            if (err) return next(err);
                            logger.log(username, 'create', newIngredient, Ingredient);
                            doBulkImport(username, req, res, next, array, i+1, callback);
                        });
                    }
                }
//            });
        });
    }
};
