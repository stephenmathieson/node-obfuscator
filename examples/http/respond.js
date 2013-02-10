/*jslint node:true*/

'use strict';

var url = require('url');

var config = require('./config.json');

module.exports = function (request, response) {
	var parsed = url.parse(request.url, true);

	response.writeHead(200, { 'Content-Type': 'text/plain' });
	if (parsed.query.foo === 'bar') {
		response.write(config.bar);
	} else {
		response.write(config.foo);
	}
	response.end();
};
