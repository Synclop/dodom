var Class = require('myclass').Class;
var Properties = require('./Properties');
var utils = require('./utils');
var StyleAttributes = require('./StyleAttributes');
var undef;

var StyleMethods = {
	constructor:function(props){
		if(!(this instanceof Style)){return new Style(props);}
		Style.Super.call(this,props);
	}
,	render:function(){
		var str = [];
		for(var n in this._props){
			str.push(n+':'+this._props[n]);
		}
		return str.join(';');
	}
,	set:function(propName,value){
		if(arguments.length==1){
			if(typeof propName == 'string'){
				return this.setFromString(propName);
			}
			if(propName.constructor === Object){
				return this._setMultiple(propName);
			}
			return this;
		}
		return this._setProperty(propName,value);
	}
,	get:function(propName){
		return this._getProperty(propName);
	}
,	setFromString:function(str){
		var props = str.split(';');
		var obj = {};
		for(var i = 0, l = props.length;i<l;i++){
			var prop = props[i].split(':');
			obj[prop.shift()] = prop.shift();
		}
		this._setMultiple(obj);
	}
,	equals:function(s){
		var n;
		for(var n in this._props){
			if(typeof s._props[n] == 'undefined' || (this._props[n].get() != s._props[n].get())){
				return false;
			}
		}
		for(n in s._props){
			if(typeof this._props[n] == 'undefined' || (s._props[n].get() != this._props[n].get())){
				return false;
			}
		}
		return true;
	}
,	asObject:function(){
		var obj = {}
		for(var n in this._props){
			obj[n] = this._props[n].get();
		}
		return obj;
	}
};

for(var n in StyleAttributes){
	var attr = StyleAttributes[n];
	var propName = attr.cssName;
	var funcName = n;
	var arity = attr.arity;
	StyleMethods[n] = StyleMethods[propName] = utils.makeGetterSetter(propName,arity,attr)
}

var Style = Class(Properties,StyleMethods);

module.exports = Style;