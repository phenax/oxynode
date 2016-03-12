module.exports= {                                                   // Default simple templating
	compile(data, stuff) {
		return (options)=> {
			for(var key in options) {
				data= data.split("{{"+key+"}}").join(options[key]);
				data= data.split("{{ "+key+" }}").join(options[key]);
			}

			return data;
		};
	}
};