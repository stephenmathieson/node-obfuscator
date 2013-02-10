/*jslint node:true, nomen:true*/

'use strict';

var vows = require('vows');

var assert = require('assert');

var fs = require('fs');

var vm = require('vm');

var REQUIRE_PATH = require('path').join(__dirname, '../lib/require.js');

var suite = vows.describe('require');

suite.addBatch({
	'require sham': {
		topic: function () {
			var callback = this.callback,
				context = vm.createContext({
					'native_require': require
				});

			fs.readFile(REQUIRE_PATH, 'utf-8', function (err, data) {
				if (err) {
					return callback(err);
				}

				vm.runInContext(data, context);

				return callback(null, context.require);
			});
		},
		'should not error': function (err, require) {
			assert.ifError(err);
		},
		'should be a function': function (err, require) {
			assert.isFunction(require);
		},
		'should accept an "id" param': function (err, require) {
			assert.lengthOf(require, 1);
		},
		methods: {
			'should have a "basename" method': function (require) {
				assert.isFunction(require.basename);
			},
			'should have a "resolve" method': function (require) {
				assert.isFunction(require.resolve);
			},
			'should have a "register" method': function (require) {
				assert.isFunction(require.register);
			},
			'should have a "relative" method': function (require) {
				assert.isFunction(require.relative);
			},
			basename: {
				topic: function (require) {
					return require.basename;
				},
				'should accept a "path" and an "ext" param': function (basename) {
					assert.lengthOf(basename, 2);
				},
				'basename("foo.js")': function (basename) {
					assert.equal(basename('foo.js'), 'foo.js');
				},
				'basename("/bar/foo.js")': function (basename) {
					assert.equal(basename('foo.js'), 'foo.js');
				},
				'basename("/bar/foo.js", ".js")': function (basename) {
					assert.equal(basename('/bar/foo.js', '.js'), 'foo');
				},
				'basename("../../bar/foo.js")': function (basename) {
					assert.equal(basename('../../bar/foo.js'), 'foo.js');
				},
				'basename("../../bar/foo.js", ".js")': function (basename) {
					assert.equal(basename('../../bar/foo.js', '.js'), 'foo');
				}
			},
			register: {
				topic: function (require) {
					return require.register;
				},
				'should accept a "path" and a "fn" param': function (register) {
					assert.lengthOf(register, 2);
				}
			}
		},
		'within a module': {
			topic: function (require) {
				var callback = this.callback;

				// must start with leading `.`
				require.register('./my/module.js', function (module, exports, require) {
					return callback(null, require);
				});

				process.nextTick(function () {
					require('./my/module.js');
				});
			},
			'should have access to the cache': function (err, require) {
				assert.isObject(require.cache);
			},
			'should have access to the "resolve" method': function (err, require) {
				assert.isFunction(require.resolve);
			}
		}
	}
});

suite.exportTo(module);
