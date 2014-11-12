var Class = require('myclass').Class;
var undef;

var n = {};

n.Base = Class({
	constructor:function(){}
})

n.Litteral = Class(n.Base,{
	constructor:function(val){
		if(!(this instanceof n.Litteral)){return new n.Litteral(val);}
		if(typeof val != 'undefined' && val!==null){
			this.set(val);
		}
	}
,	set:function(val){
		this._val = val;
		return this;
	}
,	unset:function(){
		delete this._val;
	}
,	get:function(){
		return this._val ? this._val : undef;
	}
,	render:function(){
		return this._val ? this._val+'':'';
	}
,	toString:function(){
		return this.render();
	}
,	valid:function(val){
		return true;
	}
});

n.List = Class(n.Litteral,{
	constructor:function(val,allowed_values){
		if(!(this instanceof n.List)){return new n.List(val,allowed_values);}
		this._allowed_values = [];
		if(typeof allowed_values != 'undefined' && allowed_values!==null){
			this.allowed(allowed_values);
		}		
		if(typeof val != 'undefined' && val!==null){
			this.set(val);
		}
	}
,	allowed:function(vals){
		if(arguments.length && vals){
			vals = vals.split(/\s|,/g);
			this._allowed_values = this._allowed_values.concat(vals);
			return this;
		}
		return this._allowed_values;
	}
,	set:function(val){
		if(this.valid(val)){
			this._val = val;
		}
		return this;
	}
,	valid:function(val){
		return (this._allowed_values.indexOf(val)>=0);
	}
});

n.Color = Class(n.Litteral,{
	STATIC:{
		hexToRgb:function(hex){
			// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
			var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
			hex = hex.replace(shorthandRegex, function(m, r, g, b) {
				return r + r + g + g + b + b;
			});

			var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);
			return result ? [
				parseInt(result[1], 16),
				parseInt(result[2], 16),
				parseInt(result[3], 16),
				(typeof result[4] !== 'undefined' ? parseInt(result[4],16) : 1)
			] : null;
		}
	,	rgbToHex: function(r, g, b) {
			return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
		}
	,	colorNameToHex:function(val){
			if(n.Color.colors.hasOwnProperty(val)){
				return n.Color.colors[val];
			}
			return val;
		}
	,	colors:require('./colours')
	}
,	constructor:function(val,alpha){
		if(!(this instanceof n.Color)){return new n.Color(val,alpha);}
		this._a = 1;
		this._r = 0;
		this._g = 0;
		this._b = 0;
		n.Color.Super.call(this,val);
		if(typeof alpha !== 'undefined'){
			this.a(alpha);
		}
	}
,	a:function(a){
		if(arguments.length){this._a = a; return this;}
		return this._a;
	}
,	r:function(r){
		if(arguments.length){this._r = r; return this;}
		return this._r;
	}
,	g:function(g){
		if(arguments.length){this._g = g; return this;}
		return this._g;
	}
,	b:function(b){
		if(arguments.length){this._b = b; return this;}
		return this._g;
	}
,	set:function(val){
		if(typeof val === 'string'){
			if(this.validColorName(val)){
				val = n.Color.colorNameToHex(val);
			}
			val = n.Color.hexToRgb(val);
		}
		this.r(val.shift());
		this.g(val.shift());
		this.b(val.shift());
		if(val.length){
			this.a(val.shift());
		}
		return this;
	}
,	get:function(){
		return [this.r(),this.g(),this.b(),this.a()];
	}
,	render:function(){
		if(this.a()==1){
			return '#'+n.Color.rgbToHex(this.r(),this.g(),this.b());
		}
		return 'rgba('+this.get().join(',')+')';
	}
,	validHex:function(val){
		return (
			(Array.isArray(val) && (val.length==3 || val.length==4))
		||	(typeof val == 'string' && (
				(val[0]=='#' && (val.length==7||val.length==4))
			||	(val.length==6||val.length==3)
			))
		);
	}
,	validColorName:function(val){
		return n.Color.colors.hasOwnProperty(val);
	}
,	valid:function(val){
		return this.validColorName(val) || this.validHex(val);
	}
});

n.Numeric = Class(n.Litteral,{
	constructor:function(val){
		if(!(this instanceof n.Numeric)){return new n.Numeric(val);}
		n.Numeric.Super.call(this,val);
	}
,	set:function(val){
		if(val !== 'auto' && val!== 'inherit'){
			if(val==='none'){val = 0;}
			val = parseFloat(val);
		}
		this._val = val;
	}
,	valueOf:function(){
		return (typeof this._val === 'string') ? 0 : this._val;
	}
,	valid:function(val){
		return !Array.isArray(val) && (val - parseFloat(val) + 1) >= 0;
	}
});

