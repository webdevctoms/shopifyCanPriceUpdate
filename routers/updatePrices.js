const express = require("express");
const router = express.Router();
const {checkKey} = require("../tools/checkKey");
const {URLCAD,URLUS,USERKC,USERPC,USERK,USERP} = require('../config');
const {ReadCSV} = require('../classes/readCSV');

//initial test to see how it reads csv
router.get('/',checkKey,(req,res)=>{
	const readCSV = new ReadCSV();
	return readCSV.readFile()

	.then(data => {
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