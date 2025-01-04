//sessionId.js
const userId = '5a6a5977f5ce6b254fe2a91f';
//for testing purpose only.
const BACK_DOOR_OPEN = false; //TODO: when deploying, change to false
const READ_FROM_DATABASE = true;
const superId = 'real-producers-root';
//
const sessionId = (BACK_DOOR_OPEN ? superId : userId);

export {sessionId, READ_FROM_DATABASE};
