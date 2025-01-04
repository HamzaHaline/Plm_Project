//productAction.js
import axios from 'axios';
import * as genericActions from './genericCrudAction'
//All the methods return the response on successful completion

const baseUrl = '/products';
const property = 'product';

/* add one product
 * product: JSON object
 * sessionId: string
 */
async function addProduct(product, sessionId, callback) {
//	try {
//		return await genericActions.create(baseUrl, product, sessionId);
//	} catch(e) {
//		throw e;
//	}
    genericActions.create(baseUrl, product, sessionId, function(res){
        callback(res);
    });
};

/* 
 * get all products
 * deprecated, use getAllProductsAsync() instead
 */
 /*
function getAllProducts() {
	return genericActions.getAll(baseUrl);
};
*/

/* 
 * get all products
 * sessionId: string, id of the current session
 */
async function getAllProductsAsync(sessionId){
	console.log("Action: getAllProductsAsync()");
	console.log("sessionId: " + sessionId);
	return await genericActions.getAllAsync(baseUrl, sessionId);
};

/* 
 * get one product specified by an id
 * deprecated, use getProductAsync() instead
 * productId: string, the id of the product
 */
 /*
function getProduct(productId) {
	return genericActions.getById(productId, baseUrl.concat(property).concat('/') );
};
*/

/* 
 * get one product specified by an id
 * productId: string, the id of the ingredient
 * sessionId: string, id of the current session
 */
async function getProductAsync(productId, sessionId){
	return await genericActions.getByIdAsync(baseUrl, property, productId, sessionId);
};

/* 
 * update one product information
 * productId: string, the id of the product
 * sessionId: string, id of the current session
 * product: JSON object representing the updated info about the product
 */
async function updateProduct(productId, sessionId, product, callback) {
	//return await genericActions.updateById(baseUrl, property, productId, sessionId, product);
	genericActions.updateById(baseUrl, property, productId, sessionId, product, function(res){
	    callback(res);
	})
};

/* 
 * delete one existing product
 * productId: string, the id of the product
 * sessionId: string, id of the current session
 */
async function deleteProduct(productId, sessionId) {
	return await genericActions.deleteById(baseUrl, property, productId, sessionId);
};

//export functions above for use by other modules
export { addProduct, getAllProductsAsync, getProductAsync, updateProduct, deleteProduct};