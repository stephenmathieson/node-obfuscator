
var path = require('path');
var assert = require('better-assert');
var fs = require('fs');
var obfuscator = require('../..');

var EXAMPLES = path.join(__dirname, '..', '..', 'examples');
var FILE = path.join(EXAMPLES, 'comment-at-end', 'index.js');
var opts = obfuscator.options([ FILE ], EXAMPLES, FILE, true);

obfuscator.obfuscator(opts, function (err, code) {
  if (err) {
    throw err;
  }

  var file = path.join(EXAMPLES, 'comment-at-end', 'obfuscated.js');
  fs.writeFileSync(file, code);
  assert('hello' === require(file).hello);
});
