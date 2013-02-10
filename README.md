# Obfuscator

Obfuscate your node packages because your boss says so!

## Installation

Standard node install via [npm](obfuscator_npm): `npm install obfuscator`

## Why?

Because I had this conversation:

> **you**: hi boss.  this application should be written in node, not java.  node is good and stuff.

> **boss**: oh, okay.  node sounds great.  what about code protection so people don't steal our software?

> **you**: ...

> **boss**: you can't use node.

... but now:

> **you**: hi boss.  first off, code protection is stupid.  secondly, java can be decompiled.

> **boss**: but decompiling java is a lot of work.

> **you**: so is [un-obfuscating javascript](obfuscator_github)!

## Usage

### Command Line (installed globally with the `-g` flag):

```
$ obfuscator --entry app.js ./app.js ./routes/index.js ./routes/user.js
```

### Grunt

Tested with both 0.3.x and 0.4.x.  It should work until the [grunt](grunt) people change everything again.

```javascript
/*jslint node:true*/

module.exports = function (grunt) {
	'use strict';

	grunt.loadNpmTasks('obfuscator'); // load the task

	grunt.initConfig({
		obfuscator: {
			files: [
				'app.js',
				'lib/routes/*.js'
			],
			entry: 'app.js',
			out: 'obfuscated.js'
		}
	});

	grunt.registerTask('default', 'obfuscator');
};
```

## How it Works

Think [browserify](browserify) only for node, plus [UglifyJs](uglify).  Your entire project will be concatenated into a single file.  This file will contain a stubbed `require` function, which will handle everything for you.  This single file will be run through [UglifyJs](uglify), making it more difficult to read.

Undoing this process is hopefully as painful as decompiling java bytecode.

## Known bugs and limitations

- everything (including json, subdirectories, etc.) must be in the `root` of your project.
- you're not able to use many of the native module's `require` features; only `require.cache` and `require.resolve` have been exposed.
- you're not able to do silly things with `module.`
- you don't have access to the global namespace

## Contrubuting

Do it, but add tests for your changes.  Tests should be written with [Vows](vows).  Use JSLint whitespace rules.


[obfuscator_npm]: http://npmjs.org/node-obfuscator
[obfuscator_github]: http://github.com/stephenmathieson/node-obfuscator
[browserify]: https://github.com/substack/node-browserify
[uglify]: https://github.com/mishoo/UglifyJS2
[vows]: https://github.com/cloudhead/vows