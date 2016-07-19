'use strict';


var logger = require('../logger/logger');
var XLSX = require('xlsx');
var columnMapping = require('../columnMapping').columnMapping;
var letterMapping = require('../letterMapping').letterMapping;

function getFileData(filePath, callback) {
    try {
        var workbook = XLSX.readFile(filePath);
    } catch (err) {
        return callback(err);
    }


    var first_sheet_name = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[first_sheet_name];

    var spreadSheetLabels = [];
    var columnNames = [];
    var dataToInsert = [];
    var dataRow = [];

    var finalCollumn;

    for (var z in worksheet) {
        if (z[0] === '!') {
            finalCollumn = worksheet[z].split(':')[1][0];
            //continue;
        } else {
            var collumn = z[0];
            var row = z.substring(1);

            if (row == 1) {
                //insertanto los labels
                if (collumn != finalCollumn) {
                    spreadSheetLabels.push(worksheet[z].v);
                }
            } else {
                //insertando valores
                if (collumn === finalCollumn) {
                    if (dataRow.length === (letterMapping[finalCollumn] - 1)) {
                        //adding the insert date
                        var today = new Date();
                        var timeStamp = '\'' + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds() + '\'';
                        dataRow.push(timeStamp);

                        //adding the creation date
                        var createdDate = new Date(workbook.Props.CreatedDate);
                        createdDate = '\'' + createdDate.getFullYear() + '-' + (createdDate.getMonth() + 1) + '-' + createdDate.getDate() + ' ' + createdDate.getHours() + ':' + createdDate.getMinutes() + ':' + createdDate.getSeconds() + '\'';
                        dataRow.push(createdDate);

                        //inserting the new row
                        dataToInsert.push('(' + dataRow.join() + ')');
                    }
                    dataRow = [];
                } else {
                    dataRow.push(JSON.stringify(worksheet[z].w.replace(/\'/g, "")).replace(/"/g, "'").replace(/,/g, ""));
                }
            }
        }
    }

    //dataToInsert.shift();
    dataToInsert = dataToInsert.join();
    for (var i in spreadSheetLabels) {
        columnNames.push(columnMapping[spreadSheetLabels[i]]);
    }
    columnNames = columnNames.join();

    return callback(null, columnNames, dataToInsert);
}

module.exports = {
    getFileData: getFileData
};