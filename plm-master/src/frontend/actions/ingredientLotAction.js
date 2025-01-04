//ingredientLotAction.js
import axios from 'axios';
import * as genericActions from './genericCrudAction'
//All the methods return the response on successful completion

const baseUrl = '/ingredientLots';
const property = 'ingredientLot';

/* add one ingredientLot
 * ingredientLot: JSON object
 * sessionId: string
 */
async function addIngredientLot(ingredientLot, sessionId, callback) {
//	try {
//		return await genericActions.create(baseUrl, ingredientLot, sessionId);
//	} catch(e) {
//		throw e;
//	}
    genericActions.create(baseUrl, ingredientLot, sessionId, function(res){
        callback(res);
    });
};

/* 
 * get all ingredientLots
 * deprecated, use getAllIngredientLotsAsync() instead
 */
 /*
function getAllIngredientLots() {
	return genericActions.getAll(baseUrl);
};
*/

/* 
 * get all ingredientLots
 * sessionId: string, id of the current session
 */
async function getAllIngredientLotsAsync(sessionId){
	console.log("Action: getAllIngredientLotsAsync()");
	console.log("sessionId: " + sessionId);
	return await genericActions.getAllAsync(baseUrl, sessionId);
};

/* 
 * get one ingredientLot specified by an id
 * deprecated, use getIngredientLotAsync() instead
 * ingredientLotId: string, the id of the ingredientLot
 */
 /*
function getIngredientLot(ingredientLotId) {
	return genericActions.getById(ingredientLotId, baseUrl.concat(property).concat('/') );
};
*/

/* 
 * get one ingredientLot specified by an id
 * ingredientLotId: string, the id of the ingredient
 * sessionId: string, id of the current session
 */
async function getIngredientLotAsync(ingredientLotId, sessionId){
	return await genericActions.getByIdAsync(baseUrl, property, ingredientLotId, sessionId);
};

/* 
 * update one ingredientLot information
 * ingredientLotId: string, the id of the ingredientLot
 * sessionId: string, id of the current session
 * ingredientLot: JSON object representing the updated info about the ingredientLot
 */
async function updateIngredientLot(ingredientLotId, sessionId, ingredientLot, callback) {
	//return await genericActions.updateById(baseUrl, property, ingredientLotId, sessionId, ingredientLot);
	genericActions.updateById(baseUrl, property, ingredientLotId, sessionId, ingredientLot, function(res){
	    callback(res);
	})
};

/* 
 * delete one existing ingredientLot
 * ingredientLotId: string, the id of the ingredientLot
 * sessionId: string, id of the current session
 */
async function deleteIngredientLot(ingredientLotId, sessionId) {
	return await genericActions.deleteById(baseUrl, property, ingredientLotId, sessionId);
};

//export functions above for use by other modules
export { addIngredientLot, getAllIngredientLotsAsync, getIngredientLotAsync, updateIngredientLot, deleteIngredientLot};