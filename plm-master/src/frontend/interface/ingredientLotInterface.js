//ingredientLotInterface.js
//This interface is to be used by the front-end
//It accepts string input as texts that follows the data-base schema
//creates the corresponding json object if necessary
//and calls actions to send the actual requests
import * as ingredientLotActions from '../actions/ingredientLotAction'
import axios from 'axios'
/**
takes in various properties of ingredientLot,
returns a Json object that encapsulates all properties
name: string
contact: string
code: string
ingredients: an array of objects following IngredientPriceSchema
**/
function packIntoJson(ingredientName, ingredientId, numUnit, date, lotNumber, vendorName){
	var ingredientLotJson = new Object();
	ingredientLotJson.ingredientName = ingredientName;
	ingredientLotJson.numUnit = numUnit;
	ingredientLotJson.ingredientId = ingredientId;
	ingredientLotJson.date = date;
	ingredientLotJson.lotNumber = lotNumber;
	ingredientLotJson.vendorName = vendorName;
	// ingredientLotJson.ingredients = ingredients;
	console.log("Ingredient JSON");
	console.log(ingredientLotJson);
	// console.log(dummyIngredientLot.sampleIngredientLot);
	return ingredientLotJson;
}

/* add one ingredientLot
 * for arguments see packIntoJson
 * sessionId: string, id of the current session
 */
async function addIngredientLot(ingredientName, ingredientId, numUnit, date, lotNumber, vendorName, sessionId, callback) {
	var newIngredientLot = packIntoJson(ingredientName, ingredientId, numUnit, date, lotNumber, vendorName);
//	try{
//		return await ingredientLotActions.addIngredientLot(newIngredientLot, sessionId);
//	} catch (e) {
//		throw e;
//	}
    ingredientLotActions.addIngredientLot(newIngredientLot, sessionId, function(res){
        callback(res);
    });
	
}

/**
 * get all ingredientLots
 * sessionId: string, id of the current session
**/
async function getAllIngredientLotsAsync(sessionId) {
	console.log("Interface: getAllIngredientLotsAsync()");
	console.log("sessionId: " + sessionId);
	return await ingredientLotActions.getAllIngredientLotsAsync(sessionId);
}

async function getAllIngredientLotNamesCodesAsync(sessionId) {
   const res = await axios.get('/ingredientLots/ingredientLotNames/user/'+sessionId);
   return res;
}

/*
 * get one ingredientLot
 * ingredientLotId: string, the id of the ingredientLot
 * sessionId: string, id of the current session
 */
async function getIngredientLotAsync(ingredientLotId, sessionId) {
	return await ingredientLotActions.getIngredientLotAsync(ingredientLotId, sessionId);
};

/*
 * update one ingredientLot
 * ingredientLotId: string, the id of the ingredientLot
 * other arguments: see packIntoJson()
 * sessionId: string, id of the current session
 */
async function updateIngredientLot(ingredientName, ingredientLotId, numUnit, date, lotNumber, vendorName, sessionId, callback) {
	var updatedIngredientLot = packIntoJson(ingredientName, ingredientLotId, numUnit, date, lotNumber, vendorName);
	//return await ingredientLotActions.updateIngredientLot(ingredientLotId, sessionId, updatedIngredientLot);
	ingredientLotActions.updateIngredientLot(ingredientLotId, sessionId, updatedIngredientLot, function(res){
        callback(res);
    });
};

/*
 * delete one existing ingredientLot
 * ingredientLotId: string, the id of the ingredientLot
 * sessionId: string, id of the current session
 */
async function deleteIngredientLot(ingredientLotId, sessionId) {
	return await ingredientLotActions.deleteIngredientLot(ingredientLotId,sessionId);
};

//export functions above for use by other modules
export { addIngredientLot, getAllIngredientLotsAsync, getIngredientLotAsync, updateIngredientLot, deleteIngredientLot, getAllIngredientLotNamesCodesAsync};
