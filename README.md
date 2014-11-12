# DODOM
=======

A functions-based templating engine.  
DoDom has a function for every dom node. This makes it easy to create mixins, custom functions and whatnot.  
It is not *at all* optimized for speed; thus, it is ill-advised to use it in the browser, although it would probably work (not in IE<8 though).

----
## Install

`npm install dodom`

---
## Usage

the markup is composed of arrays like so:
`[tag,properties,children]`  
or  
`[tag,children]`  
or
`[tag,properties]`

Where children are either other DoDom Nodes, an array, an array of arrays, or a string, or a mix of all of the above. 

```js
var D = require('dodom');

var d = D
(['div',{class:'Wrapper'},
,   ['span',{class:['text'],style:{background:'red'},'&copy; ommak']
])
```

You can also compose your own components:
```js
var D = require('dodom');
var Widget = D.Widget;

Widget
('markupWidget',{
    //pseudo markup function
    beforeRenderText:function(locals){
        locals.text = locals.text.replace(/#+\s?(.*?)\n/,'<h3>$1</h3><br>').replace(/\n/,'');
    }
})
('title',{
    tag:'h1'
,   base:'markupWidget'
,   init:function(){
        this.addClass('{{namespace-title}}');
    }
})
('text',{
    base:'markupWidget'
,   init:function(){
        this.addClass('{{namespace-text}}')
    }
})
('article',{
    init:function(){
        this.namespace('article'); //will replace 'namespace' in the two other widgets
    }
},['title','text']) //using title and text widgets
```

then use them:

```js
var d = D(['div',{class:'Wrapper'},
    ['article',{title:'title',text:'some text, with some \n### PseudoMarkup\n yey'},
        ['ul',['li','don\'t mind me, just testin']]
    ]
,   ['span',{class:['footer','sweet'],style:{background:'red',color:'blue'}},'&copy; ommak']
]);

console.log(d.render(true,true)) //true for pretty output, and true to output inline styles
```

will yield:

```html
<div class="Wrapper">
    <div class="article">
        <div class="article-title">
            title
        </div>
        <div class="article-text">
            some text, with some <h3>PseudoMarkup</h3><br> yey
        </div>
        <ul>
            <li>
                don't mind me, just testin
            </li>
        </ul>
    </div>
    <span class="footer sweet" style="background:#ff0000;color:#000000">
        &copy; ommak
    </span>
    <span>
        blah
    </span>
</div>

```

...But maybe you prefer a terser syntax? You can use css-style identifiers if you like:

```js
D
(['#Wrapper',
    ['article',{title:'title',text:'some text, with some \n### PseudoMarkup\n yey'},
        ['ul',['li','don\'t mind me, just testin']]
    ]
,   ['span.footer.sweet',{style:{background:'red',color:'blue'}},'&copy; ommak']
])
```

More terse? ok, what about jade-like?
```jade
//file.dodom
#Wrapper
    a.something(href=anUrlFromLocals,target="_blank")=aTextFromLocals
        div 'abouk'
        article#Main(title='such a beautiful title',text='fantastic text')
    a.blah(href="#somewhere/beautiful") 'ommak'
#ItJustWorks
```

Sure, the custom widgets work here too(`article`).
Load it like so:

```js
var parse = require('dodom').parse;
var file = require('fs').readFileSync(__dirname+'/file.dodom',{encoding:'utf8'});

console.log(parser(file,{anUrlFromLocals:'a',aTextFromLocals:'b'})+'');
```

this will yield:

```html
<div id="Wrapper">
    <a href="a" target="_blank" class="something">
        b
        <div>
            abouk
        </div>
        <div class=" article" id="Main">
            <div class="article-title">
                such a beautiful title
            </div>
            <div class="article-text">
                fantastic text
            </div>
        </div>
    </a>
    <a href="#somewhere/beautiful" class="blah">
        ommak
    </a>
</div>
```

-----

### Note

a benefit of using widgets is that you can use them in your locals in another template. For example, the `article` above has a property called `title` that can be rendered on it's own:

```html
<div class="wrapper">
    {{=article.title.render()}}
</div>
```

----

## CSS

DoDom is meant for prototyping. That's why css is inlined during prototypal stages.

to output the styles inline, use `render([pretty],true)`

When you're done, you want to use `dodom.extractStyles`

Example, for the following markup:
```js
var D = require('dodom');

var styles = {
    footer:{background:'#ccc',color:'white'}
,   link:{'text-decoration':'none','float':'left'}
,   link_hover:{'background':'red'}
,   nav:{display:'block','float':'left'}
,   header:{'font-size':12}
}

d = D
(['html',
    ['head'
    ,   ['title','Testing DoDom']
    ]
,   ['body'
    ,   ['nav',{style:styles.nav}
        ,   
            (function(n,arr){
                while(n){arr.push(['li',['a',{href:"#"+n,':hover':styles.link_hover,style:styles.link},'link #'+(n--)]]);}
                return arr;
            })(5,['ul'])
        ]
    ,   ['#Main'
        ,   ['#Header'
            ,   ['h1',{style:styles.header},'Our Articles']
            ]
        ,   ['article',{title:'title1',text:'text1'}]
        ,   ['article',{title:'title2',text:'text2'}]
        ]
    ,   ['span.footer.sweet',{style:styles.footer},'&copy; ommak']
    ]
]);

styles = D.extractStyles(el);
console.log('<style>')
for(var n in styles){
    console.log(styles[n]+'')
}
console.log('</style>')

```

you'll get:

```html
<style>
body nav{display:block;float:left}
html body nav ul li a{text-decoration:none;float:left}
html body nav ul li a:hover{background:#ff0000}
#Header h1{font-size:0}
div.article{float:left}
.sweet{background:#cccccc;color:#ffffff}
</style>
```

As you see, the output is not perfect (why `div.article`?), but it's a good start to begin setting up the styles.

----

## FAQ

##### Why another templating engine?
Well, you see, there is something

#### Whyyyyyyyyyyyyyyyyyyyyyyyy
Hey, you aren't letting me speak. I get bothered in switching between languages. I completely disagree with the **no logic in templates is better** bull. All templating engines have logic, some only do a damn good job at masking it. Might as well have access to everything. Furthermore, if I am dealing with object, a plethora of possibilities and transformations opens to me. I also wanted to use inline styles because...

#### Inline styles? Madre de Dios
I know, I know, but hear me out. DoDom extracts your inline styles and orders them by specificity, and spews out a terse css sheet that you can modify as you see fit before writing it to file. Ain't it neat?

#### Is this actually usable?
It's very alpha. No unit testing, no errors are thrown, it has not been thoroughly tested, there's no proper documentation, probably leaking memory by all it's pores...It's still a bit shitty. Try it and let us know!

#### Examples?
Look in the /examples directory.

-----

## License
MIT of course