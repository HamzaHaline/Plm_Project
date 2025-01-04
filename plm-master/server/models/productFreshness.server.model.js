var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ProductFreshnessSchema = new Schema({
	productName: {
	    type: String,
	    required: true
	},
	productNameUnique: {
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

mongoose.model('ProductFreshness', ProductFreshnessSchema);