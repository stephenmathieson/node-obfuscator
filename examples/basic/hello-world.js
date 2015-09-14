exports.helloWorld = function () {
  var hello = require('./hello').hello;
  var world = require('./').world;

  return hello + ' ' + world;
};
