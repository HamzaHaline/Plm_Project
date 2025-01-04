//vendorAction.js
import axios from 'axios';
import * as genericActions from './genericCrudAction'
//All the methods return the response on successful completion

const baseUrl = '/vendors';
const property = 'vendor';

/* add one vendor
 * vendor: JSON object
 * sessionId: string
 */
async function addVendor(vendor, sessionId, callback) {
//	try {
//		return await genericActions.create(baseUrl, vendor, sessionId);
//	} catch(e) {
//		throw e;
//	}
    genericActions.create(baseUrl, vendor, sessionId, function(res){
        callback(res);
    });
};

/* 
 * get all vendors
 * deprecated, use getAllVendorsAsync() instead
 */
 /*
function getAllVendors() {
	return genericActions.getAll(baseUrl);
};
*/

/* 
 * get all vendors
 * sessionId: string, id of the current session
 */
async function getAllVendorsAsync(sessionId){
	console.log("Action: getAllVendorsAsync()");
	console.log("sessionId: " + sessionId);
	return await genericActions.getAllAsync(baseUrl, sessionId);
};

/* 
 * get one vendor specified by an id
 * deprecated, use getVendorAsync() instead
 * vendorId: string, the id of the vendor
 */
 /*
function getVendor(vendorId) {
	return genericActions.getById(vendorId, baseUrl.concat(property).concat('/') );
};
*/

/* 
 * get one vendor specified by an id
 * vendorId: string, the id of the ingredient
 * sessionId: string, id of the current session
 */
async function getVendorAsync(vendorId, sessionId){
	return await genericActions.getByIdAsync(baseUrl, property, vendorId, sessionId);
};

/* 
 * update one vendor information
 * vendorId: string, the id of the vendor
 * sessionId: string, id of the current session
 * vendor: JSON object representing the updated info about the vendor
 */
async function updateVendor(vendorId, sessionId, vendor, callback) {
	//return await genericActions.updateById(baseUrl, property, vendorId, sessionId, vendor);
	genericActions.updateById(baseUrl, property, vendorId, sessionId, vendor, function(res){
	    callback(res);
	})
};

/* 
 * delete one existing vendor
 * vendorId: string, the id of the vendor
 * sessionId: string, id of the current session
 */
async function deleteVendor(vendorId, sessionId, callback) {
	return await genericActions.deleteById(baseUrl, property, vendorId, sessionId, function(res){
	    callback(res);
	});
};

//export functions above for use by other modules
export { addVendor, getAllVendorsAsync, getVendorAsync, updateVendor, deleteVendor};