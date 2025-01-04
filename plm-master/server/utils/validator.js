var mongoose = require('mongoose');
var User = mongoose.model('User');
var Order = mongoose.model('Order');
var Vendor = mongoose.model('Vendor');
var Ingredient = mongoose.model('Ingredient');
var Storage = mongoose.model('Storage');
var ProductionLine = mongoose.model('ProductionLine');

exports.validate = function(model, itemId, item, res, next, callback) {
    console.log(item);
    if (model == Storage) {
        validateStorage(item, res, next, function(err, obj){
            if (err) return next(err);
            else {
                callback(err, obj);
            }
        });
    }
    else if (model == Ingredient) {
         validateIngredient(itemId, item, res, next, function(err, obj){
              if (err) return next(err);
              else {
                  callback(err, obj);
              }
         });
    }
    else if (model == ProductionLine) {
         validateProductionLine(itemId, item, res, next, function(err, obj){
              if (err) return next(err);
              else {
                  callback(err, obj);
              }
         });
    }
    else {
        callback(false, true);
    }
};

var validateStorage = function(item, res, next, callback) { //check if capacity below inventory quantity
    var capacity = item.capacity;
    if (capacity < item.currentOccupiedSpace)
        return res.status(400).send("Action denied. Capacity cannot be below current storage.");
    else
        callback(false, true);
};

var validateIngredient = function(itemId, item, res, next, callback) { //check if ingredient haa vendors that doesn't exist
    console.log('validating ingredient '+item.name);
    console.log(item);
    var temperatureZone = item.temperatureZone;
    var space = item.space;
    Ingredient.findById(itemId, function(err, oldIngredient){
        if (oldIngredient) {
            var oldSpace = oldIngredient.space;
            Storage.findOne({temperatureZone: temperatureZone}, function(err, storage){
                var currentEmptySpace = storage.currentEmptySpace;
                if (space - oldSpace > currentEmptySpace) {
                    return res.status(400).send('Action denied. New space cannot exceed current empty space '+currentEmptySpace+' for '+temperatureZone+'.');
                } else {
                    callback(err, true);
                }
            });
        } else {
            callback(err, true);
        }
    });
};

var validateProductionLine = function(itemId, item, res, next, callback) { //check if capacity below inventory quantity
   ProductionLine.findById(itemId, function(err, oldProductionLine){
       var newProductionLine = item;
       var newFormulas = newProductionLine.formulaNames;
       var currentFormula = newProductionLine.currentFormula;
       if (oldProductionLine && oldProductionLine.formulaNames.includes(currentFormula) && !newFormulas.includes(currentFormula)){
            return res.status(400).send('Action denied. Prodcution Line is currently producing '+currentFormula+'. Cannot delete it from the formula list');
       } else {
            callback(null, true);
       }
   });
};