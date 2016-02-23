const http= require('http');
const fs= require('fs');

const OxyNode= ()=> {
	var app;
	var all_routes= [];
	var config= {};
	var events= {};

	var error_404= (req,res)=> {                                      // Default 404 Error
		res.send("404 Not Found");
	};

	config.templating= {                                              // Default templating
		compile(data, stuff) {
			return (options)=> {
				for(var key in options) {
					data= data.split("{{"+key+"}}").join(options[key]);
				}

				return data;
			};
		}
	};

	var server_set= ()=> {                                            // Create server function
		app= http.createServer((req,res,err)=> {
			res.send= (data)=> {                                      // Send data
				res.write(data);
				res.end();
			};

			res.render= (filename, options)=> {                       // Render templates
				var data= fs.readFileSync(filename,'utf8');
				data= (config.templating.compile(data, {}))(options);
				res.send(data);
			};

			if(err) {                                                 // Server errors
				res.send("Server Error");
				throw err;
			}

			for(var i= all_routes.length - 1; i>= 0; i--) {           // Cycling through routes
				if(all_routes[i].url == req.url) {
					all_routes[i].method(req,res);
					break;
				}
			}

			if(i < 0) {                                               // Route not found
				error_404(req,res);
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

	var handle_404= (fn)=> {                                          // Users defining new 404 Handlers
		error_404= fn;
	};

	var pubsub= {                                                     // Simple PubSub

		on(name, callback) {                    // Subscribe
			name= name.split(" ");

			for(var elem of name) {
				events[elem]= {
					elem,
					callback
				};
			}
		},
		emit(name) {                            // Publish
			if(events[name]) {
				var e= { name };

				(events[name].callback)(e);
			} else {
				console.log("Event not registered");
			}
		},
		off(name) {                            // Unsubscribe
			name= name.split(" ");

			for(var elem of name) {
				delete events[elem];
			}
		}
	};

	var $set= (name,data)=> {                                          // Config setter
		config[name]= data;
	};

	var $get= (name) => {                                              // Config getter
		return config[name];
	};


	return {
		listen,
		routes,
		handle_404,
		pubsub,
		config: { $set, $get }
	}
};

module.exports= OxyNode;