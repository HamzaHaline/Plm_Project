//cartInterface.js
//This interface is to be used by the front-end 
//It accepts string input as texts that follows the data-base schema
//creates the corresponding json object if necessary
//and calls actions to send the actual requests
import * as dummyCart from '../dummyDatas/cart.js'
import * as cartActions from '../actions/cartAction'

/**
takes in various properties of cart,
returns a Json object that encapsulates all properties 
userId: string, the id of the current user owning the cart
ingredientId: string, id of the type of ingredient this cart is holding
quantity: number, the amount of that type of ingredient in the cart, in units of pounds
**/
function packIntoJson(userId, ingredientId, ingredientName, quantity){
	var cartJson = new Object();
	cartJson.userId = userId;
	cartJson.ingredientId = ingredientId;
	cartJson.ingredientName = ingredientName;
	cartJson.quantity = quantity;
	console.log("JSON");
	console.log(cartJson);
	//console.log(dummyCart.sampleCart);
	return cartJson;
}

/* add one cart
 * for arguments see packIntoJson
 * sessionId: string, id of the current session
 */
async function addCart(userId, ingredientId, ingredientName, quantity, sessionId, callback) {
	var newCart = packIntoJson(userId, ingredientId, ingredientName, quantity);
	//return await cartActions.addCart(newCart, sessionId);
	cartActions.addCart(newCart, sessionId, function(res){
	    callback(res);
	});
}

/**
 * get all carts
 * sessionId: string, id of the current session
**/
async function getAllCartsAsync(sessionId) {
	return await cartActions.getAllCartsAsync(sessionId);
}

/* 
 * get one cart
 * cartId: string, the id of the cart
 * sessionId: string, id of the current session
 */
async function getCartAsync(cartId, sessionId) {
	return await cartActions.getCartAsync(cartId, sessionId);
};

/* 
 * update one cart
 * cartId: string, the id of the cart
 * other arguments: see packIntoJson()
 * sessionId: string, id of the current session
 */
async function updateCart(cartId, userId, ingredientId, ingredientName, quantity, sessionId, callback) {
	var updatedCart = packIntoJson(userId, ingredientId, quantity);
	//return await cartActions.updateCart(cartId, sessionId, updatedCart);
	cartActions.updateCart(cartId, sessionId, updatedCart, function(res){
	    callback(res);
	});
};

/* 
 * delete one existing cart
 * cartId: string, the id of the cart
 * sessionId: string, id of the current session
 */
async function deleteCart(cartId, sessionId) {
	return await cartActions.deleteCart(cartId, sessionId);
};

/*
 * checkout a cart pertaining to a particular session
 * sessionId: string, id of the current session
 */
async function checkoutCart(sessionId){
	return await cartActions.checkoutCart(sessionId);
};

//export functions above for use by other modules
export { addCart, getAllCartsAsync, getCartAsync, updateCart, deleteCart, checkoutCart};