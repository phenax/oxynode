module.exports= (req,res,templating,fs) => {
	res.send= (data, options)=> {                             // Send data
		options= options || {};

		res.writeHead(200, options);

		res.write(data);
		res.end();
	};

	res.render= (filename, options)=> {                       // Render templates
		var data= fs.readFileSync(filename,'utf8');
		data= (templating.compile(data, {}))(options);
		res.send(data, { "Content-Type": 'text/html' });
	};
};