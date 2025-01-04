//formulaInterface.js
//This interface is to be used by the front-end
//It accepts string input as texts that follows the data-base schema
//creates the corresponding json object if necessary
//and calls actions to send the actual requests
import * as formulaActions from '../actions/formulaAction'
import axios from 'axios'

/**
takes in various properties of formula,
returns a Json object that encapsulates all properties
name: string
packageType: string 'Sack', 'Pail', 'Drum', 'Supersack', 'Truckload', 'Railcar', or lowercase
temperatureZone: string 'freezer', 'refrigerator', 'warehouse', 'Freezer', 'Refrigerator', 'Warehouse'
vendors: array of objects following the VendorPriceSchema
**/
function packIntoJson(name, description, unitsProvided, ingredients, isIntermediate, packageName, temperatureZone, nativeUnit, numUnitPerPackage, productionLines){
	var formulaJson = new Object();
	formulaJson.name = name;
	formulaJson.description = description;
	formulaJson.ingredients = ingredients;
	formulaJson.unitsProvided = unitsProvided;
	formulaJson.isIntermediate = isIntermediate;
	formulaJson.numUnitPerPackage = numUnitPerPackage;
	formulaJson.nativeUnit = nativeUnit;
	formulaJson.packageName = packageName;
	formulaJson.temperatureZone = temperatureZone;
	formulaJson.productionLines = productionLines;
	//console.log(ingredients);
	return formulaJson;
}

/* add one formula
 * for arguments see packIntoJson
 * sessionId: string, id of the current session
 */
async function addFormula(name, description, unitsProvided, ingredients, isIntermediate, packageName, temperatureZone, nativeUnit, numUnitPerPackage, productionLines, sessionId, callback) {
	console.log("add formulas");
	var newFormula = packIntoJson(name, description, unitsProvided, ingredients, isIntermediate, packageName, temperatureZone, nativeUnit, numUnitPerPackage, productionLines);
	//return await formulaActions.addFormula(newFormula, sessionId);
	formulaActions.addFormula(newFormula, sessionId, function(res){
	    callback(res);
	})
}

//async function bulkImport(object) {
//    try {
//        const res = await axios.post('/formulas/bulkImport', object);
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
 * get all formulas
 * sessionId: string, id of the current session
**/
async function getAllFormulasAsync(sessionId) {
	return await formulaActions.getAllFormulasAsync(sessionId);
}

/*
 * get one formula
 * formulaId: string, the id of the formula
 * sessionId: string, id of the current session
 */
async function getFormulaAsync(formulaId, sessionId) {
	return await formulaActions.getFormulaAsync(formulaId, sessionId);
};

/*
 * update one formula
 * formulaId: string, the id of the formula
 * other arguments: see packIntoJson()
 * sessionId: string, id of the current session
 */
async function updateFormula(formulaId, name, description, unitsProvided, ingredients, isIntermediate, packageName, temperatureZone, nativeUnit, numUnitPerPackage, productionLines, sessionId, callback) {
	var updatedFormula = packIntoJson(name, description, unitsProvided, ingredients, isIntermediate, packageName, temperatureZone, nativeUnit, numUnitPerPackage, productionLines);
	//return await formulaActions.updateFormula(formulaId, sessionId, updatedFormula);
	formulaActions.updateFormula(formulaId, sessionId, updatedFormula, function(res){
	    callback(res);
	})
};

/*
 * delete one existing formula
 * formulaId: string, the id of the formula
 * sessionId: string, id of the current session
 */
async function deleteFormula(formulaId, sessionId, callback) {
	return await formulaActions.deleteFormula(formulaId, sessionId, function(res){
	    callback(res);
	});
};

async function checkoutFormula(action, formulaId, quantity, productionLineName, sessionId, callback) {
     await formulaActions.checkoutFormula(action, formulaId, quantity, productionLineName, sessionId, function(res){
        callback(res);
     });
};

async function getAllFormulaNamesAsync(sessionId) {
   const res = await axios.get('/formulas/formulaNames/user/'+sessionId);
   return res;
}

async function getFormulaByNameAsync(formulaName, sessionId) {
   const res = await axios.get('/formulas/formulaName/'+formulaName+'/user/'+sessionId);
   return res;
}

//export functions above for use by other modules
export { addFormula, getAllFormulasAsync, getFormulaAsync, updateFormula, deleteFormula, checkoutFormula, getAllFormulaNamesAsync, getFormulaByNameAsync};
