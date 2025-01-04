//ingredientInterface.js
//This interface is to be used by the front-end
//It accepts string input as texts that follows the data-base schema
//creates the corresponding json object if necessary
//and calls actions to send the actual requests
import * as dummyIngredient from '../dummyDatas/ingredient.js'
import * as ingredientActions from '../actions/ingredientAction'
import axios from 'axios'

/**
 * takes in various properties of ingredient,
 * returns a Json object that encapsulates all properties
 * name: string, the name of the ingredient
 * packageType: string 'Sack', 'Pail', 'Drum', 'Supersack', 'Truckload', 'Railcar', or lowercase
 * temperatureZone: string 'freezer', 'refrigerator', 'warehouse', 'Freezer', 'Refrigerator', 'Warehouse'
 * vendors: array of objects following the VendorPriceSchema
 * moneySpent: number, the total amount of money spent on purchasing this ingredient
 * moneyOnProduction: number, the total amount of money spent on the portion that were used in production
 * nativeUnit: string, the native unit of this ingredient, such as pounds, gallon
 * amountInNativeUnitPerPackage: number, amount in native unit per package.
**/
function packIntoJson(name, packageType, temperatureZone, vendors, moneySpent,
	moneyOnProduction, nativeUnit, amountInNativeUnitPerPackage, numUnit, space, isIntermediate){
	var ingredientJson = new Object();
	ingredientJson.name = name;
	ingredientJson.packageName = packageType;
	ingredientJson.temperatureZone = temperatureZone;
	ingredientJson.vendors = vendors;
	ingredientJson.moneySpent = moneySpent;
	ingredientJson.moneyProd = moneyOnProduction;
	ingredientJson.nativeUnit = nativeUnit;
	ingredientJson.numUnit = numUnit;
	ingredientJson.space = space;
	ingredientJson.numUnitPerPackage = amountInNativeUnitPerPackage;
	ingredientJson.isIntermediate = isIntermediate;
	console.log("An ingredient with the following details has been prepared to be \
		sent to the back-end:");
	console.log(ingredientJson);
	console.log("The ingredient has the following vendors:");
	console.log(vendors);
	return ingredientJson;
}

/* add one ingredient
 * for arguments see packIntoJson
 * sessionId: string, id of the current session
 * callback: function, function to be executed after attempting to add the ingredient to the database
 */
async function addIngredient(name, packageType, temperatureZone, vendors, moneySpent,
	moneyOnProduction, nativeUnit, amountInNativeUnitPerPackage, numUnit, space, isIntermediate, sessionId, callback) {
	console.log("add ingredient interface");
	var newIngredient = packIntoJson(name, packageType, temperatureZone, vendors, moneySpent,
	moneyOnProduction, nativeUnit, amountInNativeUnitPerPackage, numUnit, space, isIntermediate);
	//return await ingredientActions.addIngredient(newIngredient, sessionId);
	ingredientActions.addIngredient(newIngredient, sessionId, function(res){
	    callback(res);
	})
}

//async function bulkImport(object) {
//    try {
//        const res = await axios.post('/ingredients/bulkImport', object);
//        const result = res.data;
//        console.log(result);
//        callback(res);
//    }
//    catch(e) {
//      console.log('there was an error');
//      console.log(e);
//      //TODO: different error message for different types of error
//      if (e.response.status == 400 || e.response.status == 500)
//        callback(e.response);
//      else {
//        console.log(e.response);
//        throw e;
//      }
//    }
//}

/**
 * get all ingredients
 * sessionId: string, id of the current session
**/
async function getAllIngredientsAsync(sessionId) {
	return await ingredientActions.getAllIngredientsAsync(sessionId);
}

/*
 * get one ingredient
 * ingredientId: string, the id of the ingredient
 * sessionId: string, id of the current session
 */
async function getIngredientAsync(ingredientId, sessionId) {
	return await ingredientActions.getIngredientAsync(ingredientId, sessionId);
};

async function getAllIngredientNamesAsync(sessionId) {
   const res = await axios.get('/ingredients/ingredientNames/user/'+sessionId);
   return res;
}

async function getAllIngredientsOnlyAsync(sessionId) {
    const res = await axios.get('/ingredients/allIngredients/user/'+sessionId);
    return res;
}

async function getAllIntermediatesOnlyAsync(sessionId) {
    const res = await axios.get('/ingredients/allIntermediates/user/'+sessionId);
    return res;
}

async function getAllLotNumbersAsync(ingredientId, sessionId) {
    const res = await axios.get('/ingredients/allLotNumbers/ingredient/'+ingredientId+'/user/'+sessionId);
    return res;
}

async function getAllPRLotNumbersAsync(ingredientId, sessionId) {
    const res = await axios.get('/ingredients/listIngredientProductLotNumbers/ingredient/'+ingredientId+'/user/'+sessionId);
    return res;
}

async function getRecallAsync(lotId, sessionId) {
    const res = await axios.get('/ingredients/recall/lot/'+lotId+'/user/'+sessionId);
    return res;
}

async function getRecallAlternateAsync(lotNumber, ingredientName, vendorName, sessionId) {
    const res = await axios.get('/ingredients/recall/lot/'+lotNumber+'/ingredient/'+ingredientName+'/vendor/'+vendorName+'/user/'+sessionId);
    return res;
}

async function getFreshAsync(sessionId) {
    const res = await axios.get('/ingredients/fresh'+'/user/'+sessionId);
    return res;
}

async function editLotAsync(lotId, quantity, sessionId) {
    const res = await axios.put('/ingredients/lot/'+lotId+'/quantity/'+quantity+'/user/'+sessionId);
    return res;
}

/*
 * update one ingredient
 * ingredientId: string, the id of the ingredient
 * other arguments: see packIntoJson()
 * sessionId: string, id of the current session
 * callback: function, the function that will be executed after attempting to update the ingredient
 */
async function updateIngredient(ingredientId, name, packageType, temperatureZone, vendors, moneySpent,
	moneyOnProduction, nativeUnit, amountInNativeUnitPerPackage, numUnit, space, isIntermediate, sessionId, callback) {
	var updatedIngredient = packIntoJson(name, packageType, temperatureZone, vendors, moneySpent,
	moneyOnProduction, nativeUnit, amountInNativeUnitPerPackage, numUnit, space, isIntermediate);
	//return await ingredientActions.updateIngredient(ingredientId, sessionId, updatedIngredient);
	ingredientActions.updateIngredient(ingredientId, sessionId, updatedIngredient, function(res){
	    callback(res);
	})
};

/*
 * delete one existing ingredient
 * ingredientId: string, the id of the ingredient
 * sessionId: string, id of the current session
 */
async function deleteIngredient(ingredientId, sessionId, callback) {
	return await ingredientActions.deleteIngredient(ingredientId, sessionId, function(res){
	    callback(res);
	});
};

//export functions above for use by other modules

export { addIngredient, getAllIngredientsAsync, getIngredientAsync, updateIngredient, deleteIngredient, getAllIngredientNamesAsync,
getAllIngredientsOnlyAsync, getAllIntermediatesOnlyAsync, getAllLotNumbersAsync, getRecallAsync, getFreshAsync, editLotAsync,getRecallAlternateAsync, getAllPRLotNumbersAsync};

