var mongoose = require('mongoose'),
    Ingredient = require('mongoose').model('Ingredient'),
	Schema = mongoose.Schema;

var StorageSchema = new Schema({
//	ingredientId: {
//		type: mongoose.Schema.Types.ObjectId,
//        ref: 'Ingredient',
//        required: true
//	},
	temperatureZone: {
	    type: String,
	    enum: ['freezer', 'refrigerator', 'warehouse'],
	    required: true,
	    unique: true
	},
	capacity: { // in pounds
	    type: Number,
	    required: true
	},
	currentEmptySpace: {
	    type: Number,
	    default: 0
	},
	currentOccupiedSpace: {
        type: Number,
        default: 0
    },

});
//StorageSchema.index({ ingredientId: 1, temperatureZone: 1}, { unique: true });

mongoose.model('Storage', StorageSchema);