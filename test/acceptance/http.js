'use strict';

var path = require('path'),
    assert = require('assert'),
    fs = require('fs'),
    supertest = require('supertest'),
    obfuscator = require('../..');

var EXAMPLES = path.join(__dirname, '..', '..', 'examples');

var opts = obfuscator.options([
    path.join(EXAMPLES, 'http', 'server.js'),
    path.join(EXAMPLES, 'http', 'respond.js')
  ],
  EXAMPLES,
  path.join(EXAMPLES, 'http', 'server.js'),
  true);

obfuscator.obfuscator(opts, function (err, code) {
  if (err) {
    throw err;
  }

  var app, request,
      file = path.join(EXAMPLES, 'http', 'obfuscated.js');

  fs.writeFileSync(file, code);
  app = require(file);

  app.start(function () {
    request = supertest('http://localhost:' + app.port);
    request.get('/').expect(200, function () {
      request.get('/?foo=bar').expect('foo?  bar.', function () {
        request.get('/?bar=foo').expect('bar? foo.', app.close);
      });
    });
  });
});
