
'use strict';

var read = require('fs').readFileSync,
    path = require('path'),
    obfuscator = require('..'),
    utils = obfuscator.utils;

var FIXTURES = path.join(__dirname, '..', 'examples');

function fixture(file) {
  return path.join(FIXTURES, file);
}

fixture.read = function (file) {
  return read(fixture(file));
};

describe('obfuscator', function () {
  it('should be a function', function () {
    obfuscator.should.be.a.function;
  });

  describe('.obfuscator', function () {
    it('should be a function', function () {
      obfuscator.obfuscator.should.be.a.function;
    });

    it('should mirror obfuscator', function () {
      obfuscator.obfuscator.should.be.equal(obfuscator);
    });

    it('should error when given invalid options', function (done) {
      obfuscator.obfuscator({}, function (err) {
        if (!err) {
          throw new Error('should have errored');
        }
        done();
      });
    });

    it('should an obfuscated package', function (done) {
      var opts = obfuscator.options([
              fixture('basic/hello.js'),
              fixture('basic/world.js'),
              fixture('basic/hello-world.js')
            ],
            FIXTURES,
            fixture('basic/hello-world'));

      obfuscator.obfuscator(opts, function (err, code) {
        err
          ? done(err)
          : code.should.be.a.string;
        done();
      });
    });

    it('should not obfuscate strings by default', function (done) {
      var opts = obfuscator.options([
              fixture('basic/hello.js'),
              fixture('basic/world.js'),
              fixture('basic/hello-world.js')
            ],
            FIXTURES,
            fixture('basic/hello-world'));

      obfuscator.obfuscator(opts, function (err, code) {
        err
          ? done(err)
          : code.should.include('basic/hello') &&
            code.should.include('basic/world') &&
            code.should.include('basic/hello-world');
        done();
      });
    });

    it('should obfuscate strings when strings=true', function (done) {
      var opts = obfuscator.options([
              fixture('basic/hello.js'),
              fixture('basic/world.js'),
              fixture('basic/hello-world.js')
            ],
            FIXTURES,
            fixture('basic/hello-world'),
            true);

      obfuscator.obfuscator(opts, function (err, code) {
        err
          ? done(err)
          : code.should.not.include('basic/hello') &&
            code.should.not.include('basic/world') &&
            code.should.not.include('basic/hello-world');
        done();
      });
    });
  });

  describe('.options', function () {
    it('should be a function', function () {
      obfuscator.Options.should.be.a.function;
    });

    it('should be aliased as Options', function () {
      obfuscator.options.should.be.eql(obfuscator.Options);
    });

    it('should be aliased as ObfuscatorOptions', function () {
      obfuscator.options.should.be.eql(obfuscator.ObfuscatorOptions);
    });

    it('should throw without files', function () {
      (function () {
        obfuscator.options(null, 'foo', 'bar');
      }).should.throw(/files/);
    });

    it('should throw with a bad root', function () {
      (function () {
        obfuscator.options([ 'file.js' ], null, 'bar');
      }).should.throw(/root/);
    });

    it('should throw with a bad entry', function () {
      (function () {
        obfuscator.options([ 'file.js' ], 'foo', null);
      }).should.throw(/entry/);
    });

    it('should force ./ on the entrypoint', function () {
      var opts = obfuscator.options(['file.js'], 'foo', 'bar');
      opts.entry.should.be.equal('./bar');
    });

    it('should work when invoked with "new"', function () {
      var opts = new obfuscator.Options(['file.js'], 'foo', 'bar');
      opts.files.should.be.eql(['file.js']);
      opts.root.should.be.equal('foo');
      opts.entry.should.be.equal('./bar');
    });

    it('should work when invoked without "new"', function () {
      var opts = obfuscator.options(['file.js'], 'foo', 'bar');
      opts.files.should.be.eql(['file.js']);
      opts.root.should.be.equal('foo');
      opts.entry.should.be.equal('./bar');
    });
  });

  describe('.register', function () {
    it('should be a function', function () {
      obfuscator.register.should.be.a.function;
    });

    it('should handle ENOENT errors', function (done) {
      obfuscator.register('fakeroot', 'fakefile', function (err) {
        err.code.should.be.equal('ENOENT');
        done();
      });
    });

    it('should wrap the file contents with require stuff', function (done) {
      obfuscator.register(FIXTURES, fixture('basic/hello.js'), function (err, js) {
        if (err) {
          done(err);
        }

        js.should.include(fixture.read('basic/hello.js'));
        js.should.match(/^require\.register/);
        js.should.match(/\}\)\;$/);
        done();
      });
    });

    it('should register the file relative to the root', function (done) {
      obfuscator.register(FIXTURES, fixture('basic/hello.js'), function (err, js) {
        if (err) {
          done(err);
        }

        js.should.include('require.register("./basic/hello.js",');
        done();
      });
    });

    it('should handle JSON exporting', function (done) {
      obfuscator.register(FIXTURES, fixture('foo-bar.json'), function (err, js) {
        if (err) {
          done(err);
        }

        js.should.include('module.exports = ' + fixture.read('foo-bar.json'));
        done();
      });
    });
  });

  describe('.concatenate', function () {
    it('should be a function', function () {
      obfuscator.concatenate.should.be.a.function;
    });

    describe('given no files', function () {
      var code;

      beforeEach(function (done) {
        obfuscator.concatenate({
          files: [],
          root: path.join(FIXTURES, 'basic'),
          entry: fixture('basic/hello-world.js')
        }, function (err, _code) {
          if (err) {
            done(err);
          }
          code = _code;
          done();
        });
      });

      it('should start the iffe', function () {
        code.should.match(/^\(function \(native_require, this_module\) \{/);
      });

      it('should contain the require mock', function () {
        code.should.include(read(path.join(__dirname, '../lib/require.js')));
      });

      it('should export the entry point\'s exports', function () {
        code.should.include('this_module.exports = require("./hello-world.js");');
      });

      it('should end the iffe', function () {
        code.should.match(/\}\(require, module\)\)\;$/);
      });
    });

    describe('given files', function () {
      var code;

      beforeEach(function (done) {
        obfuscator.concatenate({
          files: [
            fixture('basic/hello.js'),
            fixture('basic/world.js'),
            fixture('basic/hello-world.js')
          ],
          root: path.join(FIXTURES, 'basic'),
          entry: fixture('basic/hello-world.js')
        }, function (err, _code) {
          if (err) {
            done(err);
          }
          code = _code;
          done();
        });
      });

      it('should wrap each file', function () {
        code.should.include(fixture.read('basic/hello.js'));
        code.should.include(fixture.read('basic/world.js'));
        code.should.include(fixture.read('basic/hello-world.js'));
      });

      it('should start the iffe', function () {
        code.should.match(/^\(function \(native_require, this_module\) \{/);
      });

      it('should contain the require mock', function () {
        code.should.include(read(path.join(__dirname, '../lib/require.js')));
      });

      it('should export the entry point\'s exports', function () {
        code.should.include('this_module.exports = require("./hello-world.js");');
      });

      it('should end the iffe', function () {
        code.should.match(/\}\(require, module\)\)\;$/);
      });
    });

    describe('given a missing file', function () {
      it('should pass the error', function (done) {
        obfuscator.concatenate({
          files: [ 'hello' ],
          root: '/dev/null',
          entry: 'yeah'
        }, function (err) {
          err.code.should.be.equal('ENOENT');
          done();
        });
      });
    });

    describe('given missing files', function () {
      it('should pass the error', function (done) {
        obfuscator.concatenate({
          files: [ 'hello', 'world', 'yeah', 'things', '1', '2', '3', '4' ],
          root: '/dev/null',
          entry: 'stuff'
        }, function (err) {
          err.code.should.be.equal('ENOENT');
          done();
        });
      });
    });

  });

  describe('.utils', function () {
    describe('.hex', function () {
      it('should encode strings to their hex representations', function () {
        utils.hex('foo').should.be.equal('\\x66\\x6f\\x6f');
        utils.hex('bar').should.be.equal('\\x62\\x61\\x72');
        utils.hex('baz').should.be.equal('\\x62\\x61\\x7a');
        utils.hex('qaz').should.be.equal('\\x71\\x61\\x7a');
        utils.hex('dat').should.be.equal('\\x64\\x61\\x74');
      });
    });

    describe('.strings', function () {
      it('should ignore single-quote strings', function () {
        var code = "var foo = 'bar';";

        utils.strings(code).should.be.equal(code);
      });

      it('should ignore strings which contain spaces', function () {
        var code = 'var foo = "b a r"';
        utils.strings(code).should.be.equal(code);
      });

      it('should ignore strings which contain "+"', function () {
        var code = 'var foo = "b+a+r"';
        utils.strings(code).should.be.equal(code);
      });

      it('should ignore strings which contain ";"', function () {
        var code = 'var foo = "b;a;r"';
        utils.strings(code).should.be.equal(code);
      });

      it('should ignore strings which contain ","', function () {
        var code = 'var foo = "b,a,r"';
        utils.strings(code).should.be.equal(code);
      });

      it('should obfuscate a double-quote simple string', function () {
        var code = 'var foo = "bar"';
        utils.strings(code).should.be.equal('var foo = "\\x62\\x61\\x72"');
      });

      it('should obfuscate a double-quote string which contains "/"', function () {
        var code = 'var foo = "bar/"';
        utils.strings(code).should.be.equal('var foo = "\\x62\\x61\\x72\\x2f"');
      });

      it('should obfuscate a double-quote string which contains "."', function () {
        var code = 'var foo = "bar."';
        utils.strings(code).should.be.equal('var foo = "\\x62\\x61\\x72\\x2e"');
      });

      it('should obfuscate a double-quote string which contains "_"', function () {
        var code = 'var foo = "bar_"';
        utils.strings(code).should.be.equal('var foo = "\\x62\\x61\\x72\\x5f"');
      });

      it('should obfuscate all double-quoted simple strings', function () {
        var code = 'var foo = "bar", bar = "foo"';
        utils.strings(code).should.be.equal('var foo = "\\x62\\x61\\x72", bar = "\\x66\\x6f\\x6f"');
      });

      it('should play nicely with concatenated strings', function () {
        var code = 'var foo = "b" + "a" + "r"';
        utils.strings(code).should.be.equal('var foo = "\\x62" + "\\x61" + "\\x72"');
      });
    });
  });
});
