//orderAction.js
import axios from 'axios';
import * as genericActions from './genericCrudAction'

//All the methods return the response on successful completion
const baseUrl = '/orders';
const property = 'order'; 

/* create a new order for the user
 * order: JSON object following order.server.model.js
 * sessionId: string, id of the current session
 */
async function addOrder(order, sessionId, callback) {
	//return await genericActions.create(baseUrl,order,sessionId);
	genericActions.create(baseUrl,order,sessionId, function(res){
	    callback(res);
	})
};

/* 
 * get all orders
 * sessionId: string, id of the current session
 */
async function getAllOrdersAsync(sessionId){
    console.log("getting all orders");
	return await genericActions.getAllAsync(baseUrl, sessionId);
};

/* 
 * get one order
 * orderId: string, the id of the order
 * sessionId: string, id of the current session
 */

async function getOrderAsync(orderId, sessionId){
	return await genericActions.getByIdAsync(baseUrl, property, orderId, sessionId);
};

/* 
 * update one order
 * orderId: string, the id of the order
 * sessionId: string, id of the current session
 * order: JSON object representing the updated info about the order
 */
async function updateOrder(orderId, sessionId, order, callback) {
	//return await genericActions.updateById(baseUrl, property, orderId, sessionId, order);
	genericActions.updateById(baseUrl, property, orderId, sessionId, order, function(res){
	    callback(res);
	})
};

/* 
 * delete one existing order
 * orderId: string, the id of the order
 * sessionId: string, id of the current session
 */
async function deleteOrder(orderId, sessionId, callback) {
	return await genericActions.deleteById(baseUrl, property, orderId, sessionId, function(res){
	    callback(res);
	});
};

async function checkoutOrder(sessionId, callback) {
	const checkoutSegment = 'checkout';
    return await genericActions.deleteAll(baseUrl, checkoutSegment, sessionId, function(res){
        callback(res);
    });
};

//export functions above for use by other modules
export { addOrder, getAllOrdersAsync, getOrderAsync, updateOrder, deleteOrder, checkoutOrder};