//ingredientAction.js
import axios from 'axios';
import * as genericActions from './genericCrudAction'
//All the methods return the response on successful completion

const baseUrl = '/ingredients';
const property = 'ingredient'; 

/* add one ingredient
 * ingredient: JSON object
 * sessionId: string, id of the current session
 */
async function addIngredient(ingredient, sessionId, callback) {
	//return await genericActions.create(baseUrl,ingredient,sessionId);
	genericActions.create(baseUrl,ingredient,sessionId, function(res){
	    callback(res);
	})
};

/* 
 * get all ingredients
 * deprecated, use getAllIngredientsAsync instead
 */
 /*
function getAllIngredients() {
	return genericActions.getAll(baseUrl);
	
};
*/

/* 
 * get all ingredients
 * sessionId: string, id of the current session
 */
async function getAllIngredientsAsync(sessionId){
	return await genericActions.getAllAsync(baseUrl, sessionId);
};
/* 
 * get one ingredient
 * deprecated, use getIngredientAsync instead
 * ingredientId: string, the id of the ingredient
 */
 /*
function getIngredient(ingredientId) {
	return genericActions.getById(ingredientId, baseUrl.concat(property).concat('/'));
};
*/

/* 
 * get one ingredient
 * ingredientId: string, the id of the ingredient
 * sessionId: string, id of the current session
 */
async function getIngredientAsync(ingredientId, sessionId){
	return await genericActions.getByIdAsync(baseUrl, property, ingredientId, sessionId);
};

/* 
 * update one ingredient
 * ingredientId: string, the id of the ingredient
 * sessionId: string, id of the current session
 * ingredient: JSON object representing the updated info about the ingredient
 */
async function updateIngredient(ingredientId, sessionId, ingredient, callback) {
	//return await genericActions.updateById(baseUrl, property, ingredientId, sessionId, ingredient);
	genericActions.updateById(baseUrl, property, ingredientId, sessionId, ingredient, function(res){
	    callback(res);
	});
};

function appendSessionIdToUrl(url, sessionId){
	// const sessionId = sessionId.sessionId;
	// const fromDukeOAuth = sessionId.fromDukeOAuth;
	console.log('sessionId: ' + sessionId );
	// console.log('fromDukeOAuth: ' + fromDukeOAuth);
	const userString = 'user';
	return appendSegmentsToUrl(url, [userString, sessionId]);
};

/**
 * Appends additional segment to the original url
 * Every url that is passed as argument should not end with /
 * originalUrl: string, where the text will be appended to, does not end with '/'
 * additionalSegments: array of string, what is to be appended at the end of the origianl url
 * returns originalText + '/' + (addtionalSegments seperated by '/')
 */
function appendSegmentsToUrl(originalUrl, additionalSegments){
	var intermediateUrl = originalUrl;
	additionalSegments.forEach(function(segment){
		intermediateUrl = intermediateUrl.concat('/').concat(segment);
	});
	const completeUrl = intermediateUrl;
	return completeUrl;
};

/**
 * Generates a url for posting, for axios methods that relates to a specific
 * object id
 * urlHeac: string, start of the url
 * propertyName: string, descrbies the object such as "ingredient"
 * objectId: string, id of the object
 * sessionId: string
 */
function getCompleteUrlWithObjectId(urlHead, propertyName, objectId, sessionId){
	const urlWithoutSessionId = appendSegmentsToUrl(urlHead, [propertyName, objectId]);
	const completeUrl = appendSessionIdToUrl(urlWithoutSessionId, sessionId);
	return completeUrl;
}

/* 
 * delete one existing ingredient
 * ingredientId: string, the id of the ingredient
 * sessionId: string, id of the current session
 */
async function deleteIngredient(ingredientId, sessionId, callback) {
	try {
        const completeUrl = getCompleteUrlWithObjectId(baseUrl, property, ingredientId, sessionId);
        const res = await axios.delete(completeUrl);
        const result = res.data;
        console.log(result);
        callback(res);
    }
    catch(e) {
      console.log('there was an error');
      console.log(e);
      //TODO: different error message for different types of error
      if (e.response.status == 400 || e.response.status == 500)
        callback(e.response);
      else
        throw e;
    }
};

//export functions above for use by other modules
export { addIngredient, getAllIngredientsAsync, getIngredientAsync, updateIngredient, deleteIngredient};