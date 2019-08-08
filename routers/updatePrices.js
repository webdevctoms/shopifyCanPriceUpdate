const express = require("express");
const router = express.Router();
const {checkKey} = require("../tools/checkKey");
const {checkFields} = require("../tools/checkFields");
const {URLCAD,URLUS,USERKC,USERPC,USERK,USERP} = require('../config');
const {ReadCSV} = require('../classes/readCSV');
const {GetData} = require('../classes/getData');

//initial test to see how it reads csv
router.post('/',checkKey,checkFields,(req,res)=>{
	let filteredData;
	let productsSorted;
	let products
	const fields = req.body.fields;
	const newUrl = req.newUrl;
	const fileName = req.query.file;
	const options = req.body.options;
	const readCSV = new ReadCSV();
	const getData = new GetData(newUrl,USERKC,USERPC,fields);
	return getData.getData([],1)
	//after getting data read csv price data
	.then(productData => {
		products = productData;
		console.log('product data length: ',productData.length);
		console.log(options);
		return readCSV.readFile(fileName)
	})
	//filter csv price data
	.then(data => {
		filteredData = data;
		if(options){
			filteredData = readCSV.filterArray(options,data)
		}
		
		console.log('filtered data length: ',filteredData.length);
		filteredData = readCSV.sortData(filteredData,0);
		productsSorted = getData.sortData(products,'variants','sku');
		res.json({
			status:200,
			data:filteredData
		});
	})

	//

	.catch(err => {
		console.log('error reading csv',err);
		res.json({
			status:500,
			error:'an error occured'
		});
	})
});

module.exports = {router};