//userAction.js
import axios from 'axios';
import * as genericActions from './genericCrudAction'
//All the methods return the response on successful completion

const baseUrl = '/users';
const property = 'searchedUser';

/* add one user
 * user: JSON object
 * sessionId: string
 * callback: a function
 */
async function addUser(user, sessionId, callback) {
	return await genericActions.create(baseUrl, user, sessionId, callback);
};

/* 
 * get all users
 * deprecated, use getAllUsersAsync() instead
 */
 /*
function getAllUsers() {
	return genericActions.getAll(baseUrl);
};
*/

/* 
 * get all users
 * sessionId: string, id of the current session
 */
async function getAllUsersAsync(sessionId){
	return await genericActions.getAllAsync(baseUrl, sessionId);
};

/* 
 * get one user specified by an id
 * deprecatd, use getUserAsync() instead
 * userId: string, the id of the user
 */
 /*
function getUser(userId) {
	return genericActions.getById(userId, baseUrl.concat(property).concat('/') );
};
*/

/* 
 * get one user specified by an id
 * ingredientId: string, the id of the ingredient
 * sessionId: string, id of the current session
 */
async function getUserAsync(userId, sessionId){
	return await genericActions.getByIdAsync(baseUrl, property, userId, sessionId);
};


/* 
 * update one user information
 * userId: string, the id of the user
 * sessionId: string, id of the current session
 * user: JSON object representing the updated info about the user
 */
async function updateUser(userId, sessionId, user, callback) {
	return await genericActions.updateById(baseUrl, property, userId, sessionId, user, callback);
};

/* 
 * delete one existing user
 * userId: string, the id of the user
 * sessionId: string, id of the current session
 */
async function deleteUser(userId, sessionId, callback) {
	const returnedData = await genericActions.deleteById(baseUrl, property, userId, sessionId, callback);
};

/*
 * function that checks if user could login with provided information
 * user: JSON object containing email and password
 */

async function authenticateAsync(user, callback){
    var completeUrl = '/users/authenticate';
	try {
    const res = await axios.post(completeUrl, user);
		console.log(res);
		callback(res);
    return;
  }
    catch(e) {
      console.log('there was an error');
      console.log(e.status);
      //TODO: different error message for different types of error
      if (e.response.status == 400 || e.response.status == 500)
        callback(e.response);
      else
        throw e;
    }
}

//export functions above for use by other modules
export { addUser, getAllUsersAsync, getUserAsync, updateUser, deleteUser, authenticateAsync};