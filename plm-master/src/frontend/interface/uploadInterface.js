//uploadInterface.js
//This file contains methods for uploading the bulk import file

const axios = require('axios');
const FormData = require('form-data');

/*
 * upload the bulk import file for ingredients
 * form: multipart/formdata such as created by `const form = new FormData();`
 * sessionId: string, id of the current session
 */
async function uploadIngredient(form, sessionId, callback){
  const url = '/upload-ingredients/user/'.concat(sessionId);
  await upload(form, url, callback);

  // const config = { headers: { 'Content-Type': 'multipart/form-data' } };
  // try{
  //   const res = await axios.post('/upload/user/'.concat(sessionId), form, config);
  //   console.log(res.data);
  //   callback(res);
  // } catch(e) {
  //       console.log('there was an error');
  //       console.log(e);
  //       //TODO: different error message for different types of error
  //       if (e.response.status == 400 || e.response.status == 500)
  //         callback(e.response);
  //       else {
  //         console.log(e.response);
  //         throw e;
  //       }
  // }
};

/*
 * upload the bulk import file for formulas
 * form: multipart/formdata such as created by `const form = new FormData();`
 * sessionId: string, id of the current session
 */
async function uploadFormula(form, sessionId, callback){
  const url = '/upload-formulas/user/'.concat(sessionId);
  await upload(form, url, callback);

  // const config = { headers: { 'Content-Type': 'multipart/form-data' } };
  // try{
  //   const res = await axios.post('/upload/user/'.concat(sessionId), form, config);
  //   console.log(res.data);
  //   callback(res);
  // } catch(e) {
  //       console.log('there was an error');
  //       console.log(e);
  //       //TODO: different error message for different types of error
  //       if (e.response.status == 400 || e.response.status == 500)
  //         callback(e.response);
  //       else {
  //         console.log(e.response);
  //         throw e;
  //       }
  // }
};

async function uploadIntermediate(form, sessionId, callback){
  const url = '/upload-intermediates/user/'.concat(sessionId);
  await upload(form, url, callback);

  // const config = { headers: { 'Content-Type': 'multipart/form-data' } };
  // try{
  //   const res = await axios.post('/upload/user/'.concat(sessionId), form, config);
  //   console.log(res.data);
  //   callback(res);
  // } catch(e) {
  //       console.log('there was an error');
  //       console.log(e);
  //       //TODO: different error message for different types of error
  //       if (e.response.status == 400 || e.response.status == 500)
  //         callback(e.response);
  //       else {
  //         console.log(e.response);
  //         throw e;
  //       }
  // }
};

/**
 * Common steps shared by uploading formula and ingredients
 * form: multipart/formdata such as created by `const form = new FormData();`
 * url: the url for axios post request
 */
async function upload(form, url, callback){
  const config = { headers: { 'Content-Type': 'multipart/form-data' } };
  try{
    const res = await axios.post(url, form, config);
    console.log(res.data);
    callback(res);
  } catch(e) {
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
}


//export functions above for use by other modules
export { uploadIngredient, uploadFormula, uploadIntermediate };
