/*jslint node:true*/

'use strict';

module.exports = function (grunt) {
	/*jslint nomen:true*/

	grunt.initConfig({
		obfuscator: {

			/* http example
			files: [
				'examples/http/respond.js',
				'examples/http/server.js'
			],
			entry: 'server',
			root: __dirname + '/examples/http',
			out: 'examples/http/obfuscated.js'
			*/

			/* express example
			 */
			files: [
				'examples/express/routes/index.js',
				'examples/express/routes/user.js',
				'examples/express/app.js'
			],
			entry: 'app',
			root: __dirname + '/examples/express',
			out: 'examples/express/obfuscated.js'
		}

	});

	// Load local tasks.
	grunt.loadTasks('./tasks');

	// Default task.
	grunt.registerTask('default', 'obfuscator');

};
