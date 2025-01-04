var mongoose = require('mongoose'),
    Ingredient = require('mongoose').model('Ingredient'),
	Schema = mongoose.Schema;

var IngredientQuantitySchema = new Schema({
    ingredientName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    nativeUnit: {
        type: String,
        required: true
    },

});
mongoose.model('IngredientQuantity', IngredientQuantitySchema);

//var ProductionLineInFormulaSchema = new Schema({
//    productionLineName: {
//        type: String,
//        required: true
//    },
//    productionLineId: {
//        type: String,
//        required: true
//    }
//});
//mongoose.model('ProductionLineInFormula', ProductionLineInFormulaSchema);

var FormulaSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    nameUnique: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
    },
    unitsProvided: {
        type: Number,
        required: true
    },
    totalProvided: {
        type: Number,
        required: true,
        default: 0
    },
    totalCost: {
        type: Number,
        required: true,
        default: 0
    },
    isIntermediate: {
        type: Boolean,
        required: true
    },
    packageName: {
        type: String,
        enum: ['sack', 'pail', 'drum', 'supersack', 'truckload', 'railcar', ''],
        lowercase: true
    },
    temperatureZone: {
        type: String,
        enum: ['freezer', 'refrigerator', 'warehouse', '']
    },
    nativeUnit: {
        type: String,
        //
    },
    numUnitPerPackage: {
        type: Number,
        //
    },
    productionLines: [{
        type: String,
    }],
    ingredients : [IngredientQuantitySchema]
});

//FormulaSchema.pre('save',
//	function(next) {
//	    if (this.totalCost)
//	        this.totalCost = this.totalCost - this.totalCost % 0.01;
//	    next();
//	}
//);
//
//FormulaSchema.pre('update',
//	function(next) {
//	    if (this._update.totalCost)
//	        this._update.totalCost = this._update.totalCost - this._update.totalCost % 0.01;
//	    next();
//	}
//);

var LIKE_NULL = '13d2aeca-54e8-4d37-9127-6459331ed76d';

var conditionalRequire = {
  validator: function (value) {
    return this.type === 'other' && val === LIKE_NULL;
  },
  msg: 'Some message',
};

var Model = mongoose.Schema({
  type: { type: String },
  someField: { type: String, default: LIKE_NULL, validate: conditionalRequire },
});

// Under no condition should the "like null" value actually get persisted
Model.pre("save", function (next) {
  if (this.someField == LIKE_NULL) this.someField = null;

  next()
});


mongoose.model('Formula', FormulaSchema);