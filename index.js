
module.exports = process.env.OBF_COV
  ? require('./lib-cov/obfuscator')
  : require('./lib/obfuscator');
