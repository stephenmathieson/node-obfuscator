# Obfuscator

Obfuscate your node packages because your boss says so!

## Installation

Standard node install via [npm]: `npm install obfuscator`

## Why?

Because I had this conversation:

> **me**: hi boss.  this application should be written in node, not java.  node is good and stuff.

> **boss**: oh, okay.  node sounds great.  what about code protection so people don't steal our software?

> **me**: ...

> **boss**: you can't use node.

... but now:

> **me**: hi boss.  first off, code protection is stupid.  secondly, java can be decompiled.

> **boss**: but decompiling java is a lot of work.

> **me**: so is [un-obfuscating javascript]!

## Usage

### Command Line (installed globally with the `-g` flag)

```
$ obfuscator --entry app.js ./app.js ./routes/index.js ./routes/user.js
```

### Grunt

Tested with both 0.3.x and 0.4.x.  It should work until the [grunt] people change everything again.

```javascript
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

### Raw JavaScript API

```javascript
var Options = require('obfuscator').Options;
var obfuscator = require('obfuscator').obfuscator;
var fs = require('fs');
var options = new Options([ '/path/to/file1.js', '/path/to/file2.js' ], '/path/to', 'file1.js');
obfuscator(options, function (err, obfuscated) {
  if (err) {
    throw err;
  }
  fs.writeFile('./cool.js', obfuscated, function (err) {
    if (err) {
      throw err;
    }

    console.log('cool.');
  });
});
```

Also see [examples].

## How it Works

Think [browserify] only for node, plus [UglifyJs].  Your entire project will be concatenated into a single file.  This file will contain a stubbed `require` function, which will handle everything for you.  This single file will be run through [UglifyJs], making it more difficult to read.

Undoing this process is hopefully as painful as decompiling java bytecode.

## Known bugs and limitations

- everything (including json, subdirectories, etc.) must be in the `root` of your project.
- you're not able to use many of the native module's `require` features; only `require.cache` and `require.resolve` have been exposed.
- you're not able to do silly things with `module.`
- you don't have access to the global namespace

## Contrubuting

Do it, but add tests for your changes.  Tests should be written with [Vows].  Use JSLint whitespace rules.


[npm]: https://github.com/isaacs/npm
[un-obfuscating javascript]: http://github.com/stephenmathieson/node-obfuscator
[browserify]: https://github.com/substack/node-browserify
[UglifyJS]: https://github.com/mishoo/UglifyJS2
[Vows]: https://github.com/cloudhead/vows
[examples]: https://github.com/stephenmathieson/node-obfuscator/tree/master/examples
[grunt]: https://github.com/gruntjs/grunt
