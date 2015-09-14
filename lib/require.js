
// based on TJ Holowaychuk's commonjs require binding

function require(p, root) {
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

  if (!module) {
    try {
      return native_require(p);
    } catch (err) {
      throw new Error('failed to require "' + p + '" from ' + root +'\n' + err.message + '\n' + err.stack);
    }
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
  // GH-12
  if ('.' != path[0]) return native_require.resolve(path);

  var pathWithSlash = path.slice(-1) === '/' ? path : path + '/';
  var paths = [
    path,
    path + '.js',
    pathWithSlash + 'index.js',
    path + '.json',
    pathWithSlash + 'index.json'
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
