const express = require("express");
const router = express.Router();
const {checkKey} = require("../tools/checkKey");
const {URLCAD,URLUS,USERKC,USERPC,USERK,USERP} = require('../config');
const {ReadCSV} = require('../classes/readCSV');

//initial test to see how it reads csv
router.post('/',checkKey,(req,res)=>{
	const fileName = req.query.file;
	const options = req.body.options
	//const filter = req.query.filter;
	console.log(options);
	//const columnData = JSON.parse(req.query.columnData);
	const readCSV = new ReadCSV();
	return readCSV.readFile(fileName)

	.then(data => {
		let filteredData = data;
		
		if(options){
			filteredData = readCSV.filterArray(options,data)
		}
		
		console.log('filtered data length: ',filteredData.length);
		res.json({
			status:200,
			data:filteredData
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