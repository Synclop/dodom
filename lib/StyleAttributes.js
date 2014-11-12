var utils = require('./utils');
var Nodes = require('./Nodes');
var Class = require('myclass').Class;
var extend = require('node.extend');

var borderStyle = 'inherit,none,hidden,dotted,dashed,solid,groove,ridge,inset,outset,double';

var SKIP = {};

function isFunction(fn) {
	return fn && Object.prototype.toString.call(fn) === '[object Function]';
}

var a = {};

function makeClass(constructor,cssName,args){
	var STATIC = {
		cssName:cssName
	,	arity:args.length
	}
	if(constructor == Nodes.ShortHand){
		args[1] = args[1].split(/\s+/);
		for(var i = 0, l = args[1].length;i<l;i++){
			var subClassConstructor = a[args[1][i]];
			if(!subClassConstructor){
				throw new Error('no constructor found for '+args[1][i]);
			}
			args[1][i] = subClassConstructor;
		}
		STATIC.constructors = args[1].slice();
	}
	var c = Class(constructor,{
		STATIC:STATIC
	,	constructor:function(v1,v2){
			if(!(this instanceof c)){return new c(v1,v2);}
			if(typeof v1 == 'undefined' && args[0]!=='undefined' && args[0]!==SKIP){v1 = args[0];}
			if(typeof v2 == 'undefined' && args[1]!=='undefined' && args[1]!==SKIP){v2 = args[1];}
			c.Super.call(this,v1,v2,(args.length > 2 && args[2]!=='undefined' && args[2]!==SKIP && args[2]));
		}
	});
	return c;
}



