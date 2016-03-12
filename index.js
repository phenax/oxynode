const http= require('http');
const fs= require('fs');
const templating= require('./components/templating');
const response= require('./components/response');
const pubsub= require('./components/pubsub');
const default_errors= require('./components/errors');

const OxyNode= ()=> {
	var app;
	var all_routes= [];
	var config= {};
	config.templating= templating;

	var error_handlers= default_errors;

	var server_set= ()=> {                                            // Create server function
		app= http.createServer((req,res)=> {
			var method, index;

			response(req,res,templating,fs);                          // Additional response methods

			for(index= all_routes.length - 1; index>= 0; index--) {  // Cycling through routes
				method= all_routes[index].method || 'get';
				if(all_routes[index].url == req.url && method.toLowerCase() == (req.method).toLowerCase()) {
					all_routes[index].callback(req,res);
					break;
				}

				if(index === 0)
					req.status= 404;
			}

			for(index in error_handlers) {
				if(req.status == parseInt(index)) {
					(error_handlers[index])(req,res);
				}
			}
		});
	};

	var listen= (options, fn)=> {                                     // Listen to port
		server_set();
		app.listen(options.port,fn);
	};

	var routes= (array)=> {                                           // Routes config
		all_routes= all_routes.concat(array);
		return { listen };
	};

	var errorHandling= (status,fn)=> {                                 // User defined error handlers
		error_handlers[status]= fn;
	};

	var $set= (name,data)=> {                                          // Config setter
		config[name]= data;
	};

	var $get= (name) => {                                              // Config getter
		return config[name];
	};


	return { listen, routes, errorHandling, pubsub, config: { $set, $get } };
};

module.exports= OxyNode;