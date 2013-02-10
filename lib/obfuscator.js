/*jslint node:true*/

'use strict';

var fs = require('fs');

var path = require('path');

var uglify = require('uglify-js');

var rJSON = /\.json$/;

/**
 * Concatenate a node package together, wrapping in an IFFE with a `require`
 * stub.
 *
 * @async
 * @param  {ObfuscatorOptions} options The options
 * @param  {Function} next Callback function: `function (err, concatenated)`
 */
function concatenate(options, next) {
	/*jslint nomen:true*/

	var entry = options.entry,
		root = options.root,
		files = options.files,
		pending = files.length;

	// leading `./`
	if (entry[0] !== '.') {
		entry = './' + entry;
	}

	fs.readFile(path.join(__dirname, 'require.js'), 'utf-8',
		function (err, data) {
			if (err) {
				return next(err);
			}

			var built = [];

			// begin the IFFE
			built.push('(function (native_require) {');
			// add require sham
			built.push(data);

			files.forEach(function (file) {

				var filePath = path.relative(root, file);

				// leading `./`
				if (filePath[0] !== '.') {
					filePath = './' + filePath;
				}

				fs.readFile(file, 'utf-8', function (err, data) {
					if (err) {
						return next(err);
					}

					// register the function in our "require" impl
					built.push('require.register("' + filePath + '", ' +
						'function (module, exports, require) {');

					if (rJSON.test(filePath)) {
						// special treatment of JSON:
						//   `module.exports = {{ the JSON }};`
						(function handleJSON() {
							built.push('module.exports = ' + data + ';');
						}());
					} else {
						// javascript sources can just be pushed into the stack
						built.push(data);
					}

					built.push('});');

					pending -= 1;
					if (!pending) {
						// add entry point
						built.push('require("' + entry + '");');
						// close the IFFE
						built.push('}(require));');
						return next(null, built.join('\n'));
					}

				});
			});
		});
}

/**
 * [ObfuscatorOptions description]
 *
 * @constructor
 * @param {Array} files The files subject to "build"; must be a
 *                      fully-qualified filepath
 * @param {String} root The root directory of the project
 * @param {String} entry The entry point of the application; for example,
 *                       in express, `app.js`
 */
function ObfuscatorOptions(files, root, entry) {

	if (!Array.isArray(files) || !files.length) {
		throw new TypeError('Invalid files array');
	}

	if (typeof root !== 'string' || !root.length) {
		throw new TypeError('Invalid root directory');
	}

	if (typeof entry !== 'string' || !entry.length) {
		throw new TypeError('Invalid entry point');
	}

	this.files = files;
	this.root = root;
	this.entry = entry;
}

/**
 * Obfuscate and concatenate a NodeJS "package" because corporate says so.
 *
 * @async
 * @param {ObfuscatorOptions} options The options
 * @param {Function} next Callback function: `function (err, obfuscated)`
 */
function obfuscator(options, next) {
	if (!options instanceof ObfuscatorOptions) {
		return next(new Error('invalid obfuscator options'));
	}

	return concatenate(options, function (err, builtPackage) {
		if (err) {
			return next(err);
		}

		// UglifyJS really should have an async option, allowing you to
		// handle errors...
		try {
			return next(null, uglify.minify(builtPackage, {
				'fromString': true
			}).code);
		} catch (uglifyError) {
			return next(uglifyError);
		}
	});
}

module.exports = {
	'obfuscator': obfuscator,
	// mirror
	'Options': ObfuscatorOptions,
	'ObfuscatorOptions': ObfuscatorOptions
};

/*
///////////////////
// Example usage //
///////////////////

var files = [
	'/Users/stephenmathieson/work/node-obfuscator/test/http/respond.js',
	'/Users/stephenmathieson/work/node-obfuscator/test/http/server.js'
];
var root = '/Users/stephenmathieson/work/node-obfuscator/test/http/';
var entry = 'server';

var options = new ObfuscatorOptions(files, root, entry);

obfuscator(options, function (err, built) {
	if (err) {
		throw err;
	}

	console.log(built);
});
*/

