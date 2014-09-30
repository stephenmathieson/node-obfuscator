
var bar = require('./config/bar')
var foo = require('./lib/foo')

module.exports = function(){
  return [foo(), bar()].join(' ')
}
