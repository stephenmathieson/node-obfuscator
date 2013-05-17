'use strict';

var path = require('path'),
    assert = require('assert'),
    fs = require('fs'),
    supertest = require('supertest'),
    obfuscator = require('../..');

var EXAMPLES = path.join(__dirname, '..', '..', 'examples');

var opts = obfuscator.options([
    path.join(EXAMPLES, 'express', 'app.js'),
    path.join(EXAMPLES, 'express', 'routes', 'index.js'),
    path.join(EXAMPLES, 'express', 'routes', 'user.js')
  ],
  EXAMPLES,
  path.join(EXAMPLES, 'express', 'app.js'),
  true);

obfuscator.obfuscator(opts, function (err, code) {
  if (err) {
    throw err;
  }

  var app, request,
      file = path.join(EXAMPLES, 'express', 'obfuscated.js');

  fs.writeFileSync(file, code);
  app = require(file).app;
  app.listen(3344, function () {
    request = supertest(app);
    request.get('/').expect(200, function () {
      request.get('/users').expect(200, process.exit);
    });
  });
});
