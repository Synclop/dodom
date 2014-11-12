var u = {};
var undef;

u.makeGetterSetter = function(propName,arity,constructor){
	var func;
	if(arity==1){
		func = function(val){
			if(arguments.length){
				if(!this._props[propName]){this._props[propName] = new constructor(val);}
				else{
					this._props[propName].set(val);
				}
				return this;
			}
			return this._props[propName] ? this._props[propName].get() :  undef;
		}
	}else if(arity>1){
		func = function(val,unit){
			if(arguments.length){
				if(!this._props[propName]){this._props[propName] = new constructor(val,unit);}
				else{
					if(typeof val !== 'undefined'){
						this._props[propName].set(val);
					}
					if(typeof unit !== 'undefined'){
						this._props[propName].unit(val);
					}
				}
				return this;
			}
			return this._props[propName] ? this._props[propName].get() :  undef;
		}	
	}
	return func;
}

module.exports = u;
