var mongoose = require('mongoose'),
    Ingredient = require('mongoose').model('Ingredient'),
	Schema = mongoose.Schema;

var IngredientFreshnessSchema = new Schema({
	ingredientName: {
	    type: String,
	    required: true
	},
	ingredientNameUnique: {
        type: String,
        required: true,
        unique: true
    },
    oldestMilli: {
        type: Number,
        required: true,
        default: 0
    },
	oldestDay: {
	    type: Number,
	    required: true,
	    default: 0
	},
	oldestHour: {
        type: Number,
        required: true,
        default: 0
    },
    oldestMinute: {
        type: Number,
        required: true,
        default: 0
    },
    averageMilli: {
        type: Number,
        required: true,
        default: 0
    },
	averageDay: {
        type: Number,
        required: true,
        default: 0
    },
    averageHour: {
        type: Number,
        required: true,
        default: 0
    },
    averageMinute: {
        type: Number,
        required: true,
        default: 0
    }
});

mongoose.model('IngredientFreshness', IngredientFreshnessSchema);