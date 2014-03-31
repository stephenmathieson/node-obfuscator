
exports.a = '\n\t\ba\r\n';
exports.b = 'b';
exports.c = '\nc';

exports.string = function () {
  return this.a + this.b + this.c;
};
