//inventoryInterface.js
//This interface is to be used by the front-end
//It accepts string input as texts that follows the data-base schema
//creates the corresponding json object if necessary
//and calls actions to send the actual requests
import * as dummyInventory from '../dummyDatas/inventory.js'
import * as inventoryActions from '../actions/inventoryAction'

/**
 * takes in various properties of inventory,
 * returns a Json object that encapsulates all properties
 * userId: string, the id of the current user owning the inventory
 * ingredientId: string, id of the type of ingredient this inventory is holding
 * ingredientName: string, name of the ingredient
 * temperatureZone: string 'freezer', 'refrigerator', 'warehouse', 'Freezer', 'Refrigerator', 'Warehouse'
 * pakcageName: string 'Sack', 'Pail', 'Drum', 'Supersack', 'Truckload', 'Railcar', or lowercase
 * space: Number, the space (in square feet) this inventory item should occupy
 * nativeUnit: string, the unit in which the amount is measured for production (e.g. pounds, gallon)
 * amountInNativeUnit: number, the amount of this inventory item in its native units
**/
function packIntoJson(userId, ingredientId, ingredientName, temperatureZone, 
	packageName, space, nativeUnit, amountInNativeUnit){
	var inventoryJson = new Object();
	inventoryJson.userId = userId;
	inventoryJson.ingredientId = ingredientId;
	inventoryJson.ingredientName = ingredientName;
	inventoryJson.temperatureZone = temperatureZone;
	inventoryJson.packageName = packageName;
	inventoryJson.space = space;
	inventoryJson.nativeUnit = nativeUnit;
	inventoryJson.numUnit = amountInNativeUnit;
	console.log("The following inventory object has been created:");
	console.log(inventoryJson);
	return inventoryJson;
}

/* add one inventory item
 * for arguments see packIntoJson
 * sessionId: string, id of the current session
 * callback: function, to be executed after attempting to add inventory item into the database
 */

 async function addInventory(userId, ingredientId, ingredientName, temperatureZone, 
 	packageName, space, nativeUnit, amountInNativeUnit, sessionId, callback) {
 	var newInventory = packIntoJson(userId, ingredientId, ingredientName, temperatureZone, 
 		packageName, space, nativeUnit, amountInNativeUnit);
	//return await inventoryActions.addInventory(newInventory, sessionId);
	inventoryActions.addInventory(newInventory, sessionId, function(res){
		callback(res);
	})
}

/**
 * get all inventories
 * sessionId: string, id of the current session
 **/
 async function getAllInventoriesAsync(sessionId) {
 	return await inventoryActions.getAllInventoriesAsync(sessionId);
 }

/*
 * get one inventory
 * inventoryId: string, the id of the inventory
 * sessionId: string, id of the current session
 */
 async function getInventoryAsync(inventoryId, sessionId) {
 	return await inventoryActions.getInventoryAsync(inventoryId, sessionId);
 };

/*
 * update one inventory
 * inventoryId: string, the id of the inventory
 * other arguments: see packIntoJson()
 * sessionId: string, id of the current session
 * callback: function, the function that will be called after attemping to update the database
 */

 async function updateInventory(inventoryId, userId, ingredientId, ingredientName, temperatureZone, 
 		packageName, space, nativeUnit, amountInNativeUnit, sessionId, callback) {
 	var updatedInventory = packIntoJson(userId, ingredientId, ingredientName, temperatureZone, 
 		packageName, space, nativeUnit, amountInNativeUnit);
	//return await inventoryActions.updateInventory(inventoryId, sessionId, updatedInventory);
	inventoryActions.updateInventory(inventoryId, sessionId, updatedInventory, function(res){
		callback(res);
	})
};

/*
 * delete one existing inventory
 * inventoryId: string, the id of the inventory
 * sessionId: string, id of the current session
 */
 async function deleteInventory(inventoryId, sessionId) {
 	return await inventoryActions.deleteInventory(inventoryId, sessionId);
 };


//export functions above for use by other modules
export { addInventory, getAllInventoriesAsync, getInventoryAsync, updateInventory, deleteInventory};
