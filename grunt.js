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
		},
		jslint: {
			files: [
				'grunt.js',
				'lib/*.js',
				'test/**/*.js',
				'bin/obfuscator'
			],
			directives: {
				node: true,
				todo: true,
				nomen: true
			},
			options: {
				shebang: true
			}
		}

	});

	// Load local tasks.
	grunt.loadTasks('./tasks');

	// load grunt-jslint
	grunt.loadNpmTasks('grunt-jslint');

	// Default task.
	grunt.registerTask('default', 'obfuscator');

};
