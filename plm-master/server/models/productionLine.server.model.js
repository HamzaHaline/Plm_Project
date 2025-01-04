var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var IngredientLotUsedInProductSchema2 = new Schema({
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
mongoose.model('IngredientLotUsedInProduct2', IngredientLotUsedInProductSchema2);

var DateTupleSchema = new Schema({
    startDate: Date,
    endDate: Date
});
mongoose.model('DateTuple', DateTupleSchema);

var ProductionLineSchema = new Schema({
	name: {
	    type: String,
	    required: true
	},
	nameUnique: {
        type: String,
        required: true
    },
	description: {
	    type: String
	},
	formulaNames: [{
	    type: String,
	    required: true
	}],
    isIdle: {
        type: Boolean,
        required: true
    },
    currentFormula: {
        type: String,
    },
    lotNumber: String,
    dates: [DateTupleSchema],
    quantity: Number,
    newSpentMoney: Number,
    totalSpace: Number,
    arrayInProductOut: [IngredientLotUsedInProductSchema2]

});

ProductionLineSchema.index({ nameUnique: 1, lotNumberUnique: 1, date: 1}, { unique: true });

ProductionLineSchema.methods.getUtility = function(startTime, endTime, callback) {
    var totalTime = endTime - startTime;
    var totalBusy = 0;
    var startFound = false;
    var tempIndex;

    if (!this.dates || this.dates.length == 0) callback(0);
    else {
        for (var i = 0; i < this.dates.length; i++) {
            var tempDate = this.dates[i];
            var tempStartTime = tempDate.startDate.getTime();
            if (tempStartTime > startTime) {
                startFound = true;
                tempIndex = i;
                break;
            }
        }
        console.log("startTime: "+startTime);
        console.log("endTime: "+endTime);
        console.log("startFound: "+startFound);
        console.log("totalTime: "+totalTime);

        if (startFound && i != 0 || !startFound) {
            console.log("ASDSADASDASd");
            console.log(this);
            var tempEndTime = this.dates[i-1].endDate;
            if (tempEndTime > startTime) {
                totalBusy += tempEndTime - startTime;
            }
        }

        console.log("totalBusy: "+totalBusy);

        for (var i = tempIndex; i < this.dates.length; i++) {
            var tempDate = this.dates[i];
            var tempStartTime = tempDate.startDate.getTime();
            if (!tempDate.endDate) {
                totalBusy += endTime - tempStartTime;
            } else {
                var tempEndTime = tempDate.endDate.getTime();
                totalBusy += tempEndTime - tempStartTime;
                console.log("totalBusy: "+totalBusy);
            }
        }

        var eff = Math.ceil(totalBusy/totalTime*10000)/100;
        callback(eff);
    }
}

mongoose.model('ProductionLine', ProductionLineSchema);
