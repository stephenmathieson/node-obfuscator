'use strict';

var fs = require('fs'),
    obfuscator = require('../lib/obfuscator');

module.exports = function (grunt) {
  /**
   * Grabs a config option from the obfuscator namespace
   *
   * @api private
   * @param {String} option The option/configuration key
   * @return {Mixed|Any} The key's value
   */
  function config(option) {
    return grunt.config('obfuscator.' + option);
  }

  /**
   * The task; obfuscates a package with help from grunt
   *
   * @api private
   */
  grunt.registerTask('obfuscator', 'Mangle your node project', function () {
    var options,
        next = this.async(),
        files = config('files'),
        entry = config('entry'),
        root = config('root'),
        out = config('out'),
        strings = config('strings');

    files = grunt.file.expand(files);
    options = new obfuscator.Options(files, root, entry, strings);

    obfuscator.obfuscator(options, function (err, obfuscated) {
      if (err) {
        grunt.log.error(err);
        return next(false);
      }

      fs.writeFile(out, obfuscated, function (err) {
        if (err) {
          grunt.log.error(err);
          return next(false);
        }

        grunt.log.write('Project obfuscated to ');
        grunt.log.write(out.cyan);
        grunt.log.write('.\n');

        next();
      });
    });
  });
};
