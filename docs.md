# Obfuscator Documentation

###  `obfuscator(options, cb)`

#### Parameters

*  options   `Object` The options
*  cb   `Function` Callback: `function (err, obfuscated)`

Obfuscate and concatenate a NodeJS _"package"_
because corporate says so.

###  `obfuscator.options(files, root, entry, [strings])`

#### Parameters

*  files   `Array` The files contained in the package
*  root   `String` The root of the package
*  entry   `String` The entry point
*  [strings]   `Boolean` Shall strings be obfuscated

#### Returns

`Object` 

Create an `options` object for the `obfuscator`

Aliases (for back-compat):

- `Options`
- `ObfuscatorOptions`


Examples:

```js
var opts = new obfuscator.Options(
  // files
  [ './myfile.js', './mydir/thing.js'],
  // root
  './',
  // entry
  'myfile.js',
  // strings
  true)

var opts = obfuscator.options({...})
```

###  `obfuscator.utils.hex(str)`

#### Parameters

*  str   `String` 

#### Returns

`String` 

Convert (or _obfuscate_) a string to its escaped
hexidecimal representation.  For example,
`hex('a')` will return `'\x63'`.

###  `obfuscator.utils.strings(js)`

#### Parameters

*  js   `String` 

#### Returns

`String` 

Mangle simple strings contained in some `js`

Strings will be _mangled_ by replacing each
contained character with its escaped hexidecimal
representation.  For example, "a" will render
to "\x63".

Strings which contain non-alphanumeric characters
other than `.-_/` will be ignored.

Strings not wrapped in double quotes will be ignored.

Example:

```js
utils.strings('var foo = "foo"';);
//=> 'var foo = "\x66\x6f\x6f";'
```

