
'use strict';

var uglifyjs = require('uglify-js');
var merge = require('util')._extend;

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
    if (err) return cb(err);

    var stream = new uglifyjs.OutputStream;

    ast.figure_out_scope();
    ast.mangle_names();
    ast = exports.compress(ast, opts.compressor);

    if (opts.strings) {
      ast = mangleStrings(ast);
      // disable uglify's string escaping to prevent
      // double escaping our hex
      stream.print_string = function (str) {
        return this.print('"' + str + '"');
      };
    }

    ast.print(stream);
    return cb(null,  stream.toString());
  }

  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }

  // build the AST
  exports.ast(js, handleAST);
};


/**
 * Escape map.
 */

var map = {
  '\b': '\\b',
  '\f': '\\f',
  '\n': '\\n',
  '\r': '\\r',
  '\t': '\\t',
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
  var result = '';

  for (var i = 0, l = str.length; i < l; i++) {
    var char = str[i];

    if (map[char]) {
      result += map[char];
    } else if ('\\' == char) {
      result += '\\' + str[++i];
    } else {
      result += '\\x' + str.charCodeAt(i).toString(16);
    }
  }
  return result;
};


/**
 * Mangle strings contained in the given `ast`.
 *
 * @api private
 * @param {AST} ast
 * @return {AST} mangled ast
 */

function mangleStrings(ast) {
  var transformer = new uglifyjs.TreeTransformer(null, mangleString);
  return ast.transform(transformer);
}

/**
 * Mangle the given `node`, assuming it's an `AST_String`.
 *
 * @api private
 * @param {AST_Node} node
 * @return {AST_Node}
 */

function mangleString(node) {
  if (!(node instanceof uglifyjs.AST_String)) {
    return;
  }

  var str = node.getValue();
  var hex = exports.hex(str);
  var obj = merge({}, node);
  obj.value = hex;
  return new uglifyjs.AST_String(obj);
}
