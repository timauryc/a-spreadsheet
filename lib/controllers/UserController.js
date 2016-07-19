'use strict';

var spreadsheetController = require('../controllers').spreadSheetController;
var databaseController = require('../controllers').databaseController;

var UserController = function() {};

UserController.prototype.uploadFile = function(req, res) {
	console.log('i received a post');
	// We are able to access req.files.file thanks to 
	// the multiparty middleware
	var filePath = req.files.file.path;
	var password = req.body.password;
	spreadsheetController.getFileData(filePath, function(err, columnNames, dataToInsert) {
		if (err) {
			console.log('error: ', err);
		} else {
			databaseController.updateDatabase(password, columnNames, dataToInsert, function(err, result) {
				if (err) {
					console.log('error: ', err);
					res.status(500).send(err.detail);
				} else {
					console.log('response: ', result);
					res.status(200).send({
						response: result
					});
				}
			});
		}
	});
}

module.exports = new UserController();