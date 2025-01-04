var mongoose = require('mongoose'),
    Vendor = require('mongoose').model('Vendor'),
	Schema = mongoose.Schema;

var VendorPriceSchema = new Schema({
    codeUnique: {
        type: String,
        required: true
    },
    vendorName: {
        type: String,
        required: true
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative'],
    }
});
mongoose.model('VendorPrice', VendorPriceSchema);

var IngredientSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    nameUnique: {
        type: String,
        unique: true
    },
    packageName: {
        type: String,
        enum: ['sack', 'pail', 'drum', 'supersack', 'truckload', 'railcar'],
        lowercase: true,
        required: true
    },
    temperatureZone: {
        type: String,
        enum: ['freezer', 'refrigerator', 'warehouse'],
        required: true
    },
    moneySpent: {
        type: Number,
        default: 0
    },
    moneyProd: {
        type: Number,
        default: 0
    },
    nativeUnit: {
        type: String,
        required: true
    },
    numUnitPerPackage: {
        type: Number,
        required: true,
        min: [0, 'Number cannot be negative'],
    },
    numUnit: {
        type: Number,
        required: true,
        default: 0
    },
    space: {
        type: Number,
        required: true,
        default: 0
    },
    isIntermediate: {
        type: Boolean,
        required: true
    },
    vendors : [VendorPriceSchema]
});

//IngredientSchema.index({ name: 1, packageName: 1}, { unique: true });

IngredientSchema.statics.getPackageSpace = function(packageName, callback) {
    if (packageName == 'sack')
        callback(0.5);
    else if (packageName == 'pail')
        callback(1);
    else if (packageName == 'drum')
        callback(3);
    else if (packageName == 'supersack')
        callback(16);
    else if (packageName == 'truckload')
        callback(0);
    else if (packageName == 'railcar')
        callback(0);
    else
        callback(-1);
};

//IngredientSchema.pre('save',
//	function(next) {
//	    if (this.moneySpent)
//	        this.moneySpent = this.moneySpent - this.moneySpent % 0.01;
//        if (this.moneyProd)
//	        this.moneyProd = this.moneyProd - this.moneyProd % 0.01;
//	    next();
//	}
//);
//
//IngredientSchema.pre('update',
//	function(next) {
//	    if (this._update.moneySpent)
//	        this._update.moneySpent = this._update.moneySpent - this._update.moneySpent % 0.01;
//        if (this._update.moneyProd)
//	        this._update.moneyProd = this._update.moneyProd - this._update.moneyProd % 0.01;
//	    next();
//	}
//);

mongoose.model('Ingredient', IngredientSchema);