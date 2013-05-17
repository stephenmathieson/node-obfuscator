exports.helloWorld = function () {
  var hello = require('./hello').hello,
      world = require('./world').world;

  return hello + ' ' + world;
};
