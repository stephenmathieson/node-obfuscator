
'use strict';

var fs = require('fs');
var path = require('path');
var uglify = require('uglify-js');
var utils = require('./utils');

var rJSON = /\.json$/;
var __require = fs.readFileSync(path.join(__dirname, './require.js'), 'utf-8');

module.exports = obfuscator;


/**
 * Obfuscate and concatenate a NodeJS _"package"_
 * because corporate says so.
 *
 * @api public
 * @param {Object} options The options
 * @param {Function} cb Callback: `function (err, obfuscated)`
 */

function obfuscator(options, cb) {
  if (!options.files || !options.root || !options.entry) {
    return cb(new TypeError('Invalid options'));
  }

  obfuscator.concatenate(options, function (err, code) {
    if (err) {
      return cb(err);
    }

    utils.uglify(code, options, cb);
  });
}

// back-compat alias
obfuscator.obfuscator = obfuscator;

/**
 * Expose the current version
 *
 * @api private
 * @type {String}
 */

obfuscator.version = require('../package').version;

/**
 * Expose utils
 *
 * @api private
 * @type {Object}
 */

obfuscator.utils = utils;

/**
 * Create an `options` object for the `obfuscator`
 *
 * Aliases (for back-compat):
 *
 * - `Options`
 * - `ObfuscatorOptions`
 *
 *
 * Examples:
 *
 * ```js
 * var opts = new obfuscator.Options(
 *   // files
 *   [ './myfile.js', './mydir/thing.js'],
 *   // root
 *   './',
 *   // entry
 *   'myfile.js',
 *   // strings
 *   true)
 *
 * var opts = obfuscator.options({...})
 * ```
 *
 * @api public
 * @param {Array} files The files contained in the package
 * @param {String} root The root of the package
 * @param {String} entry The entry point
 * @param {Boolean} [strings] Shall strings be obfuscated
 * @return {Object}
 */

obfuscator.options = function (files, root, entry, strings) {
  // TODO support globbling
  if (!Array.isArray(files) || !files.length) {
    throw new TypeError('Invalid files array');
  }

  if (typeof root !== 'string' || !root) {
    throw new TypeError('Invalid root directory');
  }

  if (typeof entry !== 'string' || !entry) {
    throw new TypeError('Invalid entry point');
  }

  return {
    files: files,
    root: root,
    entry: dotslash(entry),
    strings: strings
  };
};

// alias
obfuscator.Options =
obfuscator.ObfuscatorOptions = obfuscator.options;

/**
 * Register a `file` in location to `root`
 *
 * @api private
 * @param {String} root
 * @param {String} file
 * @param {Function} cb
 */

obfuscator.register = function (root, file, cb) {
  var filename = dotslash(path.relative(root, file));

  fs.readFile(file, 'utf-8', function (err, data) {
    if (err) {
      return cb(err);
    }

    var code =
        'require.register("' + filename + '",'
      + 'function (module, exports, require) {'
      + (rJSON.test(file)
          // just export json
          ? 'module.exports = ' + data + ';'
          // add the file as is
          : data) + '\n'
      + '});';
    return cb(null, code);
  });
};

/**
 * Concatenate a list of files for pre-obfuscation
 *
 * @api private
 * @param {Object} options
 * @param {Function} [cb]
 */

obfuscator.concatenate = function (options, cb) {
  var entry = dotslash(path.relative(options.root, options.entry));
  var index = -1;
  var built = [];

  function complete() {
    // export the exported stuff from entry
    built.push('this_module.exports = require("' + entry + '");');
    // end iffe
    built.push('}(require, module));');
    // done :)
    cb(null, built.join('\n'));
  }

  // begin iffe with access to node's native
  // require and the current module
  built.push('(function (native_require, this_module) {');
  // add the `require` shim
  built.push(__require);

  (function next() {
    index++;
    var file = options.files[index];

    // no remaining files?
    if (!file) {
      return complete();
    }

    // register the file
    obfuscator.register(options.root, file, function (err, data) {
      if (err) {
        return cb(err);
      }

      built.push(data);
      next();
    });
  }());
};

/**
 * Force a filepath to start with _./_
 *
 * @api private
 * @param {String} filepath
 * @return {String}
 */

function dotslash(filepath) {
  filepath = filepath.replace(/\\/g, '/');
  switch (filepath[0]) {
  case '.':
  case '/':
    return filepath;
  default:
    return './' + filepath;
  }
}
