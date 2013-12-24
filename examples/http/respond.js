
var url = require('url');

var config = require('./config.json');

module.exports = function (req, res) {
  var parsed = url.parse(req.url, true);

  res.writeHead(200, { 'content-type': 'text/plain' });
  if ('bar' === parsed.query.foo) {
    res.write(config.bar);
  } else {
    res.write(config.foo);
  }
  res.end();
};
