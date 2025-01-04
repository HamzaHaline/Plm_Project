var Ingredient = require('mongoose').model('Ingredient');
var Formula = require('mongoose').model('Formula');
var Vendor = require('mongoose').model('Vendor');
var User = require('mongoose').model('User');
var Storage = require('mongoose').model('Storage');
var utils = require('../utils/utils');
var logger = require('../utils/logger');
var fs = require('fs');
var Converter = require("csvtojson").Converter;

var prevFormula = '';
var allFormulas = [];

exports.bulkImportIntermediates = function(req, res, next, contents, callback) {
    prevFormula = '';
    allFormulas = [];
    //console.log(contents);
    var jsonArray = [];
    const csv=require('csvtojson')
    csv({noheader:false})
    .fromString(contents)
    .on('json',(jsonObj)=>{
       jsonArray.push(jsonObj);
    })
    .on('done',()=>{
//          console.log(jsonArray);
        User.findById(req.params.userId, function(err, user){
            validateBulkImport(req, res, next, jsonArray, 0, function(){
                //do bulk import
                doBulkImport(user.username, req, res, next, jsonArray, 0, function(){
                    res.send("Bulk import Success!");
                    callback();
                });
            });
        });
    })
};

var validateBulkImport = function(req, res, next, array, i, callback){
    if (i == array.length) {
        formulaName = '';
        callback();
    }
    else {
        var formula = array[i];
        //console.log(formula);
        var formulaName = formula.NAME;
        var unitsProvided = formula["PRODUCT UNITS"];
        var description = formula.DESCRIPTION;
        var ingredientName = formula.INGREDIENT;
        var ingredientUnits = formula["INGREDIENT UNITS"];

        var packageName = formula.PACKAGE.toLowerCase();
        var nativeUnit = formula["NATIVE UNIT"];
        var numUnitPerPackage = formula["UNITS PER PACKAGE"];
        var temperatureZone = formula.TEMPERATURE;

        if (formulaName.toLowerCase() != prevFormula && allFormulas.includes(formulaName.toLowerCase())){
            console.log(formulaName);
            console.log(allFormulas);
            res.status(400).send('Action denied on item '+(i+1)+' ('+formulaName+'). Duplicate formula names exist (the same formula should be in consecutive rows).');
            return;
        }

        if (formulaName == null || formulaName == '') {
            res.status(400).send('Action denied on item '+(i+1)+' ('+formulaName+'). Formula name cannot be empty');
            return;
        }
        if (formulaName.toLowerCase() != prevFormula.toLowerCase() && (unitsProvided == null || unitsProvided <= 0)) {
            res.status(400).send('Action denied on item '+(i+1)+' ('+formulaName+'). Units provided cannot be empty or zero');
            return;
        }
        if (formulaName.toLowerCase() != prevFormula.toLowerCase() && (packageName == null || packageName == '')) {
            res.status(400).send('Action denied on item '+(i+1)+' ('+formulaName+'). Package name cannot be empty');
            return;
        }
        if (formulaName.toLowerCase() != prevFormula.toLowerCase() && (
            packageName != 'sack' &&
            packageName != 'pail' &&
            packageName != 'drum' &&
            packageName != 'supersack' &&
            packageName != 'railcar' &&
            packageName != 'truckload' )) {
            res.status(400).send('Action denied on item '+(i+1)+' ('+formulaName+'). Package name is invalid');
            return;
        }
        if (formulaName.toLowerCase() != prevFormula.toLowerCase() && (nativeUnit == null || nativeUnit == '')) {
            res.status(400).send('Action denied on item '+(i+1)+' ('+formulaName+'). Native unit cannot be empty');
            return;
        }
        if (formulaName.toLowerCase() != prevFormula.toLowerCase() && (numUnitPerPackage == null || numUnitPerPackage == '' || numUnitPerPackage <= 0)) {
            res.status(400).send('Action denied on item '+(i+1)+' ('+formulaName+'). Units per package must be non-empty and non-zero');
            return;
        }
        if (formulaName.toLowerCase() != prevFormula.toLowerCase() && (temperatureZone == null || temperatureZone == '')) {
            res.status(400).send('Action denied on item '+(i+1)+' ('+formulaName+'). Temperature cannot be empty');
            return;
        }
        if (formulaName.toLowerCase() != prevFormula.toLowerCase() && (temperatureZone.toLowerCase() != 'refrigerated' && temperatureZone.toLowerCase() != 'frozen' && temperatureZone.toLowerCase() != 'room temperature')) {
            res.status(400).send('Action denied on item '+(i+1)+' ('+formulaName+'). Temperature is invalid');
            return;
        }
        if (ingredientName == null || ingredientName == '') {
            res.status(400).send('Action denied on item '+(i+1)+' ('+formulaName+'). Ingredient name cannot be empty');
            return;
        }
        if (ingredientUnits == null || ingredientUnits <= 0) {
            res.status(400).send('Action denied on item '+(i+1)+' ('+formulaName+'). Ingredient units cannot be empty or zero');
            return;
        }
        if (Number(unitsProvided)%1!=0) {
            res.status(400).send('Action denied on item '+(i+1)+' ('+formulaName+'). Units provided must be an integer.');
            return;
        }

        var ingredientNameUnique = formula.INGREDIENT.toLowerCase();

        Formula.findOne({nameUnique: formulaName.toLowerCase()}, function(err, obj){
            if (err) return next(err);
            else if (obj) {
                res.status(400).send('Action denied on item '+(i+1)+' ('+formulaName+'). Formula already exists');
                return;
            }
            else {
                Ingredient.findOne({nameUnique: formulaName.toLowerCase()}, function(err, obj){
                      if (err) return next(err);
                      else if (obj) {
                          res.status(400).send('Action denied on item '+(i+1)+' ('+formulaName+'). Intermediate product already exists in stock');
                          return;
                      }
                      else {
                           Ingredient.findOne({nameUnique: ingredientNameUnique}, function(err, obj) {
                               if (err) return next(err);
                               else if (!obj) {
                                   res.status(400).send('Action denied on item '+(i+1)+' ('+formulaName+'). Ingredient '+formula.INGREDIENT+' does not exist.');
                                   return;
                               }
                               else {
                                   if (formulaName.toLowerCase() != prevFormula) {
                                       prevFormula = formulaName.toLowerCase();
                                       allFormulas.push(formulaName.toLowerCase());
                                   }
                                   validateBulkImport(req, res, next, array, i+1, callback);
                               }
                           });
                      }
                });
            }
        });
    }
};

