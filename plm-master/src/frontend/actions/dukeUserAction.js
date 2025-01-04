// dukeUserAction.js

import axios from 'axios';

const baseUrlAutomatic = '/duke-users-bypass';

/* add one user
 * user: JSON object
 * callback: a function
 */
async function addDukeUserAutomaticAsync(dukeUser, callback) {
	console.log('Adding Duke User Automataically');
	console.log(dukeUser);
	try {
		console.log("Posting to " + baseUrlAutomatic);
    const res = await axios.post(baseUrlAutomatic, dukeUser);
  	console.log("Response obtained:")
    console.log(res);
		const result = res.data;
		console.log("Data in response:");
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

export { addDukeUserAutomaticAsync };