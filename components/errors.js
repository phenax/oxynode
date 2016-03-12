module.exports= {
	'404': (req,res)=> {                                      // Default 404 Error
		res.send("404 Not Found");
	},
	'500': (req, res)=> {
		res.send("Server Error");
	}
};