
var path = require('path');
var assert = require('better-assert');
var fs = require('fs');
var obfuscator = require('../..');

var dir = path.join(__dirname, '..', '..', 'examples', 'resolve');
var app = path.join(dir, 'app.js');

var opts = obfuscator.options([ app ], dir, app, true);

obfuscator.obfuscator(opts, function (err, code) {
  if (err) {
    throw err;
  }

  var file = path.join(dir, 'obfuscated.js');
  fs.writeFileSync(file, code);
  assert(path.join(dir, 'node_modules', 'mocha', 'index.js') == require(file));
});
