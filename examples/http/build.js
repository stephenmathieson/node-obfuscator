/*jslint node:true, nomen:true*/

'use strict';

var fs = require('fs');

var obfuscator = require('../../lib/obfuscator').obfuscator;

var Options = require('../../lib/obfuscator').ObfuscatorOptions;

var files = [
	'respond.js',
	'server.js'
];

var root = __dirname;

var entry = 'server';

var options = new Options(files, root, entry);

obfuscator(options, function (err, built) {
	if (err) {
		throw err;
	}

	fs.writeFile('./obfuscated.js', built, function (err) {
		if (err) {
			throw err;
		}

		console.log('\x1B[36mwrote\x1B[39m', 'obfuscated.js');
	});
});
