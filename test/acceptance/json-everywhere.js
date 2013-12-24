
var path = require('path');
var assert = require('better-assert');
var fs = require('fs');
var glob = require('glob');
var obfusactor = require('../..');

var dir = path.join(__dirname, '../../examples/json-everywhere');

try {
  fs.unlinkSync(path.join(dir, 'obfusacted.js'));
} catch (e) {}

var opts = {
  files: glob.sync(path.join(dir, '/**/*.js*')),
  root: path.join(__dirname, '../../examples'),
  entry: path.join(dir, 'app.js'),
  strings: true
};

obfusactor(opts, function (err, js) {
  if (err) throw err;
  var file = path.join(dir, 'obfusacted.js');
  fs.writeFile(file, js, function (err) {
    if (err) throw err;
    var app = require(file);

    assert(
        'The lead character, called "The Bride", '
      + 'was a member of the Deadly Viper '
      + 'Assassination Squad, lead by her '
      + 'lover "Bill".' === app.killbill);

    assert('dev' === app('development'));
    assert('prod' === app('production'));

  });
});
