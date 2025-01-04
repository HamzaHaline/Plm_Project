//distributorNetworkAction.js
import axios from 'axios';
import * as genericActions from './genericCrudAction'
//All the methods return the response on successful completion

const baseUrl = '/distributorNetworks';
const property = 'distributorNetwork';

/* add one distributorNetwork
 * distributorNetwork: JSON object
 * sessionId: string
 */
async function addDistributorNetwork(distributorNetwork, sessionId, callback) {
//	try {
//		return await genericActions.create(baseUrl, distributorNetwork, sessionId);
//	} catch(e) {
//		throw e;
//	}
    genericActions.create(baseUrl, distributorNetwork, sessionId, function(res){
        callback(res);
    });
};

/* 
 * get all distributorNetworks
 * deprecated, use getAllDistributorNetworksAsync() instead
 */
 /*
function getAllDistributorNetworks() {
	return genericActions.getAll(baseUrl);
};
*/

/* 
 * get all distributorNetworks
 * sessionId: string, id of the current session
 */
async function getAllDistributorNetworksAsync(sessionId){
	console.log("Action: getAllDistributorNetworksAsync()");
	console.log("sessionId: " + sessionId);
	return await genericActions.getAllAsync(baseUrl, sessionId);
};

/* 
 * get one distributorNetwork specified by an id
 * deprecated, use getDistributorNetworkAsync() instead
 * distributorNetworkId: string, the id of the distributorNetwork
 */
 /*
function getDistributorNetwork(distributorNetworkId) {
	return genericActions.getById(distributorNetworkId, baseUrl.concat(property).concat('/') );
};
*/

/* 
 * get one distributorNetwork specified by an id
 * distributorNetworkId: string, the id of the ingredient
 * sessionId: string, id of the current session
 */
async function getDistributorNetworkAsync(distributorNetworkId, sessionId){
	return await genericActions.getByIdAsync(baseUrl, property, distributorNetworkId, sessionId);
};

/* 
 * update one distributorNetwork information
 * distributorNetworkId: string, the id of the distributorNetwork
 * sessionId: string, id of the current session
 * distributorNetwork: JSON object representing the updated info about the distributorNetwork
 */
async function updateDistributorNetwork(distributorNetworkId, sessionId, distributorNetwork, callback) {
	//return await genericActions.updateById(baseUrl, property, distributorNetworkId, sessionId, distributorNetwork);
	genericActions.updateById(baseUrl, property, distributorNetworkId, sessionId, distributorNetwork, function(res){
	    callback(res);
	})
};

/* 
 * delete one existing distributorNetwork
 * distributorNetworkId: string, the id of the distributorNetwork
 * sessionId: string, id of the current session
 */
async function deleteDistributorNetwork(distributorNetworkId, sessionId) {
	return await genericActions.deleteById(baseUrl, property, distributorNetworkId, sessionId);
};

//export functions above for use by other modules
export { addDistributorNetwork, getAllDistributorNetworksAsync, getDistributorNetworkAsync, updateDistributorNetwork, deleteDistributorNetwork};