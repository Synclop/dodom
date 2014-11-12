var Tags = require('./Tags');
var extend = require('node.extend');
var Class = require('myclass').Class;
var Widget = require('./Widget');
var Widgets = {};
var undef;

var makeMethod = function(name,constructor){
	return function(val){
		if(arguments.length){
			if(!this._children[name]){
				this.addChild(constructor(),name);
			}
			this._children[name].set(val);
			return this;
		}
		if(this._children[name]){return this._children[name];}
		return undef;
	}
}

var WidgetFactory = function(name,props,fields){
	if(arguments.length==1){
		return Widgets[name] || false;
	}
	var WidgetClass;
	var base = Widget;
	var tag = 'div';
	if(props.tag){
		tag = props.tag;
		delete props.tag;
	}
	if(props && props.base){
		if(Widgets[props.base]){
			base = Widgets[props.base];
		}
		delete props.base;
	}
	var m = extend({
		constructor: base==Widget?
			function(props,children){
				if(!(this instanceof WidgetClass)){return new WidgetClass(props,children);}
				WidgetClass.Super.call(this,tag,props,children);
			}
			:
			function(props,children){
				if(!(this instanceof WidgetClass)){return new WidgetClass(props,children);}
				WidgetClass.Super.call(this,props,children);
			}
	},props);
	if(fields){
		for(var i=0,l=fields.length;i<l;i++){
			var fieldName = fields[i];
			var w = Widgets[fieldName];
			if(w){
				m[fieldName] = makeMethod(fieldName,w);
			}
		}
	}
	var WidgetClass = Class(base,m);
	Widgets[name] = WidgetClass;
	return WidgetFactory;
}

WidgetFactory.Widgets = Widgets;

module.exports = WidgetFactory;