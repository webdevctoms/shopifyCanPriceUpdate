const express = require("express");
const router = express.Router();
const {checkKey} = require("../tools/checkKey");
const {checkFields} = require("../tools/checkFields");
const {compareCSVData} = require("../tools/compareCSVData");
const {URLCAD,USERKC,USERPC,EMAIL,EP,SENDEMAIL} = require('../config');
const {ReadCSV} = require('../classes/readCSV');
const {GetData} = require('../classes/getData');
const {SaveToShopify} = require('../classes/saveToShopify');
const {SendMail} = require('../classes/sendMail');

/*
{	"fields":["id","title","variants"],
	"options":{
		"type":"compare",
		"columnData":{
			"Currency":["CAN"],
			"Price Level":["Online Price"]
		}
	}
}
*/

//initial test to see how it reads csv
router.post('/',checkKey,checkFields,(req,res)=>{
	let filteredData;
	let productsSorted;
	let products;
	let updatePriceArray;
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
		console.time('compareCSVData');
		console.log('filtered data length: ',filteredData.length);
		filteredData = readCSV.sortData(filteredData,0);
		updatePriceArray = compareCSVData(filteredData,products,0,6,'variants'); 
		console.timeEnd('compareCSVData');
		//use this to get list of prices
		/*
		return res.json({
			status:200,
			message:updatePriceArray
		});
		*/
		const halfIndex = Math.round(updatePriceArray.length / 2);
		const halfData1 = updatePriceArray.slice(0,halfIndex);
		const halfData2 = updatePriceArray.slice(halfIndex,updatePriceArray.length);
		const saveToShopify = new SaveToShopify(halfData1,URLCAD,USERKC,USERPC);
		const saveToShopify2 = new SaveToShopify(halfData2,URLCAD,USERKC,USERPC);
		 
		return Promise.all([saveToShopify.saveData(0),saveToShopify2.saveData(0)])
		
	})

	.then(data => {
		console.log('done saving');
		const email = new SendMail(EMAIL,EP);
		return email.send('test@email.com',SENDEMAIL,'Save Data From CSV','<b>Done saving data to Shopify from CSV</b>')
	})

	.then(data => {
		res.json({
			status:200,
			message:'done updating from csv'
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