/*

var files = [
	// configuration
	//'/Users/stephenmathieson/work/amaze/server/config.json',

	// root
	'/Users/stephenmathieson/work/amaze/server/lib/js-document.js',
	'/Users/stephenmathieson/work/amaze/server/lib/list-directory.js',
	'/Users/stephenmathieson/work/amaze/server/lib/obfuscate.js',
	'/Users/stephenmathieson/work/amaze/server/lib/sort-by.js',
	'/Users/stephenmathieson/work/amaze/server/lib/development.js',

	// models
	'/Users/stephenmathieson/work/amaze/server/lib/models/injection.js',
	'/Users/stephenmathieson/work/amaze/server/lib/models/mutation.js',
	'/Users/stephenmathieson/work/amaze/server/lib/models/site.js',
	'/Users/stephenmathieson/work/amaze/server/lib/models/styles.js',
	'/Users/stephenmathieson/work/amaze/server/lib/models/utility.js',

	// routing
	'/Users/stephenmathieson/work/amaze/server/lib/routing/bind.js',
	'/Users/stephenmathieson/work/amaze/server/lib/routing/cookies.js',
	'/Users/stephenmathieson/work/amaze/server/lib/routing/index.js',

	// routing/builders
	'/Users/stephenmathieson/work/amaze/server/lib/routing/builders/amazeme.js',
	'/Users/stephenmathieson/work/amaze/server/lib/routing/builders/bcl.js',
	'/Users/stephenmathieson/work/amaze/server/lib/routing/builders/index.js',
	'/Users/stephenmathieson/work/amaze/server/lib/routing/builders/overlays.js',
	'/Users/stephenmathieson/work/amaze/server/lib/routing/builders/sites.js',

	// routing/routes
	'/Users/stephenmathieson/work/amaze/server/lib/routing/routes/500.js',
	'/Users/stephenmathieson/work/amaze/server/lib/routing/routes/amazeme.js',
	'/Users/stephenmathieson/work/amaze/server/lib/routing/routes/bcl.js',
	'/Users/stephenmathieson/work/amaze/server/lib/routing/routes/overlays.js',
	'/Users/stephenmathieson/work/amaze/server/lib/routing/routes/sites.js',

	// routing/routes/gui
	'/Users/stephenmathieson/work/amaze/server/lib/routing/routes/gui/index.js',
	'/Users/stephenmathieson/work/amaze/server/lib/routing/routes/gui/rename.js',

	// routing/routes/gui/create
	'/Users/stephenmathieson/work/amaze/server/lib/routing/routes/gui/create/injection.js',
	'/Users/stephenmathieson/work/amaze/server/lib/routing/routes/gui/create/mutation.js',
	'/Users/stephenmathieson/work/amaze/server/lib/routing/routes/gui/create/site.js',
	'/Users/stephenmathieson/work/amaze/server/lib/routing/routes/gui/create/utility.js',

	// routing/routes/gui/edit
	'/Users/stephenmathieson/work/amaze/server/lib/routing/routes/gui/edit/bcl.js',
	'/Users/stephenmathieson/work/amaze/server/lib/routing/routes/gui/edit/injection.js',
	'/Users/stephenmathieson/work/amaze/server/lib/routing/routes/gui/edit/mutation.js',
	'/Users/stephenmathieson/work/amaze/server/lib/routing/routes/gui/edit/regex.js',
	'/Users/stephenmathieson/work/amaze/server/lib/routing/routes/gui/edit/styles.js',
	'/Users/stephenmathieson/work/amaze/server/lib/routing/routes/gui/edit/utility.js',

	// routing/routes/gui/view
	'/Users/stephenmathieson/work/amaze/server/lib/routing/routes/gui/view/injections.js',
	'/Users/stephenmathieson/work/amaze/server/lib/routing/routes/gui/view/mutations.js',
	'/Users/stephenmathieson/work/amaze/server/lib/routing/routes/gui/view/site.js',
	'/Users/stephenmathieson/work/amaze/server/lib/routing/routes/gui/view/sites.js',
	'/Users/stephenmathieson/work/amaze/server/lib/routing/routes/gui/view/utilities.js',

	// utils
	'/Users/stephenmathieson/work/amaze/server/lib/util/get-overlay-by-name.js',
	'/Users/stephenmathieson/work/amaze/server/lib/util/index.js',
	'/Users/stephenmathieson/work/amaze/server/lib/util/load-action.js',
	'/Users/stephenmathieson/work/amaze/server/lib/util/load-bcl.js',
	'/Users/stephenmathieson/work/amaze/server/lib/util/load-fingerprint.js',
	'/Users/stephenmathieson/work/amaze/server/lib/util/load-injection-by-name.js',
	'/Users/stephenmathieson/work/amaze/server/lib/util/load-injections.js',
	'/Users/stephenmathieson/work/amaze/server/lib/util/load-mutation-by-name.js',
	'/Users/stephenmathieson/work/amaze/server/lib/util/load-mutations.js',
	'/Users/stephenmathieson/work/amaze/server/lib/util/load-regex.js',
	'/Users/stephenmathieson/work/amaze/server/lib/util/load-runtime.js',
	'/Users/stephenmathieson/work/amaze/server/lib/util/load-site-by-name.js',
	'/Users/stephenmathieson/work/amaze/server/lib/util/load-sites.js',
	'/Users/stephenmathieson/work/amaze/server/lib/util/load-styles.js',
	'/Users/stephenmathieson/work/amaze/server/lib/util/load-utilities.js',
	'/Users/stephenmathieson/work/amaze/server/lib/util/load-utility-by-name.js'
];
var root = '/Users/stephenmathieson/work/amaze/server/';
var entry = 'lib/development';

var options = new ObfuscatorOptions(files, root, entry);

obfuscator(options, function (err, built) {
	if (err) {
		throw err;
	}

	console.log(built);
});

*/
