//cartAction.js
import axios from 'axios';
import * as genericActions from './genericCrudAction'

//All the methods return the response on successful completion
const baseUrl = '/carts';
const property = 'cart'; 

/* create a new cart for the user
 * cart: JSON object following cart.server.model.js
 * sessionId: string, id of the current session
 */
async function addCart(cart, sessionId, callback) {
	//return await genericActions.create(baseUrl,cart,sessionId);
	genericActions.create(baseUrl,cart,sessionId, function(res){
	    callback(res);
	})
};

/* 
 * get all carts
 * sessionId: string, id of the current session
 */
async function getAllCartsAsync(sessionId){
	return await genericActions.getAllAsync(baseUrl, sessionId);
};

/* 
 * get one cart
 * cartId: string, the id of the cart
 * sessionId: string, id of the current session
 */

async function getCartAsync(cartId, sessionId){
	return await genericActions.getByIdAsync(baseUrl, property, cartId, sessionId);
};

/* 
 * update one cart
 * cartId: string, the id of the cart
 * sessionId: string, id of the current session
 * cart: JSON object representing the updated info about the cart
 */
async function updateCart(cartId, sessionId, cart, callback) {
	//return await genericActions.updateById(baseUrl, property, cartId, sessionId, cart);
	genericActions.updateById(baseUrl, property, cartId, sessionId, cart, function(res){
	    callback(res);
	})
};

/* 
 * delete one existing cart
 * cartId: string, the id of the cart
 * sessionId: string, id of the current session
 */
async function deleteCart(cartId, sessionId) {
	return await genericActions.deleteById(baseUrl, property, cartId, sessionId);
};

/*
 * checkout a cart pertaining to a particular session
 * sessionId: string, id of the current session
 */
async function checkoutCart(sessionId) {
	const checkoutSegment = 'checkout';
	return await genericActions.deleteAll(baseUrl, checkoutSegment, sessionId);
};

//export functions above for use by other modules
export { addCart, getAllCartsAsync, getCartAsync, updateCart, deleteCart, checkoutCart};