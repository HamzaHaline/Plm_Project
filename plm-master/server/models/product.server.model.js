var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var IngredientLotUsedInProductSchema = new Schema({
    ingredientName: {
        type: String,
    },
    vendorName: {
        type: String,
    },
    lotNumber: {
        type: String,
    },
    lotId: {
        type: String,
    }
});
mongoose.model('IngredientLotUsedInProduct', IngredientLotUsedInProductSchema);

var ProductSchema = new Schema({
	name: {
	    type: String,
	    required: true
	},
	nameUnique: {
        type: String,
        required: true
    },
	numUnit: {
	    type: Number,
	    required: true
	},
	date: {
	    type: Date,
	    required: true
	},
	lotNumber: {
        type: String,
        required: true
    },
    lotNumberUnique: { //auto
        type: String,
        required: true
    },
    numUnitLeft: {
        type: Number,
        required: true
    },
    empty: {
        type: Boolean,
        required: true,
        default: false
    },
    isIdle: {
        type: Boolean,
        default: false
    },
    productionLine: String,
    ingredients: [IngredientLotUsedInProductSchema]
});

ProductSchema.index({ nameUnique: 1, lotNumberUnique: 1, date: 1}, { unique: true });

ProductSchema.statics.getOldestLot = function(res, productNameUnique, callback) {
    console.log(productNameUnique);
    this.find({nameUnique: productNameUnique, empty: false}, {}, {sort: {date: 1}}, function(err, lot){
        console.log(lot);
        if (lot.length == 0) callback(null);
        else callback(lot[0]);
    });
};

mongoose.model('Product', ProductSchema);