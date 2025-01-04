//productionLineInterface.js
//This interface is to be used by the front-end
//It accepts string input as texts that follows the data-base schema
//creates the corresponding json object if necessary
//and calls actions to send the actual requests
import * as productionLineActions from '../actions/productionLineAction'
import axios from 'axios'
/**
takes in various properties of productionLine,
returns a Json object that encapsulates all properties
name: string
contact: string
code: string
ingredients: an array of objects following IngredientPriceSchema
**/
function packIntoJson(name, description, formulaNames, isIdle){
	var productionLineJson = new Object();
	productionLineJson.name = name;
	productionLineJson.description = description;
	productionLineJson.formulaNames = formulaNames;
	productionLineJson.isIdle = isIdle;
	// productionLineJson.ingredients = ingredients;
	console.log("Ingredient JSON");
	console.log(productionLineJson);
	// console.log(dummyProductionLine.sampleProductionLine);
	return productionLineJson;
}

/* add one productionLine
 * for arguments see packIntoJson
 * sessionId: string, id of the current session
 */
async function addProductionLine(name, description, formulaNames, isIdle, sessionId, callback) {
	var newProductionLine = packIntoJson(name, description, formulaNames, isIdle);
//	try{
//		return await productionLineActions.addProductionLine(newProductionLine, sessionId);
//	} catch (e) {
//		throw e;
//	}
    productionLineActions.addProductionLine(newProductionLine, sessionId, function(res){
        callback(res);
    });
	
}

/**
 * get all productionLines
 * sessionId: string, id of the current session
**/
async function getAllProductionLinesAsync(sessionId) {
	console.log("Interface: getAllProductionLinesAsync()");
	console.log("sessionId: " + sessionId);
	return await productionLineActions.getAllProductionLinesAsync(sessionId);
}

async function getAllProductionLineNamesCodesAsync(sessionId) {
   const res = await axios.get('/productionLines/productionLineNames/user/'+sessionId);
   return res;
}

async function getProductionLineByNameAsync(productionLineName, sessionId) {
   const res = await axios.get('/productionLines/productionLineName/'+productionLineName+'/user/'+sessionId);
   return res;
}

/*
 * get one productionLine
 * productionLineId: string, the id of the productionLine
 * sessionId: string, id of the current session
 */
async function getProductionLineAsync(productionLineId, sessionId) {
	return await productionLineActions.getProductionLineAsync(productionLineId, sessionId);
};

async function markComplete(productionLineId, sessionId) {
	 const res = await axios.put('/productionLines/markComplete/productionLine/'+productionLineId+'/user/'+sessionId);
     return res;
};

async function getEfficiencies(startTime, endTime, sessionId) {
	 const res = await axios.get('/productionLines/getEfficiencies/st/'+startTime+'/et/'+endTime+'/user/'+sessionId);
     return res;
};

/*
 * update one productionLine
 * productionLineId: string, the id of the productionLine
 * other arguments: see packIntoJson()
 * sessionId: string, id of the current session
 */
async function updateProductionLine(productionLineId, name, description, formulaNames, isIdle, sessionId, callback) {
	var updatedProductionLine = packIntoJson(name, description, formulaNames, isIdle);
	//return await productionLineActions.updateProductionLine(productionLineId, sessionId, updatedProductionLine);
	productionLineActions.updateProductionLine(productionLineId, sessionId, updatedProductionLine, function(res){
        callback(res);
    });
};

/*
 * delete one existing productionLine
 * productionLineId: string, the id of the productionLine
 * sessionId: string, id of the current session
 */
async function deleteProductionLine(productionLineId, sessionId, callback) {
	await productionLineActions.deleteProductionLine(productionLineId,sessionId, function(res){
	    callback(res);
	});
};

//export functions above for use by other modules
export { addProductionLine, getAllProductionLinesAsync, getProductionLineAsync, updateProductionLine, deleteProductionLine, getAllProductionLineNamesCodesAsync, getProductionLineByNameAsync, markComplete, getEfficiencies};
