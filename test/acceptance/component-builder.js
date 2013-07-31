
'use strict';

var path = require('path'),
    assert = require('assert'),
    fs = require('fs'),
    obfuscator = require('../..'),
    Mocha = require('mocha'),
    glob = require('glob');

var BUILDER_DIR = path.join(__dirname, '../../examples/component-builder');

var files = glob
      .sync('lib/*.js', { cwd: BUILDER_DIR })
      .map(function (file) {
        return path.join(BUILDER_DIR, file);
      });

var opts = obfuscator.options(
      files,
      path.join(BUILDER_DIR, 'lib'),
      path.join(BUILDER_DIR, 'lib/builder.js'),
      true);

obfuscator(opts, function (err, js) {
  if (err) {
    throw err;
  }

  // overwriting the index, allowing the tests to
  // require the obfuscated version

  var file = path.join(BUILDER_DIR, 'index.js');
  fs.writeFileSync(file, js);

  // cd to component-builder root
  process.chdir(BUILDER_DIR);

  require('should');

  var mocha = new Mocha();
  mocha.files = [ path.join(BUILDER_DIR, 'test/builder.js') ];
  mocha.reporter('spec');
  mocha.run(process.exit);
});

