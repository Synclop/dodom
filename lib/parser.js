var extend = require('node.extend');
var decomposeClassName = require('./DomElement').DomElement.decomposeClassName
var D = require('./Factory');
var undef;

function getValue(val,locals){
	if(val[0].match(/^("|')/)){
		return val.replace(/"|'/g,'');
	}
	if(!locals){return '';}
	val = val.split('.');
	var curr;
	var l = locals;
	while(val.length){
		curr = val.shift();
		if(l[curr]){
			l = l[curr];
		}else{
			return '';
		}
	}
	return l;
}

function stack(input){
	var arr = [];
	var previousIndent = 0;
	var indent = 0
	var curr;
	var stack = [arr];
	while(input.length){
		curr = input.shift();
		indent = curr.shift();
		curr = curr.shift();
		if(indent<previousIndent){
			stack.pop();
		}else if(indent>previousIndent){
			var parent = stack[stack.length-1];
			stack.push(parent[parent.length-1]);
		}
		stack[stack.length-1].push(curr);
		previousIndent = indent;
	}
	return arr;
}

function parse(str,locals){
	str = str.replace(/\r\n|\r/,'\n').split(/\n/);
	var arr = [];
	var line;
	var indent = 0;
	while(str.length){
		line = str.shift();
		var tag = 'div';
		var indent = (line.match(/^(?:    )+|^\t+/) || [''])[0].length
		line = line.substring(indent);
		var properties = (line.match(/\((.*?)\)/) || [])[1]
		var text = (line.match(/(?:(?:=|\s)\s*?)([^\)]*?)\s*?$/) || [])[1]
		var identifier = (line.match(/^([^\s]+?)(?:\s|\(|=|$)/) || [])[1]
		if(properties){
			var props = properties.split(/\s*?,\s*?/);
			properties = {};
			while(props.length){
				var p = props.shift().split('=');
				properties[p.shift()] = getValue(p.shift(),locals);
			}
		}
		if(text){
			text = getValue(text,locals);
		}
		if(identifier){
			identifier = decomposeClassName(identifier);
			if(identifier.tag){
				tag = identifier.tag;
				delete identifier.tag;
			}
			properties = extend({},properties,identifier);
		}
		if(tag=='!'){tag=undef}
		var el;
		if(tag && properties && text){
			el = [tag,properties,text];
		}else if(tag && properties){
			el = [tag,properties];
		}else if(tag && text){
			el = [tag,text]
		}else if(text){
			el = [undef,text]
		}
		arr.push([indent,el]);
	}
	if(arr.length){
		arr = stack(arr);
		return D(arr);
	}
	return false;
}

module.exports = parse;