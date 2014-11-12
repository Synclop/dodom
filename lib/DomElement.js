var Class = require('myclass').Class;
var Properties = require('./Properties');
var Classes = require('./Nodes').Classes;
var Style = require('./Style');
var utils = require('./utils');
var HtmlAttributes = require('./HtmlAttributes');
var undef;

var d = {}

d.DomBase = Class(Properties,{
	STATIC:{
		decomposeClassName: function(className){
			var ret = {
				'class': (className.match(/\.(.*?)(?:#|$)/)||['',''])[1].split('.')
			,	id: (className.match(/#(.*?)(?:\.|$)/) || ['',''])[1]
			,	tag: (className.match(/(?:^(?!\.|#))(.*?)(?:\.|#|$)/) || ['','div'])[1]
			}
			return ret;
		}
	}
,	constructor:function(obj){
		if(!(this instanceof d.DomBase)){return new d.DomBase(obj);}
		d.DomBase.Super.call(this,obj)
		this._val = '';
	}
,	set:function(val){
		this._val = val;
		return this;
	}
,	get:function(){
		return this._val;
	}
});


d.DomTextNode = Class(d.DomBase,{
	constructor:function(obj){
		if(!(this instanceof d.DomTextNode)){return new d.DomTextNode(obj);}
		d.DomTextNode.Super.call(this,obj)
	}
,	render:function(){
		if(this._val){
			return this._val+'';
		}
		return '';
	}
});

var DomElementMethods = {
	constructor:function(tag,obj,children){
		if(!(this instanceof d.DomElement)){return new d.DomElement(tag,obj,children);}
		this._children = {};
		this._childrenArr = []; 
		this._tag = false;
		this._isSelfClosing = false;
		this._parent = null;
		this._meta = {};
		if(Array.isArray(obj) || typeof obj == 'string'){
			children = obj;
			obj = undef;
		}
		d.DomElement.Super.call(this,obj);
		if(tag){
			this.tag(tag);
		}
		if(children){
			this.children(children);
		}
	}
,	_setProperty:function(propName,value){
		if(propName[0]==':'){
			return this.setCustomStyle(propName,value)
		}
		if(this[propName]){
			this[propName](value);
			return this;
		}
		this._props[propName] = value;
		return this;
	}
,	_getProperty:function(propName){
		if(propName[0]==':'){
			return this.getCustomStyle(propName);
		}
		if(this[propName]){
			return this[propName]();
		}
		if(this._props.hasOwnProperty(propName)){
			return this._props[propName];
		}
	}
,	setCustomStyle:function(name,props){
		if(!this._meta.styles){this._meta.styles = {};}
		if(!this._meta.styles[name]){this._meta.styles[name] = new Style();}
		this._meta.styles[name].set(props);
		return this;
	}
,	getCustomStyle:function(name){
		if(this._meta.styles && this._meta.styles[name]){
			return this._meta.styles[name];
		}
		return undef
	}
,	getAllStyles:function(){
		var obj = {};
		var hasStyle = false
		if(this._props.style){
			hasStyle = true;
			obj['style'] = this._props.style;
		}
		if(this._meta.styles){
			for(var n in this._meta.styles){
				hasStyle = true;
				obj[n] = this._meta.styles[n];
			}
		}
		if(hasStyle){return obj;}
		return undef;
	}
,	parent:function(p){
		if(arguments.length){this._parent = p;return this;}
		return this._parent;
	}
,	selfClosing:function(isIt){
		if(arguments.length){this._isSelfClosing = isIt;return this;}
		return this._isSelfClosing;
	}
,	tag:function(t){
		if(arguments.length){this._tag = t;return this;}
		return this._tag;
	}
,	classes:function(){
		if(!this._props['class']){this._props['class'] = new Classes();}
		return this._props['class'];
	}
,	getClasses:function(){
		if(this._props['class']){
			return this._props['class'].get();
		}
		return undef;
	}
,	addClass:function(className){
		var args = new Array(arguments.length)
		,	i = args.length-1
		;
		while(i>=0){
			args[i] = arguments[i--];
		}
		this.classes().add.apply(this.classes(),args);
		return this;
	}
,	removeClass:function(className){
		var args = new Array(arguments.length)
		,	i = args.length
		;
		while(i>=0){
			args[i] = arguments[i--];
		}
		this.classes().remove.apply(this.classes(),args);
		return this;
	}
,	addChild:function(child,name){
		if(child.parent){
			child.parent(this);
		}
		var id = this._childrenArr.push(child) -1;
		if(!name){name = 'child_'+id;}
		this._children[name] = child;
		return this;
	}
,	getChildById:function(id){
		var i = this._childrenArr.indexOf(id);
		if(i>=0){
			return this._childrenArr[i];
		}
		return false;
	}
,	getChildByName:function(name){
		if(this._children[name]){
			return this._children[name];
		}
		return false;
	}
,	getChild:function(id){
		if(typeof id =='string'){
			return this.getChildByName(id);
		}
		return this.getChildById(id);
	}
,	children:function(children){
		if(arguments.length){
			if(Array.isArray(children)){
				while(children.length){
					this.addChild(children.shift());
				}
			}else{
				this.addChild(children);
			}
			return this;
		}
		return this._children;
	}
,	renderHead:function(locals){
		if(locals.tag){
			var str = [];
			var props = locals.props
			for(var n in props){
				if(n=='style' && locals.styles!=true){continue;}
				var v = props[n]+'';
				if(v){
					str.push(n+'="'+v+'"');
				}
			}
			if(str.length){str = ' '+str.join(' ');}
			else{str='';}
			var prefix = '';
			if(locals.pretty){
				prefix='\n'+(new Array(locals.nestingLevel+1).join('\t'));
			}
			str=prefix+'<'+locals.tag+str+'>';
			return str;
		}
		return '';
	}
,	renderChildren:function(locals){
		var str = '';
		var childrenArr = locals.childrenArr;
		var prefix=''
		if(childrenArr.length){
			if(locals.pretty){
				prefix='\n'+(new Array(locals.nestingLevel+2).join('\t'));
			}
			for(var i = 0, l = childrenArr.length;i<l;i++){
				if(childrenArr[i].render){
					str+=childrenArr[i].render(locals.pretty,locals.styles);
				}else{
					str+=prefix+childrenArr[i];
				}
			}
		}
		return str;
	}
,	renderText:function(locals){
		var prefix='';
		if(locals.pretty && locals.text){
			prefix='\n'+(new Array(locals.nestingLevel+2).join('\t'));
		}
		return prefix+locals.text+''
	}
,	renderFoot:function(locals){
		var str=''
		var tag = locals.tag;
		var selfClosing = locals.selfClosing;
		var prefix = '';
		if(tag && !selfClosing){
			if(locals.pretty){
				prefix='\n'+(new Array(locals.nestingLevel+1).join('\t'));
			}
			str+=prefix+'</'+this._tag+'>';
		}
		return str;
	}
,	getNestingLevel:function(){
		var p = this.parent();
		var i = 0;
		while(p){
			i++;
			p = p.parent();
		}
		return i;
	}
,	render:function(pretty,styles){
		var props = {
				tag:this.tag()
			,	props:this._props
			,	pretty:pretty
			,	nestingLevel:pretty?this.getNestingLevel():0
			,	text:this.get()
			,	childrenArr:this._childrenArr
			,	children:this._children
			,	selfClosing:this.selfClosing()
			,	styles:styles
		};
		str=this.renderHead(props)
			+this.renderText(props)
			+this.renderChildren(props)
			+this.renderFoot(props)
		;
		return str;
	}
,	setStyleProperty:function(propName,value){
		if(!this._props.style){this._props.style = new Style();}
		this._props.style.set(propName,value);
		return this;
	}
,	getStyleProperty:function(propName){
		if(this._props.style){
			return this._props.style.get(propName);
		}
		return undef;
	}
,	setStyleFromString:function(str){
		if(!this._props.style){this._props.style = new Style();}
		this._props.style.setFromString(str);
		return this;
	}
,	setMultipleStyleProperties:function(obj){
		if(!this._props.style){this._props.style = new Style(obj);}
		else{this._props.style.set(obj);}
		return this;
	}
,	style:function(propName,value){
		if(arguments.length==1){
			if(typeof propName == 'string'){
				if(propName.match(/:/g)){
					return this.setStyleFromString(propName);
				}
				return this.getStyleProperty(propName);
			}
			return this.setMultipleStyleProperties(propName);
		}
		else if(arguments.length==2){
			return this.setStyleProperty(propName,value);
		}
		return this._props.style;
	}
,	traverse:function(fn,skipMe){
		var child;
		for(var n in this._children){
			child = this._children[n];
			if(child.traverse){
				child.traverse(fn);
			}else{
				fn.call(child);
			}
		}
		if(!skipMe){
			fn.call(this);
		}
		return this;
	}
,	each:function(fn){
		var child;
		for(var n in this._children){
			child = this._children[n];
			fn.call(child);
		}
	}
};

DomElementMethods['class'] = DomElementMethods.addClass;

for(var n in HtmlAttributes){
	var attr = HtmlAttributes[n]
	var arity = attr.arity;
	DomElementMethods[n] = utils.makeGetterSetter(n,arity,attr);
};

d.DomElement = Class(d.DomBase,DomElementMethods);

d.DomElementSelfClosing = Class(d.DomElement,{
	constructor:function(tag,obj,children){
		if(!(this instanceof d.DomElementSelfClosing)){return new d.DomElementSelfClosing(tag,obj,children);}
		d.DomElementSelfClosing.Super.call(this,tag,obj,children);
		this._isSelfClosing = true;
	}
})


module.exports = d;