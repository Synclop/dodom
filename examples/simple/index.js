var D = require('../../lib');
require('./definitions');

d = D
(['#Wrapper',
	['article',{title:'title',text:'some text, with some \n### PseudoMarkup\n yey'},
		['ul',['li','don\'t mind me, just testin']]
	]
,	['span.footer.sweet',{style:{background:'red',color:'blue'}},'&copy; ommak']
])

console.log(d.render(true));