(function(attrs){

	for(var n in attrs){
		var funcName = n.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
		var constructor = attrs[n].shift()
		var args = attrs[n] || [];
		args.unshift(SKIP);
		a[funcName] = makeClass(constructor,n,args)
	}

})({	
	"background-attachment":[Nodes.List,'inherit,scroll,fixed']
,	"background-color":[Nodes.Color]
,	"background-image":[Nodes.Url]
,	"background-position-x":[Nodes.Unit,'px']
,	"background-position-y":[Nodes.Unit,'px']
,	"background-repeat":[Nodes.List,'inherit,repeat,repeat-x,repeat-y,no-repeat']
,	"behavior":[Nodes.String]
,	"border-bottom-color":[Nodes.Color]
,	"border-bottom-style":[Nodes.List,borderStyle]
,	"border-bottom-width":[Nodes.Unit,'px']
,	"border-collapse":[Nodes.Bool]
,	"border-color":[Nodes.Color]
,	"border-left-color":[Nodes.Color]
,	"border-left-style":[Nodes.List,borderStyle]
,	"border-left-width":[Nodes.Unit,'px']
,	"border-right-color":[Nodes.Color]
,	"border-right-style":[Nodes.List,borderStyle]
,	"border-right-width":[Nodes.Unit,'px']
,	"border-spacing-x":[Nodes.Unit,'px']
,	"border-spacing-y":[Nodes.Unit,'px']
,	"border-style":[Nodes.List,borderStyle]
,	"border-top-color":[Nodes.Color]
,	"border-top-style":[Nodes.List,borderStyle]
,	"border-top-width":[Nodes.Unit,'px']
,	"border-width":[Nodes.Unit,'px']
,	"bottom":[Nodes.Unit,'px']
,	"caption-side":[Nodes.List,'inherit,top,bottom,left,right']
,	"clear":[Nodes.List,'inherit,none,left,right,both']
,	"clip":[Nodes.String]
,	"color":[Nodes.Color]
,	"content":[Nodes.String]
,	"counter-increment":[Nodes.String]
,	"counter-reset":[Nodes.String]
,	"cursor":[Nodes.List,'inherit,default,auto,n-resize,ne-resize,e-resize,se-resize,s-resize,sw-resize,w-resize,nw-resize,crosshair,pointer,move,text,wait,help,hand,all-scroll,col-resize,row-resize,no-drop,not-allowed,progress,vertical-text,alias,cell,copy,count-down,count-up,count-up-down,grab,grabbing,spinning']
,	"direction":[Nodes.List,'inherit,ltr,rtl']
,	"display":[Nodes.List,'inherit,none,inline,block,inline-block,list-item,marker,compact,run-in,table-header-group,table-footer-group,table,inline-table,table-caption,table-cell,table-row,table-row-group,table-column,table-column-group']
,	"empty-cells ":[Nodes.List,'inherit,show,hide']
,	"filter":[Nodes.String]
,	"float":[Nodes.List,'inherit,none,left,right']
,	"font-family":[Nodes.String]
,	"font-size":[Nodes.Unit,'px']
,	"font-size-adjust":[Nodes.Numeric]
,	"font-stretch":[Nodes.List,'narrower,wider,ultra-condensed,extra-condensed,condensed,semi-condensed,normal,semi-expanded,expanded,extra-expanded,ultra-expanded']
,	"font-style":[Nodes.List,'inherit,normal,italic,oblique']
,	"font-variant":[Nodes.List,'inherit,normal,small-caps']
,	"font-weight":[Nodes.String]
,	"height":[Nodes.Unit,'px']
,	"ime-mode":[Nodes.List,'auto,active,inactive,deactivated']
,	"left":[Nodes.Unit,'px']
,	"letter-spacing":[Nodes.Unit,'px']
,	"line-break":[Nodes.List,'normal,strict']
,	"line-height":[Nodes.Unit,'px']
,	"list-style-image":[Nodes.Url]
,	"list-style-position":[Nodes.List,'inherit,inside,outside']
,	"list-style-type":[Nodes.List,'inherit,none,disc,circle,square,decimal,decimal-leading-zero,lower-roman,upper-roman,lower-alpha,upper-alpha,lower-greek,lower-latin,upper-latin,armenian,georgian,hebrew,cjk-ideographic,hiragana,katakana,hiragana-iroha,katakana-iroha']
,	"margin-bottom":[Nodes.Unit,'px']
,	"margin-left":[Nodes.Unit,'px']
,	"margin-right":[Nodes.Unit,'px']
,	"margin-top":[Nodes.Unit,'px']
,	"marker-offset":[Nodes.Unit,'px']
,	"marks":[Nodes.List,'inherit,none,crop,cross']
,	"max-height":[Nodes.Unit,'px']
,	"max-width":[Nodes.Unit,'px']
,	"min-height":[Nodes.Unit,'px']
,	"min-width":[Nodes.Unit,'px']
,	"orphans":[Nodes.Integer]
,	"outline-color":[Nodes.Color]
,	"outline-style":[Nodes.List,borderStyle]
,	"outline-width":[Nodes.Unit,'px']
,	"overflow":[Nodes.List,'inherit,visible,hidden,scroll,auto']
,	"overflow-X":[Nodes.List,'visible,hidden,scroll,auto']
,	"overflow-Y":[Nodes.List,'visible,hidden,scroll,auto']
,	"padding-bottom":[Nodes.Unit,'px']
,	"padding-left":[Nodes.Unit,'px']
,	"padding-right":[Nodes.Unit,'px']
,	"padding-top":[Nodes.Unit,'px']
,	"position":[Nodes.List,'inherit,static,relative,absolute,fixed']
,	"quotes":[Nodes.String]
,	"right":[Nodes.Unit,'px']
,	"table-layout":[Nodes.List,'inherit,auto,fixed']
,	"text-align":[Nodes.List,'inherit,left,right,center,justify']
,	"text-align-last":[Nodes.List,'inherit,left,right,center,justify']
,	"text-decoration":[Nodes.List,'inherit,none,underline,overline,line-through,blink']
,	"text-indent":[Nodes.Unit,'px']
,	"text-justify":[Nodes.List,'auto,distribute,distribute-all-lines,inter-cluster,inter-ideograph,inter-word,newspaper']
,	"text-overflow":[Nodes.List,'clip,ellipsis']
,	"text-shadow":[Nodes.String]
,	"text-transform":[Nodes.List,'inherit,none,capitalize,uppercase,lowercase']
,	"text-kashida-space":[Nodes.Percentage]
,	"text-underline-position":[Nodes.List,'auto,auto-pos,below,above']
,	"top":[Nodes.Unit,'px']
,	"unicode-bidi":[Nodes.List,'inherit,normal,embed,bidi-override']
,	"vertical-align":[Nodes.ListUnit,'inherit,baseline,middle,top,bottom,text-top,text-bottom,super,sub','px']
,	"visibility":[Nodes.List,'inherit,visible,hidden,collapse']
,	"white-space":[Nodes.List,'inherit,normal,pre,pre-wrap,pre-line']
,	"widows":[Nodes.Integer]
,	"width":[Nodes.Unit,'px']
,	"word-break":[Nodes.List,'normal,break-all,keep-all']
,	"word-spacing":[Nodes.Unit,'px']
,	"word-wrap":[Nodes.List,'normal,break-word']
,	"z-index":[Nodes.Integer]
,	"zoom":[Nodes.Unit,'px']
,	"background-position":[Nodes.ShortHand,'backgroundPositionX backgroundPositionY']
,	"background":[Nodes.ShortHand,'backgroundColor backgroundImage backgroundRepeat backgroundAttachment backgroundPosition']
,	"border-spacing":[Nodes.ShortHand,'borderSpacingX borderSpacingY']
,	"border-bottom":[Nodes.ShortHand,'borderWidth borderStyle borderColor']
,	"border-left":[Nodes.ShortHand,'borderWidth borderStyle borderColor']
,	"border-right":[Nodes.ShortHand,'borderWidth borderStyle borderColor']
,	"border-top":[Nodes.ShortHand,'borderWidth borderStyle borderColor']
,	"border":[Nodes.ShortHand,'borderWidth borderStyle borderColor']
,	"font":[Nodes.ShortHand,'fontStyle fontVariant fontWeight fontSize lineHeight fontFamily']
,	"list-style":[Nodes.ShortHand,'listStyleType listStylePosition listStyleImage']
,	"margin":[Nodes.ShortHand,'marginTop marginRight marginBottom marginLeft']
,	"outline":[Nodes.ShortHand,'outlineColor outlineStyle outlineWidth']
,	"padding":[Nodes.ShortHand,'paddingTop paddingRight paddingBottom paddingLeft']
});


module.exports = a;