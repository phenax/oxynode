# OxyNode

[![Greenkeeper badge](https://badges.greenkeeper.io/phenax/oxynode.svg)](https://greenkeeper.io/)
OxyNode is a simple node framework for developing web applications with ease

# How to install?
* Install [nodeJS](https://nodejs.org/en/)
* Run `npm install --save oxynode`


# How to use?
```javascript
const OxyNode= require('oxynode');


// Initialize
const oxy= OxyNode();


// Configuration
oxy.config.$set('port', 3000);


// Route methods
var MainPage= (req,res)=> {
	res.render("./index.html", { name: "Akshay" });
};

var AboutPage= (req,res)=> {
	res.send("About Me");
};


// Route config
oxy.routes([
	{ url: '/', callback: MainPage },
	{ url: '/about', callback: AboutPage, method: 'POST' }
]);


// 404 error handler
oxy.errorHandling('404',(req,res)=> {
	res.send("Not found");
});


// Listen
oxy.listen({ port: oxy.config.$get('port') });
```

## Event Handling
```javascript
var events= oxy.pubsub();

events.on('message msg', ()=> {
  console.log("Hello World");
});

events.emit('message');

events.off('message');
```

## Templating engine
```javascript
const ejs= require('ejs');
oxy.config.$set('templating', ejs);
```
