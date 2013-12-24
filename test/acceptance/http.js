
var path = require('path');
var assert = require('assert');
var fs = require('fs');
var supertest = require('supertest');
var obfuscator = require('../..');

var EXAMPLES = path.join(__dirname, '..', '..', 'examples');

var opts = obfuscator.options([
    path.join(EXAMPLES, 'http', 'server.js'),
    path.join(EXAMPLES, 'http', 'respond.js')
  ],
  EXAMPLES,
  path.join(EXAMPLES, 'http', 'server.js'),
  false);

obfuscator.obfuscator(opts, function (err, code) {
  if (err) {
    throw err;
  }

  var file = path.join(EXAMPLES, 'http', 'obfuscated.js');

  fs.writeFileSync(file, code);

  var app = require(file);
  app.start(function () {
    var request = supertest('http://localhost:' + app.port);
    request.get('/').expect(200, function () {
      request.get('/?foo=bar').expect('foo?  bar.', function () {
        request.get('/?bar=foo').expect('bar? foo.', app.close);
      });
    });
  });
});
