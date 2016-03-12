module.exports= ()=> {                                                     // Simple PubSub
	var events;

	const on= (name, callback)=> {                    // Subscribe
		name= name.split(" ");

		for(var elem of name)
			events[elem]= { elem, callback };
	};

	const emit= (name)=> {                            // Publish
		if(events[name])
			(events[name].callback)({ name });
		else
			console.log("An unregistered event was called.");
	};

	const off= (name)=> {                            // Unsubscribe
		name= name.split(" ");

		for(var elem of name)
			delete events[elem];
	};

	return { on, emit, off, bind: on, unbind: off, pub: emit, sub: on, unsub: off };
};