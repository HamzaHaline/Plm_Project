//productInterface.js
//This interface is to be used by the front-end
//It accepts string input as texts that follows the data-base schema
//creates the corresponding json object if necessary
//and calls actions to send the actual requests
import * as productActions from '../actions/productAction'
import axios from 'axios'
/**
takes in various properties of product,
returns a Json object that encapsulates all properties
name: string
contact: string
code: string
ingredients: an array of objects following IngredientPriceSchema
**/
function packIntoJson(name, numUnit, date, lotNumber){
	var productJson = new Object();
	productJson.name = name;
	productJson.numUnit = numUnit;
	productJson.date = date;
	productJson.lotNumber = lotNumber;
	// productJson.ingredients = ingredients;
	console.log("Ingredient JSON");
	console.log(productJson);
	// console.log(dummyProduct.sampleProduct);
	return productJson;
}

/* add one product
 * for arguments see packIntoJson
 * sessionId: string, id of the current session
 */
async function addProduct(name, numUnit, date, lotNumber, sessionId, callback) {
	var newProduct = packIntoJson(name, numUnit, date, lotNumber);
//	try{
//		return await productActions.addProduct(newProduct, sessionId);
//	} catch (e) {
//		throw e;
//	}
    productActions.addProduct(newProduct, sessionId, function(res){
        callback(res);
    });
	
}

/**
 * get all products
 * sessionId: string, id of the current session
**/
async function getAllProductsAsync(sessionId) {
	console.log("Interface: getAllProductsAsync()");
	console.log("sessionId: " + sessionId);
	return await productActions.getAllProductsAsync(sessionId);
}

async function getAllProductNamesCodesAsync(sessionId) {
   const res = await axios.get('/products/productNames/user/'+sessionId);
   return res;
}

/*
 * get one product
 * productId: string, the id of the product
 * sessionId: string, id of the current session
 */
async function getProductAsync(productId, sessionId) {
	return await productActions.getProductAsync(productId, sessionId);
};

/*
 * update one product
 * productId: string, the id of the product
 * other arguments: see packIntoJson()
 * sessionId: string, id of the current session
 */
async function updateProduct(productId, name, numUnit, date, lotNumber, sessionId, callback) {
	var updatedProduct = packIntoJson(name, numUnit, date, lotNumber);
	//return await productActions.updateProduct(productId, sessionId, updatedProduct);
	productActions.updateProduct(productId, sessionId, updatedProduct, function(res){
        callback(res);
    });
};

/*
 * delete one existing product
 * productId: string, the id of the product
 * sessionId: string, id of the current session
 */
async function deleteProduct(productId, sessionId) {
	return await productActions.deleteProduct(productId,sessionId);
};

//export functions above for use by other modules
export { addProduct, getAllProductsAsync, getProductAsync, updateProduct, deleteProduct, getAllProductNamesCodesAsync};
