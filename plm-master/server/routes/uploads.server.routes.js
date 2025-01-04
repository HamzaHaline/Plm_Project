//uploads.server.routes.js
//This file handles routing for uploading the bulk-import file

var express = require('express');
var router = express.Router();
var util = require("util");
var fs = require("fs");
var ingredients = require('../controllers/ingredients.server.controller');
var formulas = require('../controllers/formulas.server.controller');

module.exports = function(app) {
	app.route('/upload-ingredients/user/:userId').post(function(req, res, next){
		if (req.files) {
			console.log(util.inspect(req.files));
			const filePath = './'.concat(req.files[0].path);
			console.log(filePath);
			const content = fs.readFileSync(filePath, 'utf8');
			// console.log(content);
			ingredients.bulkImportIngredients(req, res, next, content, function(){
			    fs.unlinkSync(filePath);
			});
		}
	});

	app.route('/upload-formulas/user/:userId').post(function(req, res, next){
		if (req.files) {
			console.log(util.inspect(req.files));
			const filePath = './'.concat(req.files[0].path);
			console.log(filePath);
			const content = fs.readFileSync(filePath, 'utf8');
			// console.log(content);
			formulas.bulkImportFormulas(req, res, next, content, function(){
			    fs.unlinkSync(filePath);
			});
		}
	});

	app.route('/upload-intermediates/user/:userId').post(function(req, res, next){
        if (req.files) {
            console.log(util.inspect(req.files));
            const filePath = './'.concat(req.files[0].path);
            console.log(filePath);
            const content = fs.readFileSync(filePath, 'utf8');
            // console.log(content);
            formulas.bulkImportIntermediate(req, res, next, content, function(){
                fs.unlinkSync(filePath);
            });
        }
    });

};
