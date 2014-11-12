var Class = require('myclass').Class;

var Properties = Class({
	constructor:function(obj){
		if(!(this instanceof Properties)){return new Properties(obj);}
		this._props = {};
		if(obj){this._setMultiple(obj);}
	}
,	_setProperty:function(propName,value){
		if(this[propName]){
			this[propName](value);
			return this;
		}
		this._props[propName] = value;
		return this;
	}
,	_getProperty:function(propName){
		if(this[propName]){
			return this[propName]();
		}
		if(this._props.hasOwnProperty(propName)){
			return this._props[propName];
		}
	}
,	_setMultiple:function(obj){
		for(var n in obj){
			this._setProperty(n,obj[n]);
		}
	}
,	render:function(){
		var str = [];
		for(var n in this._props){
			str.push(n+'="'+this._props[n]+'"');
		}
		return str.join(' ');
	}
,	toString:function(){
		return this.render();
	}
});

module.exports = Properties;