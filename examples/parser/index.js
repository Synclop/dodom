var parse = require('../../lib').parse;
var file = require('fs').readFileSync(__dirname+'/file.dodom',{encoding:'utf8'});
require('../simple/definitions');

console.log(parse(file,{anUrlFromLocals:'a',aTextFromLocals:'b'}).render(true))