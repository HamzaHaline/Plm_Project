import axios from 'axios';
import * as genericActions from './genericCrudAction'

const baseUrl = '/logs';

async function getAllLogsAsync(sessionId){
	console.log("Action: getAllVendorsAsync()");
	console.log("sessionId: " + sessionId);
	return await genericActions.getAllAsync(baseUrl, sessionId);
};

export { getAllLogsAsync };