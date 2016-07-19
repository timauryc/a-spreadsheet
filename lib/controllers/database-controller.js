'use strict';

var connectionStringA = require('../../conf/axpo-spreadsheet').POSTGRE.connectionStringA;
var connectionStringB = require('../../conf/axpo-spreadsheet').POSTGRE.connectionStringB;
var tablename = require('../../conf/axpo-spreadsheet').POSTGRE.tablename;
var pg = require('pg');
var async = require('async');
var logger = require('../logger/logger');


function updateDatabase(password, collumNames, dataToInsert, callback) {
    async.waterfall([
            function(callback) {
                var query = 'INSERT INTO ' + tablename + '(' + collumNames + ', db_insertion_date, \"Content Created\"' + ') VALUES ' + dataToInsert;
                return callback(null, query);
            },
            function(query, callback) {
                var client = new pg.Client(connectionStringA + password + connectionStringB);
                client.connect(function(err) {
                    if (err) {
                        logger.writeLog('error', 'Error on connecting to the database.' +
                            '. File: database-controller.js' +
                            '. Function: updateDatabase' +
                            '. ErrorMessage: ' + err);
                        callback(err);
                    }
                    logger.writeLog('info', 'Success on connecting to the dtaabase.' +
                        '. File: database-controller.js' +
                        '. Function: updateDatabase');
                    client.query(query, function(err, result) {
                        if (err) {
                            logger.writeLog('error', 'Error on completing the query.' +
                                '. File: database-controller.js' +
                                '. Function: updateDatabase' +
                                '. ErrorMessage: ' + err);
                            callback(err);
                        }
                        logger.writeLog('info', 'Success on completing the query.' +
                            '. File: database-controller.js' +
                            '. Function: updateDatabase');
                        client.end();
                        callback(null, 'query successful');
                    });
                });
            }
        ],
        function(err, result) {
            if (err) {
                return callback(err);
            } else {
                return callback(null, result);
            }

        });
}

module.exports = {
    updateDatabase: updateDatabase
};