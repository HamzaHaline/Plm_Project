//distributorNetworkInterface.js
//This interface is to be used by the front-end
//It accepts string input as texts that follows the data-base schema
//creates the corresponding json object if necessary
//and calls actions to send the actual requests
import * as distributorNetworkActions from '../actions/distributorNetworkAction'
import axios from 'axios'
/**
takes in various properties of distributorNetwork,
returns a Json object that encapsulates all properties
name: string
contact: string
code: string
ingredients: an array of objects following IngredientPriceSchema
**/
function packIntoJson(productName, isSold, numUnit, numSold, totalRevenue, totalCost){
	var distributorNetworkJson = new Object();
	distributorNetworkJson.productName = productName;
	distributorNetworkJson.isSold = isSold;
	distributorNetworkJson.numUnit = numUnit;
	distributorNetworkJson.numSold = numSold;
	distributorNetworkJson.totalRevenue = totalRevenue;
	distributorNetworkJson.totalCost = totalCost;
	// distributorNetworkJson.ingredients = ingredients;
	console.log("Ingredient JSON");
	console.log(distributorNetworkJson);
	// console.log(dummyDistributorNetwork.sampleDistributorNetwork);
	return distributorNetworkJson;
}

/* add one distributorNetwork
 * for arguments see packIntoJson
 * sessionId: string, id of the current session
 */
async function addDistributorNetwork(productName, isSold, numUnit, numSold, totalRevenue, totalCost, sessionId, callback) {
	var newDistributorNetwork = packIntoJson(productName, isSold, numUnit, numSold, totalRevenue, totalCost);
//	try{
//		return await distributorNetworkActions.addDistributorNetwork(newDistributorNetwork, sessionId);
//	} catch (e) {
//		throw e;
//	}
    distributorNetworkActions.addDistributorNetwork(newDistributorNetwork, sessionId, function(res){
        callback(res);
    });
	
}

/**
 * get all distributorNetworks
 * sessionId: string, id of the current session
**/
async function getAllDistributorNetworksAsync(sessionId) {
	console.log("Interface: getAllDistributorNetworksAsync()");
	console.log("sessionId: " + sessionId);
	return await distributorNetworkActions.getAllDistributorNetworksAsync(sessionId);
}

async function getAllDistributorNetworkNamesCodesAsync(sessionId) {
   const res = await axios.get('/distributorNetworks/distributorNetworkNames/user/'+sessionId);
   return res;
}

/*
 * get one distributorNetwork
 * distributorNetworkId: string, the id of the distributorNetwork
 * sessionId: string, id of the current session
 */
async function getDistributorNetworkAsync(distributorNetworkId, sessionId) {
	return await distributorNetworkActions.getDistributorNetworkAsync(distributorNetworkId, sessionId);
};

/*
 * update one distributorNetwork
 * distributorNetworkId: string, the id of the distributorNetwork
 * other arguments: see packIntoJson()
 * sessionId: string, id of the current session
 */
async function updateDistributorNetwork(distributorNetworkId, productName, isSold, numUnit, numSold, totalRevenue, totalCost, sessionId, callback) {
	var updatedDistributorNetwork = packIntoJson(productName, isSold, numUnit, numSold, totalRevenue, totalCost);
	//return await distributorNetworkActions.updateDistributorNetwork(distributorNetworkId, sessionId, updatedDistributorNetwork);
	distributorNetworkActions.updateDistributorNetwork(distributorNetworkId, sessionId, updatedDistributorNetwork, function(res){
        callback(res);
    });
};

/*
 * delete one existing distributorNetwork
 * distributorNetworkId: string, the id of the distributorNetwork
 * sessionId: string, id of the current session
 */
async function deleteDistributorNetwork(distributorNetworkId, sessionId) {
	return await distributorNetworkActions.deleteDistributorNetwork(distributorNetworkId,sessionId);
};

async function sellItemsAsync(products, sessionId, callback) {
    try {
        const res = await axios.put('/distributorNetworks/sell/user/'+sessionId, products);
        console.log(res.data);
        callback(res.data);
    } catch (e) {
        if (e.response.status == 400 || e.response.status == 500)
            callback(e.response);
        else {
            console.log(e.response);
            throw e;
        }
    }
}


async function getFreshAsync(sessionId) {
    const res = await axios.get('/distributorNetworks/fresh/user/'+sessionId);
    return res;
}

//export functions above for use by other modules
export { addDistributorNetwork, getAllDistributorNetworksAsync, getDistributorNetworkAsync, updateDistributorNetwork, deleteDistributorNetwork, getAllDistributorNetworkNamesCodesAsync, sellItemsAsync, getFreshAsync};
