var Class = require('myclass').Class;
var DomElement = require('./DomElement').DomElement

var Widget = Class(DomElement,{
	constructor:function(tag,props,children){
		if(!(this instanceof Widget)){return new Widget(tag,props,children);}
		Widget.Super.call(this,tag,props,children);
		this._variables = {}
		if(this.init){this.init();}
	}
,	namespace:function(n){
		if(arguments.length){
			this.variable('namespace',n);
			this.addClass(n);
		}
		return this.variable('namespace');
	}
,	variable:function(varName,varValue){
		if(!arguments.length){return this._variables;}
		if(arguments.length==1){return this._variables[varName];}
		this._variables[varName] = varValue;
		return this;
	}
,	renderHead:function(locals){
		var ret;
		if(this.beforeRenderHead){
			ret = this.beforeRenderHead(locals);
			if(ret){return ret;}
		}
		str = Widget.Super.prototype.renderHead.call(this,locals);
		if(this.afterRenderHead){
			ret = this.afterRenderHead(str,locals);
			if(ret){return ret;}
		}
		return str;
	}
,	renderFoot:function(locals){
		var ret;
		if(this.beforeRenderFoot){
			ret = this.beforeRenderFoot(locals);
			if(ret){return ret;}
		}
		str = Widget.Super.prototype.renderFoot.call(this,locals);
		if(this.afterRenderFoot){
			ret = this.afterRenderFoot(str,locals);
			if(ret){return ret;}
		}
		return str;
	}
,	renderChildren:function(locals){
		var ret;
		if(this.beforeRenderChildren){
			ret = this.beforeRenderChildren(locals);
			if(ret){return ret;}
		}
		str = Widget.Super.prototype.renderChildren.call(this,locals);
		if(this.afterRenderChildren){
			ret = this.afterRenderChildren(str,locals);
			if(ret){return ret;}
		}
		return str;
	}
,	renderText:function(locals){
		var ret;
		if(this.beforeRenderText){
			ret = this.beforeRenderText(locals);
			if(ret){return ret;}
		}
		str = Widget.Super.prototype.renderText.call(this,locals);
		if(this.afterRenderText){
			ret = this.afterRenderText(str,locals);
			if(ret){return ret;}
		}
		return str;
	}
,	getClasses:function(){
		if(this._props['class']){
			this.propagateNameSpace();
			var arr = this._props['class'].get();
			for(var i = 0,l=arr.length;i<l;i++){
				arr[i] = this._replace(arr[i]);
			}
			return arr;
		}
		return undef;
	}
,	propagateNameSpace:function(){
		if(this.namespace()){
			var n = this.namespace();
			this.traverse(function(){
				if(!(this instanceof Widget)){return;}
				this.variable('namespace',n);
			},true)
		}
	}
,	render:function(pretty,styles){
		this.propagateNameSpace();
		var str = this._render(pretty,styles);
		str = this._replace(str);
		return str;
	}
,	_replace:function(str){
		var replacements = this._variables;
		str = str.replace(/\{\{(.*?)(?:([-_])(.*?))?\}\}/g,function(total,key,separator,denominator,pos){
			separator = separator || '';
			denominator = denominator || '';
			return replacements[key] ? replacements[key]+separator+denominator : denominator;
		});
		return str;
	}
,	_render:function(pretty,styles){
		var ret;
		if(this.beforeRender){
			ret = this.beforeRender(pretty,styles);
			if(ret){return ret;}
		}
		str = Widget.Super.prototype.render.call(this,pretty,styles);
		if(this.afterRender){
			ret = this.afterRender(str,pretty,styles);
			if(ret){return ret;}
		}
		return str;
	}
});

module.exports = Widget;