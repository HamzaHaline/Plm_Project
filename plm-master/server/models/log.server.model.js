var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var LogSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true,
    },
    item: {
        type: String,
        required: true,
    },
    itemId: {
        type: String,
        required: true,
    },
    date : {
        type: Date,
        required: true,
    },
});

mongoose.model('Log', LogSchema);