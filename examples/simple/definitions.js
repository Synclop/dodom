var D = require('../../lib');

D.Widget
('markupWidget',{
	beforeRenderText:function(locals){
		locals.text = locals.text.replace(/#+\s?(.*?)\n/,'<h3>$1</h3><br>').replace(/\n/,'');
	}
})
('title',{
	tag:'h1'
,	base:'markupWidget'
,	init:function(){
		this.addClass('{{namespace-title}}');
	}
})
('text',{
	base:'markupWidget'
,	init:function(){
		this.addClass('{{namespace-text}}')
	}
})
('article',{
	init:function(){
		this.namespace('article');
		this.style({'float':'left'})
	}
},['title','text'])
;