n.Integer = Class(n.Numeric,{
	constructor:function(val){
		if(!(this instanceof n.Integer)){return new n.Integer(val);}
		n.Integer.Super.call(this,val);
	}
,	set:function(val){
		if(val !== 'auto' && val!== 'inherit'){
			if(val==='none'){val = 0;}
			val = parseInt(val);
		}
		this._val = val;
	}
,	valid:function(val){
		return !isNaN(val) && (function(x){return (x | 0) === x; })(parseFloat(val));
	}
});

n.Unit = Class(n.Numeric,{
	STATIC:{
		extractUnit: function(val){
			val = val+'';
			return[
				(val.match(/^(\d|\.)+/) || [false])[0]
			,	(val.match(/\D+$/) || [false])[0]
			];
		}
	}
,	constructor:function(val,unit){
		if(!(this instanceof n.Unit)){return new n.Unit(val,unit);}
		n.Unit.Super.call(this,val);
		if(typeof unit != 'undefined' && unit !== null){
			this.unit(unit);
		}
	}
,	set:function(val){
		if(val !== 'auto' && val!== 'inherit'){
			if(val==='none'){val = 0;}
			val = n.Unit.extractUnit(val);
			if(val[0]!==false){
				this._val = val[0]
			}
			if(val[1]!==false){
				this.unit(val[1]);
			}
		}else{
			this._val = val;
		}
	}
,	unit:function(u){
		if(arguments.length){this._unit = u;return this;}
		return this._unit;
	}
,	render:function(){
		return this._val ? this._val+(this._unit?this._unit:'px'):'';
	}
,	valid:function(val){
		return /^(\d|\.)+(\D+)?$/.test(val);
	}
})

n.Percentage = Class(n.Unit,{
	constructor:function(val){
		if(!(this instanceof n.Percentage)){return new n.Percentage(val);}
		n.Percentage.Super.call(this,val,'%');
	}
,	valid:function(val){
		return /^(\d|\.)+%?$/.test(val);
	}
});

n.ListUnit = Class(n.List,{
	constructor:function(val,allowed_values,unit){
		if(!(this instanceof n.ListUnit)){return new n.ListUnit(val,allowed_values,unit);}
		this._allowed_values = [];
		if(typeof allowed_values != 'undefined' && allowed_values!==null){
			this.allowed(val);
		}		
		if(typeof val != 'undefined' && val!==null){
			this.set(val);
		}
		if(typeof unit != 'undefined' && unit!==null){
			this.unit(unit);
		}
	}
,	unit:function(u){
		if(arguments.length){this._unit = u;return this;}
		return this._unit;
	}
,	render:function(){
		return this._val ? 
			typeof this._val == 'string' ?
				this._val
				:
				this._val+(this._unit?this._unit:'px'):'';
	}
,	set:function(val){
		if(typeof val == 'string'){
			if(this._allowed_values.indexOf(val)>=0){
				this._val = val;
			}
		}else{
			this._val = val;
		}
		return this;
	}
,	valid:function(val){
		return (
			n.List.prototype.Super.valid.call(this,val)
		||	n.Unit.prototype.Super.valid.call(this,val)
		);
	}
})

n.String = Class(n.Litteral,{
	constructor:function(val){
		if(!(this instanceof n.String)){return new n.String(val);}
		n.String.Super.call(this,val);
	}
,	set:function(val){
		this._val = val+'';
		return this;
	}
,	render:function(){
		return this._val ? this._val:'';
	}
,	valid:function(val){
		return typeof val == 'string';
	}
});

n.Address = Class(n.String,{
	constructor:function(val){
		if(!(this instanceof n.Address)){return new n.Address(val);}
		n.Address.Super.call(this,val);
	}
,	set:function(val){
		val = val.replace(/^(ht|f)tps?:/,'');
		this._val = val;
		return this;
	}
});

