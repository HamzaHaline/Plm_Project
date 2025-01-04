//inventoryAction.js
import axios from 'axios';
import * as genericActions from './genericCrudAction'

//All the methods return the response on successful completion
const baseUrl = '/inventories';
const property = 'inventory'; 

/* create a new inventory for the user
 * inventory: JSON object following inventory.server.model.js
 * sessionId: string, id of the current session
 */
async function addInventory(inventory, sessionId, callback) {
	//return await genericActions.create(baseUrl,inventory,sessionId);
	genericActions.create(baseUrl,inventory,sessionId, function(res){
	    callback(res);
	})
};

/* 
 * get all inventories
 * sessionId: string, id of the current session
 */
async function getAllInventoriesAsync(sessionId){
	return await genericActions.getAllAsync(baseUrl, sessionId);
};

/* 
 * get one inventory
 * inventoryId: string, the id of the inventory
 * sessionId: string, id of the current session
 */

async function getInventoryAsync(inventoryId, sessionId){
	return await genericActions.getByIdAsync(baseUrl, property, inventoryId, sessionId);
};

/* 
 * update one inventory
 * inventoryId: string, the id of the inventory
 * sessionId: string, id of the current session
 * inventory: JSON object representing the updated info about the inventory
 */
async function updateInventory(inventoryId, sessionId, inventory, callback) {
	//return await genericActions.updateById(baseUrl, property, inventoryId, sessionId, inventory);
	genericActions.updateById(baseUrl, property, inventoryId, sessionId, inventory, function(res){
	    callback(res);
	})
};

/* 
 * delete one existing inventory
 * inventoryId: string, the id of the inventory
 * sessionId: string, id of the current session
 */
async function deleteInventory(inventoryId, sessionId) {
	return await genericActions.deleteById(baseUrl, property, inventoryId, sessionId);
};

//export functions above for use by other modules
export { addInventory, getAllInventoriesAsync, getInventoryAsync, updateInventory, deleteInventory};