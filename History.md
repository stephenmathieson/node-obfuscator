
0.5.4 / 2015-09-14
==================

  * require: support `require('.\')` (@benweet, #28)

0.5.3 / 2015-09-01
==================

  * register: ensure a trailing newline after each file's contents (#26)
  * package: update "mocha" to 2.3.0
  * test: add assertions for files with trailing commas

0.5.2 / 2015-04-03
==================

  * travis: Remove 0.8, add 0.12 and iojs

0.5.1 / 2015-04-03
==================

  * require: Also throw the error native_require returns (@JamyDev, #20)

0.5.0 / 2014-09-30
==================

  * require: Fallback to the native `require()`
  * .jshintrc: Relax options
  * examples: Add a "non-included file" example
  * Readme: Add note about stupid usage of `require()`
  * docs: Use escaped string

0.4.2 / 2014-04-07
==================

 * pkg: npm init
 * pkg: Remove 'preferGlobal'
 * Use Uglify's TreeTransformer to mangle strings rather than regular expressions.

0.4.1 / 2014-03-31
==================

 * Fix obfuscation of escaped characters
 * license: update copyright year

0.4.0 / 2014-02-26
==================

 * Add `resolve.resolve` support ([GH-12](https://github.com/stephenmathieson/node-obfuscator/issues/12))
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
