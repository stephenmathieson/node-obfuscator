/*jslint node:true*/

'use strict';

var http = require('http');

var config = require('./config.json');

var respond = require('./respond');

exports.start = function (cb) {
  cb = typeof cb === 'function' ? cb : function () {};

  exports._http = http.createServer(function (req, res) {
    return respond(req, res);
  });

  exports._http.listen(config.port, cb);
};

exports.port = config.port;

exports._http = null;

exports.close = function (cb) {
  cb = typeof cb === 'function' ? cb : function () {};
  exports._http.close(cb);
};
