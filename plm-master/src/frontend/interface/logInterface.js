import * as logActions from '../actions/logAction'

async function getAllLogsAsync(sessionId) {
	return await logActions.getAllLogsAsync(sessionId);
}

export { getAllLogsAsync };