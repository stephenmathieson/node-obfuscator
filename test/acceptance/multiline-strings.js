

var path = require('path');
var assert = require('better-assert');
var fs = require('fs');
var obfuscator = require('../..');

var root = path.join(__dirname, '..', '..', 'examples', 'multiline-strings');
var entry = path.join(root, 'index.js');
var files = [entry];

var opts = new obfuscator.Options(files, root, entry, true);

obfuscator(opts, function (err, code) {
  if (err) throw err;
  var file = path.join(root, 'obfuscated.js');
  fs.writeFileSync(file, code);

  var module = require(file);
  assert('hello  \'world\'  "and"  stuff' == module.fn());
});
