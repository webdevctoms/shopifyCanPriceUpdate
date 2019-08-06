const express = require("express");
const router = express.Router();
const {checkKey} = require("../tools/checkKey");
const {checkFields} = require("../tools/checkFields");
const {URLCAD,USERKC,USERPC} = require('../config');
const {GetData} = require('../classes/getData');

//copy data to db
router.post('/copy',checkKey,checkFields,(req,res)=>{
	const fields = req.body.fields;
	const newUrl = req.newUrl;
	const getData = new GetData(newUrl,USERKC,USERPC,fields);
	return getData.getData([],1)

	.then(data => {
		console.log('===========data length',data.length);
		res.json({
			status:200,
			data
		});
	})

	.catch(err => {
		console.log('error reading csv',err);
		res.json({
			status:500,
			error:'an error occured'
		});
	})
});

module.exports = {router};