n.Url = Class(n.Address,{
	constructor:function(val){
		if(!(this instanceof n.Url)){return new n.Url(val);}
		n.Url.Super.call(this,val);
	}
,	set:function(val){
		val = val.replace(/^url\(|\)$/,'');
		n.Url.Super.prototype.set.call(this,val);
		return this;
	}
,	render:function(){
		if(this._val && this._val!=='none'){
			return 'url("'+this._val+'")';
		}
		if(this._val=='none'){
			return 'none';
		}
		return '';
	}
,	valid:function(val){
		return /^url\(/gi.test(val);
	}
})

n.Bool = Class(n.Litteral,{
	constructor:function(val,trueString){
		if(!(this instanceof n.Bool)){return new n.Bool(val,trueString);}
		this._val = false;
		this._trueString = trueString;
		n.Bool.Super.call(this,val);
	}
,	set:function(val){
		val = !!val;
		this._val = val;
		return this;
	}
,	valid:function(val){
		return true;
	}
,	render:function(){
		if(this._val){
			return this._trueString?this._trueString:'true';
		}
		return false
	}
,	toValue:function(){
		return this._val?1:0;
	}
});

n.CSSDirective = Class(n.Litteral,{
	constructor:function(val,style){
		if(!(this instanceof n.CSSDirective)){return new n.CSSDirective(val,style);}
		this._style = style;
		n.CSSDirective.Super.call(this,val);
	}
,	valid:function(val){
		return true;
	}
,	render:function(){
		if(this._val && this._style){
			return this._val+'{'+this._style+'}';		
		}
		return ''
	}
});


n.Classes = Class(n.Litteral,{
	constructor:function(props){
		if(!(this instanceof n.Classes)){return new n.Classes(props);}
		this._val = [];
		n.Classes.Super.call(this,props);
	}
,	set:function(className){
		return this.add(className);
	}
,	unset:function(){
		this._val = [];
	}
,	get:function(){
		return this._val;
	}
,	add:function(className){
		if(arguments.length > 1){
			var i = arguments.length;
			while(i>=0){
				this.add(arguments[i--]);
			}
			return this;
		}
		if(!Array.isArray(className)){
			className = className.split(/\s/g);
		}
		while(className.length){
			var c = className.shift();
			if(c && this._val.indexOf(c)<0){
				this._val.push(c);
			}
		}
		return this;
	}
,	remove:function(className){
		if(arguments.length > 1){
			var i = arguments.length;
			while(i>=0){
				this.remove(arguments[i--]);
			}
			return this;
		}
		if(!Array.isArray(className)){
			className = className.split(/\s/g);
		}
		while(className.length){
			var c = className.shift();
			var i = this._val.indexOf(c);
			if(i>=0){
				this._val.splice(i,1);
			}
		}
		return this;
	}
,	render:function(){
		return this._val.join(' ');
	}
,	valid:function(val){
		return (
			Array.isArray(val)
		||	(typeof val == 'string' && /^[\d-_]/.test(val) == false)
		);
	}
});

n.ShortHand = Class(n.Litteral,{
	constructor:function(val,arr){
		if(!(this instanceof n.ShortHand)){return new n.ShortHand(val,arr);}
		n.ShortHand.Super.call(this);
		this._val = [];
		this._constructors = [];
		if(arr){
			this.addSubProperties(arr);
		}
		if(val){
			this.set(val);
		}
	}
,	addSubProperties:function(arr){
		for(var i=0, l=arr.length;i<l;i++){
			this.addSubProperty(arr[i]);
		}
		return this;
	}
,	addSubProperty:function(c){
		if(c.constructors){
			for(var i = 0, l = c.constructors.length;i<l;i++){
				this.addSubProperty(c.constructors[i]);
			}
			return this;
		}
		if(this._propertySize){this._propertySize = false;}
		this._constructors.push(c);
		this._val.push(new c());
		return this;
	}
,	set:function(val){
		if(Array.isArray(val)){
			return this.setFromArray(val);
		}
		return this.setFromString(val);
	}
,	get:function(){
		var arr = [];
		var props = this._val;
		for(var i = 0, l = props.length;i<l;i++){
			var val = props[i].render();
			if(val){
				arr.push(val);
			}
		}
		return arr;
	}
,	setFromString:function(str){
		return this.setFromArray(str.split(/\s+/));
	}
,	getPropertySize:function(){
		if(!this._propertySize){		
			var j = 0
			,	properties = this._val
			,	k = properties.length
			,	prop
			,	i = 0
			;
			for(j;j<k;j++){
				prop = properties[j];
				if(prop instanceof n.ShortHand){
					i+=prop.getPropertySize();
				}
				else{
					i++;
				}
			}
			this._propertySize = i;
		}
		return this._propertySize;
	}
,	setFromArray:function(arr){
		var i = 0
		,	l = arr.length
		,	val
		,	properties = this._val
		,	prop
		,	j = 0
		,	tokens
		,	k = properties.length
		;
		if(!k){return this;}
		for(i;i<l;i++){
			val = arr[i];
			while(j<k){
				prop = properties[j++];
				if(prop.valid(val)){
					prop.set(val);
					break;
				}
			}
			if(j==k){break;}
		}
		return this;
	}
,	render:function(){
		return this.get().join(' ');
	}
})

module.exports = n;