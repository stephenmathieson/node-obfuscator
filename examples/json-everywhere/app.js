
exports = module.exports = app;

function app(env) {
  env = env || 'development';
  return require('./config/' + env).env;
}

exports.killbill =
  [
    require('./data/01'),
    require('./data/02'),
    require('./data/03'),
    require('./data/04')
  ]
  .map(function (o) {
    return o.fragment;
  })
  .join(', ');
