// based on TJ Holowaychuk's commonjs require binding

/*global native_require*/

// jshint maxcomplexity: 5, maxstatements: 15

function require(p) {
	var path, module;

	// third-party module?  use native require
	if (p[0] !== '.') {
		return native_require(p);
	}

	if (require.json.test(p)) {
		// TODO hack: all json must be contained in project root
		return native_require('./' + require.basename(p));
	}

	path = require.resolve(p);
	module = require.cache[path];

	if (!module) {
		throw new Error('failed to require "' + p + '"');
	}

	if (!module.exports) {
		module.exports = {};
		module.call(module.exports, module, module.exports,
			require.relative(path));
	}

	return module.exports;
}

require.json = /\.json$/i;

// same as node's `require`
require.cache = {};

// node's native `path.basename`
require.basename = native_require('path').basename;

require.resolve = function (path) {
	var orig = path,
		reg = path + '.js',
		index = path + '/index.js';

	return (require.cache[reg] && reg) ||
		(require.cache[index] && index) || orig;
};

require.register = function (path, fn) {
	require.cache[path] = fn;
};

require.relative = function (parent) {
  function _relative(p) {
		var path, segs, i, len, seg;

		if ('.' !== p[0]) {
			return require(p);
		}

		path = parent.split('/');
		segs = p.split('/');
		path.pop();

		for (i = 0, len = segs.length; i < len; i += 1) {
			seg = segs[i];
      if (seg === '..') {
				path.pop();
      } else if (seg !== '.') {
				path.push(seg);
			}
		}

		return require(path.join('/'));
	}

	_relative.resolve = function (p) {
		// TODO hack: all json must be contained in project root
    return require.json.test(p)
        ? './' + require.basename(p)
        : require.resolve(p);
	};
	_relative.cache = require.cache;

	return _relative;
};
