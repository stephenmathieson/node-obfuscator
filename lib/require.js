/**
 * Create exludes string to match with regex from excludes array
 *
 * @excludes {Array} files to exclude
 * @return {String} Regex escaped strings to match.
 */
function  excludes_escaped(excludes){
  var escaped = [];
  excludes.forEach(function(str){
    escaped.push(str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'));  
  })

  return escaped.join('|');
}

/**
 * Code for native requiring for the excludes
 *
 * @excludes {Array} files to exclude
 * @return {String}
 */
function excludes_filter(excludes){
  var code = 
  "//apply excludes \n\
  if(p.match(/"+ excludes_escaped(excludes) +"/)) \n\
    return native_require(p);" ;

  return code;  
}


/**
 * Pre code from the require binding
 *
 * @return {String} 
 */

var pre = 
  "// based on TJ Holowaychuk's commonjs require binding \n"+
  "  function require(p, root) {";

/**
 * Create string from comment for easier writing of the require code
 *
 * @f {String} The comment to extract string from
 * @return {String} 
 */
function toDoc(f) {
  return f.toString().
      replace(/^[^\/]+\/\*!?/, '').
      replace(/\*\/[^\/]+$/, '');
}

/**
 * Post code from the require binding
 *
 * @return {String} 
 */
var post = toDoc(function(){/*!
  // third-party module?  use native require
  if ('.' != p[0] && '/' != p[0])
    return native_require(p);

  root = root || 'root';

  var path = require.resolve(p);

  // if it's a non-registered json file, it
  // must be at the root of the project
  if (!path && /\.json$/i.test(p))
    return native_require('./' + require.basename(p));

  var module = require.cache[path];

  if (!module)
    throw new Error('failed to require ' + p + ' from ' + root);

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
  // GH-12
  if ('.' != path[0]) return native_require.resolve(path);

  var paths = [
    path,
    path + '.js',
    path + '/index.js',
    path + '.json',
    path + '/index.json'
  ];

  for (var i = 0, p; p = paths[i]; i++) {
    if (require.cache[p]) return p;
  }
};

require.register = function (path, fn) {
  require.cache[path] = fn;
};

require.relative = function (parent) {
  function relative(p) {
    if ('.' != p[0]) return require(p);

    var path = parent.split('/');
    var segs = p.split('/');
    path.pop();

    for (var i = 0, len = segs.length; i < len; i += 1) {
      var seg = segs[i];
      if ('..' == seg) {
        path.pop();
      } else if ('.' != seg) {
        path.push(seg);
      }
    }

    return require(path.join('/'), parent);
  }

  relative.resolve = require.resolve;
  relative.cache = require.cache;
  return relative;
};
*/
});

/**
 * Build code by adding the excludes filter
 *
 * @excludes {Array} 
 * @return {String} 
 */
exports.build = function(excludes){
  var exclude_code = excludes ? excludes_filter(excludes) : "";

  return pre +  exclude_code +  post;
}