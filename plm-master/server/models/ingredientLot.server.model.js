var mongoose = require('mongoose'),
    Ingredient = require('mongoose').model('Ingredient'),
	Schema = mongoose.Schema;

var IngredientLotSchema = new Schema({
	ingredientName: {
	    type: String,
	    required: true
	},
	ingredientNameUnique: { // auto
        type: String,
        required: true
    },
	ingredientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingredient',
        required: true
	},
	numUnit: {
	    type: Number,
	    required: true
	},
	nativeUnit: {
        type: String,
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
    vendorName : {
        type: String,
        //required: true
    },
    vendorNameUnique : {
        type: String,
        //required: true
    }
});

IngredientLotSchema.index({ ingredientNameUnique: 1, lotNumberUnique: 1, date: 1, vendorName: 1}, { unique: true });

IngredientLotSchema.statics.getOldestLot = function(res, ingredientNameUnique, callback) {
    this.find({ingredientNameUnique: ingredientNameUnique}, {}, {sort: {date: 1}}, function(err, lot){
        if (lot.length == 0) callback(null);
        else callback(lot[0]);
    });
};

mongoose.model('IngredientLot', IngredientLotSchema);