//orderInterface.js
//This interface is to be used by the front-end
//It accepts string input as texts that follows the data-base schema
//creates the corresponding json object if necessary
//and calls actions to send the actual requests
import * as dummyOrder from '../dummyDatas/order.js'
import * as orderActions from '../actions/orderAction'
import axios from 'axios'

/**
takes in various properties of order,
returns a Json object that encapsulates all properties
userId: string, the id of the current user issueing the order
ingredientId: string, id of the type of ingredient being ordered
vendorId: string, string, id of the vendor that the user is ordering from
_package: number, the number of packages the user is ordering (package is a keyword in js)
price: number, the price of each package
**/
function packIntoJson(userId, ingredientId, ingredientName, vendorName, _package, price, ingredientLots){
	var orderJson = new Object();
	orderJson.userId = userId;
	orderJson.ingredientName = ingredientName;
	orderJson.ingredientId = ingredientId;
	orderJson.vendorName = vendorName;
	orderJson.packageNum = _package;
	orderJson.ingredientLots = ingredientLots;
	orderJson.price = price;
//	orderJson.isPending = isPending;
	console.log("JSON");
	console.log(orderJson);
	return orderJson;
}

/* add one order
 * for arguments see packIntoJson
 * sessionId: string, id of the current session
 */
async function addOrder(userId, ingredientId, ingredientName, vendorName, _package, price, ingredientLots, sessionId, callback) {
	var newOrder = packIntoJson(userId, ingredientId, ingredientName, vendorName, _package, price, ingredientLots);
	//return await orderActions.addOrder(newOrder, sessionId);
	orderActions.addOrder(newOrder, sessionId, function(res){
	    callback(res);
	})
}

/**
 * get all orders
 * sessionId: string, id of the current session
**/
async function getAllOrdersAsync(sessionId) {
	return await orderActions.getAllOrdersAsync(sessionId);
}

/*
 * get one order
 * orderId: string, the id of the order
 * sessionId: string, id of the current session
 */
async function getOrderAsync(orderId, sessionId) {
	return await orderActions.getOrderAsync(orderId, sessionId);
};

/*
 * update one order
 * orderId: string, the id of the order
 * other arguments: see packIntoJson()
 * sessionId: string, id of the current session
 */
async function updateOrder(orderId, userId, ingredientId,ingredientName, vendorName, _package, price, ingredientLots, sessionId, callback) {
	var updatedOrder = packIntoJson(userId, ingredientId, ingredientName, vendorName, _package, price, ingredientLots);
	//return await orderActions.updateOrder(orderId, sessionId, updatedOrder);
	orderActions.updateOrder(orderId, sessionId, updatedOrder, function(res){
	    callback(res);
	});
};

/*
 * delete one existing order
 * orderId: string, the id of the order
 * sessionId: string, id of the current session
 */
async function deleteOrder(orderId, sessionId, callback) {
	return await orderActions.deleteOrder(orderId,sessionId,function(res){
		callback(res);
	});
};

async function checkoutOrder(sessionId, callback) {
    return await orderActions.checkoutOrder(sessionId, function(res){
        callback(res);
    });
};

async function getPendingsOnlyAsync(sessionId) {
	const res = await axios.get('/orders/pendingsOnly/user/'+sessionId);
    return res;
};

async function getRawOnlyAsync(sessionId) {
	const res = await axios.get('/orders/rawOnly/user/'+sessionId);
	console.log(res);
    return res;
};

async function checkoutOneOrderAsync(orderId, userId, ingredientId, ingredientName, vendorName, _package, price, ingredientLots, sessionId, callback) {
    var order = packIntoJson(userId, ingredientId, ingredientName, vendorName, _package, price, ingredientLots);
    order._id = orderId;
    try{
        const res = await axios.post('/orders/checkoutOneOrder/user/'+sessionId, order);
        console.log(res);
        callback(null);
        return res.data;
    } catch(e) {
        if (e.response.status == 400 || e.response.status == 500)
            callback(e.response);
        else
            throw e;
    }
};

//export functions above for use by other modules
export { addOrder, getAllOrdersAsync, getOrderAsync, updateOrder, deleteOrder, checkoutOrder, getPendingsOnlyAsync, getRawOnlyAsync, checkoutOneOrderAsync};
