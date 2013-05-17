'use strict';

var uglifyjs = require('uglify-js');

// public api
var utils = module.exports = {};

/**
 * Convert (or _obfuscate_) a string to its escaped
 * hexidecimal representation.  For example,
 * `hex('a')` will return `'\x63'`.
 *
 * @api public
 * @name obfuscator.utils.hex
 * @param {String} str
 * @return {String}
 */
utils.hex = function (str) {
  var index,
      length = str.length,
      result = '';

  for (index = 0; index < length; index++) {
    result += '\\x' + str.charCodeAt(index).toString(16);
  }
  return result;
};

/**
 * Mangle simple strings contained in some `js`
 *
 * Strings will be _mangled_ by replacing each
 * contained character with its escaped hexidecimal
 * representation.  For example, "a" will render
 * to "\x63".
 *
 * Strings which contain non-alphanumeric characters
 * other than `.-_/` will be ignored.
 *
 * Strings not wrapped in double quotes will be ignored.
 *
 * Example:
 *
 * ```js
 * utils.strings('var foo = "foo"';);
 * //=> 'var foo = "\\x66\\x6f\\x6f";'
 * ```
 *
 * @api public
 * @name obfuscator.utils.strings
 * @param {String} js
 * @return {String}
 */
utils.strings = function (js) {
  var expression = /("[a-z\d\/\.\_\-]+")/gi;

  function replacer(match, str) {
    // remove leading and trailing quote marks
    var result = str.substr(1, str.length - 2);
    // escape to the string to hex
    result = utils.hex(result);
    // add quotes back
    result = '"' + result + '"';
    // done :)
    return result;
  }

  return js.replace(expression, replacer);
};

/**
 * Uglify some `js` without throwing an exception
 *
 * @api private
 * @param {String} js
 * @param {Function} cb
 */
utils.uglify = function (js, cb) {
  try {
    var code = uglifyjs.minify(js, { fromString: true }).code;
    cb(null, code);
  } catch (err) {
    cb(err);
  }
};
