//productionLineAction.js
import axios from 'axios';
import * as genericActions from './genericCrudAction'
//All the methods return the response on successful completion

const baseUrl = '/productionLines';
const property = 'productionLine';

/* add one productionLine
 * productionLine: JSON object
 * sessionId: string
 */
async function addProductionLine(productionLine, sessionId, callback) {
//	try {
//		return await genericActions.create(baseUrl, productionLine, sessionId);
//	} catch(e) {
//		throw e;
//	}
    genericActions.create(baseUrl, productionLine, sessionId, function(res){
        callback(res);
    });
};

/* 
 * get all productionLines
 * deprecated, use getAllProductionLinesAsync() instead
 */
 /*
function getAllProductionLines() {
	return genericActions.getAll(baseUrl);
};
*/

/* 
 * get all productionLines
 * sessionId: string, id of the current session
 */
async function getAllProductionLinesAsync(sessionId){
	console.log("Action: getAllProductionLinesAsync()");
	console.log("sessionId: " + sessionId);
	return await genericActions.getAllAsync(baseUrl, sessionId);
};

/* 
 * get one productionLine specified by an id
 * deprecated, use getProductionLineAsync() instead
 * productionLineId: string, the id of the productionLine
 */
 /*
function getProductionLine(productionLineId) {
	return genericActions.getById(productionLineId, baseUrl.concat(property).concat('/') );
};
*/

/* 
 * get one productionLine specified by an id
 * productionLineId: string, the id of the ingredient
 * sessionId: string, id of the current session
 */
async function getProductionLineAsync(productionLineId, sessionId){
	return await genericActions.getByIdAsync(baseUrl, property, productionLineId, sessionId);
};

/* 
 * update one productionLine information
 * productionLineId: string, the id of the productionLine
 * sessionId: string, id of the current session
 * productionLine: JSON object representing the updated info about the productionLine
 */
async function updateProductionLine(productionLineId, sessionId, productionLine, callback) {
	//return await genericActions.updateById(baseUrl, property, productionLineId, sessionId, productionLine);
	genericActions.updateById(baseUrl, property, productionLineId, sessionId, productionLine, function(res){
	    callback(res);
	})
};

/* 
 * delete one existing productionLine
 * productionLineId: string, the id of the productionLine
 * sessionId: string, id of the current session
 */
async function deleteProductionLine(productionLineId, sessionId, callback) {

    await genericActions.deleteById(baseUrl, property, productionLineId, sessionId, function(res){
        callback(res);
    });

};

//export functions above for use by other modules
export { addProductionLine, getAllProductionLinesAsync, getProductionLineAsync, updateProductionLine, deleteProductionLine};