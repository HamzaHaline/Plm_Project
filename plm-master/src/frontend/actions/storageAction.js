//storageAction.js
import axios from 'axios';
import * as genericActions from './genericCrudAction'

//All the methods return the response on successful completion
const baseUrl = '/storages';
const property = 'storage'; 

/* create a new storage for the user
 * storage: JSON object following storage.server.model.js
 * sessionId: string, id of the current session
 */
async function addStorage(storage, sessionId) {
	return await genericActions.create(baseUrl,storage,sessionId);
};

/* 
 * get all storages
 * sessionId: string, id of the current session
 */
async function getAllStoragesAsync(sessionId){
	return await genericActions.getAllAsync(baseUrl, sessionId);
};

/* 
 * get one storage
 * storageId: string, the id of the storage
 * sessionId: string, id of the current session
 */

async function getStorageAsync(storageId, sessionId){
	return await genericActions.getByIdAsync(baseUrl, property, storageId, sessionId);
};

/* 
 * update one storage
 * storageId: string, the id of the storage
 * sessionId: string, id of the current session
 * storage: JSON object representing the updated info about the storage
 */
async function updateStorage(storageId, sessionId, storage, callback) {
	genericActions.updateById(baseUrl, property, storageId, sessionId, storage, function(res){
	    callback(res);
	});
};

/* 
 * delete one existing storage
 * storageId: string, the id of the storage
 * sessionId: string, id of the current session
 */
async function deleteStorage(storageId, sessionId) {
	return await genericActions.deleteById(baseUrl, property, storageId, sessionId);
};

//export functions above for use by other modules
export { addStorage, getAllStoragesAsync, getStorageAsync, updateStorage, deleteStorage};