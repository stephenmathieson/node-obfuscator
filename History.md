
0.4.0 / 2014-02-26
==================

 * Add test for GH-12
 * Fix mocked require tests
 * Cleanup makefile
 * Refactor JSON file support
 * Obfuscate all strings
 * Remove component-builder example

0.3.0 / 2013-12-20
==================

- removed grunt support; use [grunt-obfuscator](https://github.com/stephenmathieson/grunt-obfuscator) instead.

0.2.2 / 2013-10-22
==================

- update uglify-js to ~2.4.0

0.2.1 / 2013-09-12
==================

- fixed grunt task ([#9](https://github.com/stephenmathieson/node-obfuscator/pull/9))

0.2.0 / 2013-08-13
==================

- fixed windows pathing bug ([#8](https://github.com/stephenmathieson/node-obfuscator/pull/8))
- `obfuscator` is now a function ([#1](https://github.com/stephenmathieson/node-obfuscator/issues/1))
- added support for custom compression options ([#2](https://github.com/stephenmathieson/node-obfuscator/issues/2))
- updated UglifyJS

0.1.0 / 2013-05-17
==================

- added `string` option, optionally obfuscating strings contained in your package
- added ability to export from an _"obfuscated"_ package

0.0.2 / 2013-02-10
==================

- initial release
