/*jslint node:true*/

'use strict';

var vows = require('vows'),
	assert = require('assert'),
	obfuscator = require('../lib/obfuscator'),
	Options = obfuscator.Options,
	suite = vows.describe('Obfuscator Options');

suite.addBatch({
	sanity: {
		topic: function () {
			return Options;
		},
		params: {
			'should take three': function (Options) {
				assert.lengthOf(Options, 3);
			},
			'should throw unless the first is an Array with length': function (Options) {
				// nothing
				assert.throws(function () {
					return new Options();
				}, TypeError);
				// empty array
				assert.throws(function () {
					return new Options([]);
				}, TypeError);
				// empty object
				assert.throws(function () {
					return new Options({});
				}, TypeError);
			},
			'should throw unless the second is a String with length': function (Options) {
				// nothing
				assert.throws(function () {
					return new Options([ '/foo/bar.js' ]);
				}, TypeError);
				// null
				assert.throws(function () {
					return new Options([ '/foo/bar.js' ], null);
				}, TypeError);
				// undefined
				assert.throws(function () {
					return new Options([ '/foo/bar.js' ], undefined);
				}, TypeError);
				// empty string
				assert.throws(function () {
					return new Options([ '/foo/bar.js' ], '');
				}, TypeError);
			},
			'should throw unless the third is a String with length': function (Options) {
				// nothing
				assert.throws(function () {
					return new Options([ '/foo/bar.js' ], '/quax/bax/');
				}, TypeError);
				// null
				assert.throws(function () {
					return new Options([ '/foo/bar.js' ], '/quax/bax/', null);
				}, TypeError);
				// undefined
				assert.throws(function () {
					return new Options([ '/foo/bar.js' ], '/quax/bax/', undefined);
				}, TypeError);
				// empty string
				assert.throws(function () {
					return new Options([ '/foo/bar.js' ], '/quax/bax/', '');
				}, TypeError);
			},
			'should not throw with valid params': function (Options) {
				return new Options([ '/foo/bar.js' ], '/quax/bax', '/foo/bar.js');
			}
		},
		'properties': {
			topic: function (Options) {
				return new Options([ '/foo/bar.js' ], '/quax/bax', '/foo/bar.js');
			},
			'should set "files"': function (options) {
				assert.deepEqual(options.files, [ '/foo/bar.js' ]);
			},
			'should set "root"': function (options) {
				assert.strictEqual(options.root, '/quax/bax');
			},
			'should set "entry"': function (options) {
				assert.strictEqual(options.entry, '/foo/bar.js');
			}
		}
	}
});

suite.exportTo(module);
