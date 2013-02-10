// based on TJ Holowaychuk's commonjs require binding

/*global native_require*/

function require(p) {
	'use strict';

	var path, module;

	// third-party module?  use native require
	if (p[0] !== '.') {
		return native_require(p);
	}

	if (/\.json$/.test(p)) {
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

// same as node's `require`
require.cache = {};

// node's native `path.basename`
require.basename = native_require('path').basename;

require.resolve = function (path) {
	'use strict';

	var orig = path,
		reg = path + '.js',
		index = path + '/index.js';

	return (require.cache[reg] && reg) ||
		(require.cache[index] && index) || orig;
};

require.register = function (path, fn) {
	'use strict';

	require.cache[path] = fn;
};

require.relative = function (parent) {
	'use strict';

	var relativeRequire = function (p) {
		var path, segs, index, seg;

		if ('.' !== p[0]) {
			return require(p);
		}

		path = parent.split('/');
		segs = p.split('/');
		path.pop();

		for (index = 0; index < segs.length; index += 1) {
			seg = segs[index];
			if ('..' === seg) {
				path.pop();
			} else if ('.' !== seg) {
				path.push(seg);
			}
		}

		return require(path.join('/'));
	};

	relativeRequire.resolve = function (p) {
		// TODO hack: all json must be contained in project root
		if (/\.json$/.test(p)) {
			return './' + require.basename(p);
		}
		return require.resolve(p);
	};
	relativeRequire.cache = require.cache;

	return relativeRequire;
};
