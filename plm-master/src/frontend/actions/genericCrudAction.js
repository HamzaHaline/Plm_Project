//CrudActions.js
//defines CRUD functions that are common to database operations
import axios from 'axios';
/*****************
helper functions
*********************/

/**
 * appends session Id info to the end of url to accomodate changes made in routing
 * url: string, base url
 * sessionId: string
 * fromDukeOAuth: boolean, indicates
**/
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

/*************************
exported methods
*************************/

//All the methods below return the response on successful completion

/* create a new entry in the database
 * url: string, the url for the post request
 * object: JSON object
 * sessionId: string
 * callback: a function
 */
async function create(url, object, sessionId, callback) {
    console.log('generic creating');
	console.log(object);
	const completeUrl = appendSessionIdToUrl(url,sessionId);
	console.log("Sending create request to url " + completeUrl);
	try {
      	const res = await axios.post(completeUrl, object);
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
      else {
        console.log(e.response);
        throw e;
      }
    }
	
};


/* 
 * get all objects of a kind
 * url: string, the url for the get request
 * sessionId: string
 */
async function getAllAsync(url, sessionId) {
	var completeUrl = appendSessionIdToUrl(url,sessionId);
	console.log("generic CRUD: getAllAsync()");
	console.log("url: " + completeUrl);
	console.log("sessionId: ");
	console.log(sessionId);

	const res = await axios.get(completeUrl);
	const result = res.data;
	console.log(result);
	return result;
}

/* 
 * get one object with a specfic id
 * url: string, the base url for the get request
 * propertyName: string, segment in front of the objectId in the complete url used to identify what 
 * the next segment is
 * objectId: string, the id of the object as returned from the database
 * sessionId: string
 */
async function getByIdAsync(url, propertyName, objectId, sessionId) {
	// const urlWithoutSessionId = appendSegmentsToUrl(url, [propertyName, objectId]);
	// const completeUrl = appendSessionIdToUrl(urlWithoutSessionId, sessionId);

	const completeUrl = getCompleteUrlWithObjectId(url, propertyName, objectId, sessionId);

	// console.log("generic CRUD: getByIdAsync()");
	console.log("url: " + completeUrl);
	// console.log("sessionId: ");
	// console.log(sessionId);

	const res = await axios.get(completeUrl);
	const result = res.data;
	console.log("result from crud action");
	console.log(res);
	return result;
};

/* 
 * update one existing object by Id
 * url: string, the url for the put request
 * propertyName: string, segment in front of the objectId in the complete url used to identify what 
 * the next segment is
 * objectId: string, the id of the object
 * sessionId: string
 * newObject: JSON object representing the updated info about the object
 */
async function updateById(url, propertyName, objectId, sessionId, newObject, callback) {
	// const urlWithoutSessionId = appendSegmentsToUrl(url, [propertyName, objectId]);
	// const completeUrl = appendSessionIdToUrl(urlWithoutSessionId, sessionId);

	const completeUrl = getCompleteUrlWithObjectId(url, propertyName, objectId, sessionId);

	try {
	    console.log(newObject);
        const res = await axios.put(completeUrl, newObject);
        const result = res.data;
        console.log(result);
        callback(res);
    }
    catch(e) {
      console.log(newObject);
      console.log('there was an error');
      console.log(e);
      //TODO: different error message for different types of error
      if (e.response.status == 400 || e.response.status == 500)
        callback(e.response);
      else
        throw e;
    }
};

/*
 * delete one existing objct by id
 * url: string, the url for the delete request
 * propertyName: string, segment in front of the objectId in the complete url used to identify what 
 * the next segment is
 * objectId: string, the id of the object
 * sessionId: string
 */
async function deleteById(url, propertyName, objectId, sessionId, callback) {
	// const urlWithoutSessionId = appendSegmentsToUrl(url, [propertyName, objectId]);
	// const completeUrl = appendSessionIdToUrl(urlWithoutSessionId, sessionId);
    try {
	    const completeUrl = getCompleteUrlWithObjectId(url, propertyName, objectId, sessionId)
		console.log("DELETE send to " + completeUrl);
	    const res = await axios.delete(completeUrl);
	    console.log("res");
        console.log(res);
	    const result = res.data;
	    console.log("result");
	    console.log(result);
	    if(callback){
	    	callback(res);
	    }
	    
	}
	catch(e) {
      console.log('there was an error');
      console.log(e);
      //TODO: different error message for different types of error
      if (e.response.status == 400 || e.response.status == 500)
      	if(callback)
      	{
      		callback(e.response);
      	} else
      	{
      		alert(e.response);
      	}
        
      else
        throw e;
	}
};

/* 
 * delete all existing objects at a certain url
 * url: string, the url for the delete request
 * propertyName: string, segment following the base url
 * sessionId: string
 */
async function deleteAll(url, propertyName, sessionId, callback) {

	try {
        const urlWithoutSessionId = appendSegmentsToUrl(url, [propertyName]);
        const completeUrl = appendSessionIdToUrl(urlWithoutSessionId, sessionId);
        console.log("DELETE send to " + completeUrl);
        const res = await axios.delete(completeUrl);
        console.log("res");
        console.log(res);
        const result = res.data;
        console.log("result");
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
	
	// .then(function (response) {
	// 	console.log(response);
	// 	return response;
	// })
	// .catch(function (error) {
	// 	console.log(error);
	// });
};

//export functions above for use by other modules
export { create, getAllAsync, getByIdAsync, updateById, deleteById, deleteAll};