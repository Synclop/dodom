var Dom = require('./DomElement');
var extend = require('node.extend');
var Class = require('myclass').Class;
var Nodes = require('./Nodes');
var undef;

function makeClass(name,props){
	var c,tag;
	if(props.tagName){
		tag = props.tagName;
		delete props.tagName;
	}else{
		tag = name;
	}
	base = Dom.DomElement;
	if(props.isSelfClosing){
		base = Dom.DomElementSelfClosing;
		delete props.isSelfClosing;
	}
	props = extend({
		constructor:function(props,children){
			if(!(this instanceof c)){return new c(props,children);}
			c.Super.call(this,tag,props,children);
		}
	},props);
	c = Class(base,props);
	return c;
}

var Tags = (function(tags){
	var t = {};

	for(var n in tags){
		var props = tags[n];
		t[n] = makeClass(n,props);
	}

	return t;

})({
	'a':{}
,	'area':{}
,	'base':{}
,	'link':{}
,	'meta':{}
,	'title':{}
,	'img':{isSelfClosing:true}
,	'div':{}
,	'span':{}
,	'script':{}
,	'input':{isSelfClosing:true}
,	'button':{isSelfClosing:true}
,	'option':{isSelfClosing:true}
,	'select':{}
,	'iframe':{}
,	'hr':{isSelfClosing:true}
,	'br':{isSelfClosing:true}
,	'table':{}
,	'tbody':{}
,	'thead':{}
,	'tfoot':{}
,	'th':{}
,	'tr':{}
,	'td':{}
,	'dd':{}
,	'dl':{}
,	'ol':{}
,	'ul':{}
,	'li':{}
,	'i':{}
,	'b':{}
,	'h1':{}
,	'h2':{}
,	'h3':{}
,	'h4':{}
,	'h5':{}
,	'h6':{}
,	'strong':{}
,	'em':{}
,	'canvas':{}
,	'label':{}
,	'body':{}
,	'textarea':{}
,	'html':{}
,	'form':{}
,	'iframe':{}
,	'head':{}
});

Tags.docType = Class(Dom.DomBase,{
	STATIC:{
		types:{
			'html 4.01 strict':'HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"'
		,	'html 4.01 transitional':'HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"'
		,	'html 4.01 frameset':'HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd"'
		,	'xhtml 1.0 strict':'html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"'
		,	'xhtml 1.0 transitional':'html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"'
		,	'xhtml 1.0 frameset':'html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd"'
		,	'html5':'html'
		}
	}
,	constructor:function(type){
		this._type = type;
	}
,	render:function(){
		var t = Tags.docType.types[this._type] || Tags.docType.types['html5'];
		return '<!DOCTYPE '+t+'>'
	}
,	toString:function(){
		return this.render();
	}
})

module.exports = Tags;