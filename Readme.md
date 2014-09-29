
# Obfuscator

[![Build Status](https://travis-ci.org/stephenmathieson/node-obfuscator.png?branch=master)](https://travis-ci.org/stephenmathieson/node-obfuscator) [![Dependency Status](https://gemnasium.com/stephenmathieson/node-obfuscator.png)](https://gemnasium.com/stephenmathieson/node-obfuscator)

Obfuscate your node packages because your boss says so!

## Why?

Because I had this conversation:

> **me**: hi boss.  this application should be written in node, not java.  node is good and stuff.

> **boss**: oh, okay.  node sounds great.  what about code protection so people don't steal our software?

> **me**: ...

> **boss**: you can't use node.

... but now:

> **me**: hi boss.  first off, code protection is stupid.  secondly, java can be decompiled.

> **boss**: but decompiling java is a lot of work.

> **me**: so is [un-obfuscating javascript](http://github.com/stephenmathieson/node-obfuscator)!

## Usage

### Command Line (installed globally with the `-g` flag)

```
$ obfuscator --entry app.js ./app.js ./routes/index.js ./routes/user.js
```

### JavaScript API

```javascript
var Options = require('obfuscator').Options;
var obfuscator = require('obfuscator').obfuscator;
var fs = require('fs');
var options = new Options([ '/path/to/file1.js', '/path/to/file2.js' ], '/path/to', 'file1.js', true);

// custom compression options
// see https://github.com/mishoo/UglifyJS2/#compressor-options
options.compressor = {
  conditionals: true,
  evaluate: true,
  booleans: true,
  loops: true,
  unused: false,
  hoist_funs: false
};

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

Also see [acceptance tests](https://github.com/stephenmathieson/node-obfuscator/tree/master/test/acceptance) or the [docs](https://github.com/stephenmathieson/node-obfuscator/tree/master/docs.md).

## How it Works

Think [browserify](https://github.com/substack/node-browserify) only for node, plus [UglifyJs](https://github.com/mishoo/UglifyJS2).  Your entire project will be concatenated into a single file.  This file will contain a stubbed `require` function, which will handle everything for you.  This single file will be run through [UglifyJs](https://github.com/mishoo/UglifyJS2), making it more difficult to read.

Undoing this process is hopefully as painful as decompiling java bytecode.

## Known bugs and limitations

- everything (including json, subdirectories, etc.) must be in the `root` of your project.
- you're not able to use many of the native module's `require` features; only `require.cache` and `require.resolve` have been exposed.
- you're not able to do silly things with `module.`
- dynamically built `require()`s are not supported; chances are, there's a significantly cleaner way of handling loading your depenencies anyway.

## License

(The MIT License)

Copyright (c) 2013-2014 Stephen Mathieson &lt;me@stephenmathieson.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
