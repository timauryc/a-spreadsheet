'use strict';
var config = require('./config');
var express = require('express');
var app = express();

process.title = 'Dunning Report Service';

console.log('Im running');

//Cors module
var cors = require('cors');
app.use(cors());

// Requires multiparty 
var multiparty = require('connect-multiparty');
var	multipartyMiddleware = multiparty();

// Requires controller
var	UserController = require('./controllers/UserController');

// Example endpoint 
app.post('/axpo/dunning/upload', multipartyMiddleware, UserController.uploadFile);

app.listen(process.env.PORT || config.get('PORT'), function() {
	console.log('listening on port: ', process.env.PORT || config.get('PORT'));
});

module.exports = app;