'use strict';

var nconf = require('nconf');

nconf.argv()
  .env()
  .file(process.cwd() + '/conf/axpo-spreadsheet.json');

module.exports = nconf;