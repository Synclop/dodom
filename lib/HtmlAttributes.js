var utils = require('./utils');
var Nodes = require('./Nodes');
var Class = require('myclass').Class;

var SKIP = {};

var makeClass = function(constructor,args){

	var c = Class(constructor,{
		STATIC:{
			arity:args.length
		}
	,	constructor:function(v1,v2){
			if(!(this instanceof c)){return new c(v1,v2);}
			if(typeof v1 == 'undefined' && args[0]!=='undefined' && args[0]!==SKIP){v1 = args[0];}
			if(typeof v2 == 'undefined' && args[1]!=='undefined' && args[1]!==SKIP){v2 = args[1];}
			c.Super.call(this,v1,v2,(args.length > 2 && args[2]!=='undefined' && args[2]!==SKIP && args[2]));
		}
	});

	return c;
}

var a = (function(props){

	var a = {};

	for(var n in props){
		var funcName = n.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
		var constructor = props[n].shift();
		var args = props[n];
		args.unshift(SKIP);
		a[funcName] = makeClass(constructor,args);
	}

	return a;

})({
	id:[Nodes.String]
,	lang:[Nodes.String]
,	name:[Nodes.String]
,	hidden:[Nodes.Bool,'hidden']
,	spellCheck:[Nodes.Bool,'spellCheck']
,	width:[Nodes.Unit]
,	height:[Nodes.Unit]
,	src:[Nodes.Address]
,	tabIndex:[Nodes.Integer]
,	target:[Nodes.String]
,	contentEditable:[Nodes.Bool,'contentEditable']
,	contextMenu:[Nodes.String]
,	dir:[Nodes.List,'ltr,rtl']
,	draggable:[Nodes.Bool,'draggable']
,	dropzone:[Nodes.Bool,'dropzone']
,	media:[Nodes.String]
,	placeholder:[Nodes.String]
,	min:[Nodes.Numeric]
,	max:[Nodes.Numeric]
,	maxLength:[Nodes.Integer]
,	value:[Nodes.String]
,	maxLength:[Nodes.Integer]
,	manifest:[Nodes.String]
,	method:[Nodes.list,'get,post']
,	multiple:[Nodes.Bool,'multiple']
,	name:[Nodes.String]
,	'http-equiv':[Nodes.String]
,	readonly:[Nodes.Bool,'readonly']
,	rel:[Nodes.String]
,	seamless:[Nodes.Bool,'seamless']
,	type:[Nodes.String]
,	charset:[Nodes.String]
,	content:[Nodes.String]
,	disabled:[Nodes.Bool,'disabled']
,	'for':[Nodes.String]
,	form:[Nodes.String]
,	accept:[Nodes.String]
,	action:[Nodes.String]
,	alt:[Nodes.String]
,	title:[Nodes.String]
});

module.exports = a;