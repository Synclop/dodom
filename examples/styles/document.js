var D = require('../../lib');
require('../simple/definitions');

var styles = {
	footer:{background:'#ccc',color:'white'}
,	link:{'text-decoration':'none','float':'left'}
,	link_hover:{'background':'red'}
,	nav:{display:'block','float':'left'}
,	header:{'font-size':12}
}

d = D
(['html',
	['head'
	,	['title','Testing DoDom']
	]
,	['body'
	,	['nav',{style:styles.nav}
		,	
			(function(n,arr){
				while(n){arr.push(['li',['a',{href:"#"+n,':hover':styles.link_hover,style:styles.link},'link #'+(n--)]]);}
				return arr;
			})(5,['ul'])
		]
	,	['#Main'
		,	['#Header'
			,	['h1',{style:styles.header},'Our Articles']
			]
		,	['article',{title:'title1',text:'text1'}]
		,	['article',{title:'title2',text:'text2'}]
		]
	,	['span.footer.sweet',{style:styles.footer},'&copy; ommak']
	]
]);

module.exports = d;
