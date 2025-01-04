// utils.js

function createSessionInfoObject(sessionId, fromDukeOAuth){
	var sessionInfoJson = new Object();
	sessionInfoJson.sessionId = sessionId;
	sessionInfoJson.fromDukeOAuth = fromDukeOAuth;
	console.log("Created session info JSON object:")
	console.log(sessionInfoJson);
	return sessionInfoJson;
}

export {createSessionInfoObject};