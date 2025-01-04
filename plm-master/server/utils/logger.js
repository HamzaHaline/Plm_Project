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
var Log = mongoose.model('Log');
var ProductionLine = mongoose.model('ProductionLine');
var IngredientLot = mongoose.model('IngredientLot');
var IngredientProduct = mongoose.model('IngredientProduct');

exports.log = function(username, action, item, model){
    var log = new Log();
    console.log("LOGGING");
    log.username = username;
    log.action = action;
    log.itemId = item._id.toString();
    log.model = model.collection.collectionName;
    log.date = new Date();

    if (model == User)
        log.item = item.username;
    else if (model == Storage)
        log.item = item.temperatureZone;
    else if (model == Order)
        log.item = item.ingredientName;
    else if (model == IngredientLot)
        log.item = item.ingredientName;
    else
        log.item = item.name;

    log.save(function(err){
        return;
    });
};