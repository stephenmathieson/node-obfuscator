
var path = require('path');
var assert = require('better-assert');
var fs = require('fs');
var obfuscator = require('../..');

var root = path.join(__dirname, '..', '..', 'examples', 'non-included-files');

var opts = obfuscator.options([
    path.join(root, 'app.js'),
    path.join(root, 'lib/foo.js'),
  ],
  root,
  path.join(root, 'app.js'),
  true);

obfuscator.obfuscator(opts, function (err, code) {
  if (err) {
    throw err;
  }

  var file = path.join(root, 'obfuscated.js');
  fs.writeFileSync(file, code);
  assert('foo bar' === require(file)());
});
