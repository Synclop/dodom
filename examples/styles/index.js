var el = require('./document')
var extractStyles = require('../../lib/extractStyles')

styles = extractStyles(el);
console.log('<style>')
for(var n in styles){
	console.log(styles[n]+'')
}
console.log('</style>')