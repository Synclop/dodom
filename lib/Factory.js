var Tags = require('./Tags');
var extend = require('node.extend');
var Class = require('myclass').Class;
var Widget = require('./Widget');
var WidgetFactory = require('./WidgetFactory');
var Widgets = WidgetFactory.Widgets;
var decomposeClassName = require('./DomElement').DomElement.decomposeClassName
var undef;

var Factory = function(className,properties){
	if(Array.isArray(className)){
		return Factory.apply(null,className);
	}
	var children,child,limit=2;
	if(Array.isArray(properties) || typeof properties == 'string'){
		limit = 1;
	}
	if(arguments.length>limit){
		children = [];
		for(var i=limit,l=arguments.length;i<l;i++){
			child = arguments[i];
			if(Array.isArray(child)){child = Factory.apply(null,child);}
			children.push(child);
		}
		if(!children.length){children=undef;}
	}
	if(limit==1){
		properties = undef;
	}
	if(!properties){properties={};}
	if(className.match(/#|\./)){	
		var c = decomposeClassName(className);
		className = c.tag;
		delete c.tag;
		extend(properties,c);
	}
	if(Widgets[className]){
		return new Widgets[className](properties,children);
	}
	if(Tags[className]){
		return new Tags[className](properties,children);
	}
	var el = new Tags.div(properties,children);
	el.tag(className);
	return el;
};

module.exports = Factory;