
'use strict';

var uglifyjs = require('uglify-js'),
    merge = require('util')._extend;


/**
 * Create an `AST` from the given `js`, invoking `cb(err, ast)`
 *
 * @api private
 * @param {String} js
 * @param {Function} cb
 */
exports.ast = function (js, cb) {
  try {
    var ast = uglifyjs.parse(js);
    cb(null, ast);
  } catch (err) {
    var e = new Error(err.message);
    // cheap hack to use actual errors
    // rather than the indecipherable JS_Parse_Error garbage
    merge(e, err);
    // expose the bad js
    e.source = js;
    cb(e);
  }
};


/**
 * Compress the given `ast`, conditionally using `opts`
 *
 * @api private
 * @param {Object} [opts]
 * @return {AST}
 */
exports.compress = function (ast, opts) {
  opts = opts || exports.compress.defaults;

  var compressor = uglifyjs.Compressor(opts);

  // for some stupid reason, this is the
  // only non-modifier method...
  return ast.transform(compressor);
};


/**
 * Default compression options
 *
 * @api private
 * @type {Object}
 */
exports.compress.defaults = {
  sequences: true,
  properties: true,
  dead_code: true,
  drop_debugger: true,
  unsafe: true,
  conditionals: true,
  comparisons: true,
  evaluate: true,
  booleans: true,
  loops: true,
  unused: true,
  hoist_funs: true,
  hoist_vars: true,
  if_return: true,
  join_vars: true,
  cascade: true,
  warnings: false
};


/**
 * Uglify the given `js` with `opts`
 *
 * @api private
 * @param {String} js
 * @param {Object} [opts]
 * @param {Function} cb
 */
exports.uglify = function (js, opts, cb) {
  /**
   * Handle mangling and compression of the generated `AST`
   *
   * @api private
   * @param {Error} err
   * @param {AST} ast
   */
  function handleAST(err, ast) {
    if (err) {
      return cb(err);
    }

    ast.figure_out_scope();
    ast.mangle_names();
    ast = exports.compress(ast, opts.compressor);

    var str = ast.print_to_string();

    return cb(null, opts.strings ? exports.strings(str) : str);
  }

  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }

  // build the AST
  exports.ast(js, handleAST);
};


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
exports.hex = function (str) {
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
exports.strings = function (js) {
  var expression = /("[a-z\d\/\.\_\-]+")/gi;

  function replacer(match, str) {
    // remove leading and trailing quote marks
    var result = str.substr(1, str.length - 2);
    // escape to the string to hex
    result = exports.hex(result);
    // add quotes back
    result = '"' + result + '"';
    // done :)
    return result;
  }

  return js.replace(expression, replacer);
};
