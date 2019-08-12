const express = require("express");
const router = express.Router();
const {checkKey} = require("../tools/checkKey");
const {checkFields} = require("../tools/checkFields");
const {convertData} = require("../tools/convertData");
const {Prices} = require('../models/priceModel');
const {URLCAD,USERKC,USERPC} = require('../config');
const {GetData} = require('../classes/getData');
const {SaveDB} = require('../classes/saveDB');
const {SaveToShopify} = require('../classes/saveToShopify');

//copy data to db
router.post('/copy',checkKey,checkFields,(req,res)=>{
	const fields = req.body.fields;
	const newUrl = req.newUrl;
	const getData = new GetData(newUrl,USERKC,USERPC,fields);
	return getData.getData([],1)

	.then(data => {
		const halfIndex = Math.round(data.length / 2);
		const halfData1 = data.slice(0,halfIndex);
		const halfData2 = data.slice(halfIndex,data.length);
		//could possibly pass this as a argument in post request
		const modelMap = {
			product_id:'id',
			product_title:'title',
			variants:{
				model_title:'variant_data',
				variant_id:'id',
				variant_price:'price',
				item_code:'sku'
			}
		};
		const saveDB = new SaveDB(halfData1,Prices,modelMap);
		const saveDB2 = new SaveDB(halfData2,Prices,modelMap);
		console.log('===========data length',data.length);
		return Promise.all([saveDB.save(0),saveDB2.save(0)])
	})

	.then(data => {
		console.log('done saving');
		res.json({
			status:200,
			data
		});
	})

	.catch(err => {
		console.log('error copying data',err);
		res.json({
			status:500,
			error:'an error occured'
		});
	})
});
//save from backup
router.get('/backup',checkKey,(req,res)=>{
	
	return Prices.find({})

	.then(priceData => {
		const convertedData = convertData(priceData);
		const halfIndex = Math.round(convertedData.length / 2);
		const halfData1 = convertedData.slice(0,halfIndex);
		const halfData2 = convertedData.slice(halfIndex,convertedData.length);
		const saveToShopify = new SaveToShopify(halfData1,URLCAD,USERKC,USERPC);
		const saveToShopify2 = new SaveToShopify(halfData2,URLCAD,USERKC,USERPC);
		 
		return Promise.all([saveToShopify.saveData(0),saveToShopify2.saveData(0)])
	})

	.then(data => {
		res.json({
			status:200,
			data
		});
	})

	.catch(err => {
		console.log('error copying data',err);
		res.json({
			status:500,
			error:'an error occured'
		});
	})
});

module.exports = {router};