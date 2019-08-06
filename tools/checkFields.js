const {CKEY,URLCAD} = require('../config');

function buildUrl(fields){
	let newUrl = URLCAD + 'products.json?limit=250&fields=';
	for(let i = 0;i < fields.length;i++){
		newUrl += fields[i];
		if(i !== fields.length - 1){
			newUrl += ',';
		}
	}

	return newUrl;
}

let checkFields = function(req, res, next){
	if(!(req.body.fields instanceof Array)){
		return res.status(422).json({
			code:422,
			message:"error type"
		});
	}
	else{
		req.newUrl = buildUrl(req.body.fields)
		next();
	}
}

module.exports = {checkFields};