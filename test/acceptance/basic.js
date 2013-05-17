'use strict';

var path = require('path'),
    assert = require('assert'),
    fs = require('fs'),
    obfuscator = require('../..');

var EXAMPLES = path.join(__dirname, '..', '..', 'examples');

var opts = obfuscator.options([
    path.join(EXAMPLES, 'basic', 'hello.js'),
    path.join(EXAMPLES, 'basic', 'world.js'),
    path.join(EXAMPLES, 'basic', 'hello-world.js')
  ],
  EXAMPLES,
  path.join(EXAMPLES, 'basic', 'hello-world.js'),
  true);

obfuscator.obfuscator(opts, function (err, code) {
  if (err) {
    throw err;
  }

  var file = path.join(EXAMPLES, 'basic', 'obfuscated.js');
  fs.writeFileSync(file, code);
  assert.equal(require(file).helloWorld(), 'hello world');
});
