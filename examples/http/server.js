/*jslint node:true*/

'use strict';

var http = require('http');

var config = require('./config.json');

var respond = require('./respond');

http.createServer(function (request, response) {
	return respond(request, response);
}).listen(config.port);
