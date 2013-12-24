
var path = require('path');
var assert = require('assert');
var fs = require('fs');
var supertest = require('supertest');
var obfuscator = require('../..');

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

  var file = path.join(EXAMPLES, 'express', 'obfuscated.js');

  fs.writeFileSync(file, code);

  var app = require(file).app;
  app.listen(3344, function () {
    var request = supertest(app);
    request.get('/').expect(200, function () {
      request.get('/users').expect(200, process.exit);
    });
  });
});