var doBulkImport = function(username, req, res, next, array, i, callback){
    if (i == array.length)
        callback();
    else {
        var formula = array[i];
        //console.log(formula);
        var formulaName = formula.NAME;
        var unitsProvided = formula["PRODUCT UNITS"];
        var description = formula.DESCRIPTION;
        var ingredientName = formula.INGREDIENT;
        var ingredientUnits = formula["INGREDIENT UNITS"];

        var packageName = formula.PACKAGE.toLowerCase();
        var nativeUnit = formula["NATIVE UNIT"];
        var numUnitPerPackage = formula["UNITS PER PACKAGE"];
        var temperatureZone = formula.TEMPERATURE.toLowerCase();

        if (temperatureZone == 'room temperature') temperatureZone = 'warehouse';
        else if (temperatureZone == 'frozen') temperatureZone = 'freezer';
        else if (temperatureZone == 'refrigerated') temperatureZone = 'refrigerator';

        var ingredient = new Object();
        ingredient.ingredientName = ingredientName;
        ingredient.quantity = ingredientUnits;
        Ingredient.findOne({nameUnique: ingredientName.toLowerCase()}, function(err, oo){
            ingredient.nativeUnit = oo.nativeUnit;
            Formula.findOne({nameUnique: formulaName.toLowerCase()}, function(err, obj){
                if (err) next(err);
                else if (obj) {
                    console.log('Formula '+formulaName+' exists');
                    var ingredients = obj.ingredients;
                    ingredients.push(ingredient);
                    obj.update({ingredients: ingredients}, function(err, obj3){
                        if (err) return next(err);
                        else {
                            doBulkImport(username, req, res, next, array, i+1, callback);
                        }
                    });
                } else {
                    console.log('Formula '+formulaName+' does not exist yet');
                    var ingredients = [];
                    ingredients.push(ingredient);
                    var newFormula = new Formula();
                    newFormula.name = formulaName;
                    newFormula.nameUnique = formulaName.toLowerCase();
                    newFormula.description = description;
                    newFormula.unitsProvided = unitsProvided;
                    newFormula.packageName = packageName;
                    newFormula.nativeUnit = nativeUnit;
                    newFormula.ingredients = ingredients;
                    newFormula.numUnitPerPackage = numUnitPerPackage;
                    newFormula.temperatureZone = temperatureZone;
                    newFormula.isIntermediate = true;

                    newFormula.save(function(err){
                        if (err) return next(err);

                        else {
                            logger.log(username, 'create', newFormula, Formula);
                            doBulkImport(username, req, res, next, array, i+1, callback);
                        }
                    });
                }
            });
        });
    }
};