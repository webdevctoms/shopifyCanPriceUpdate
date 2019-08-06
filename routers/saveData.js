const express = require("express");
const router = express.Router();
const {checkKey} = require("../tools/checkKey");
const {checkFields} = require("../tools/checkFields");
const {Prices} = require('../models/priceModel');
const {URLCAD,USERKC,USERPC} = require('../config');
const {GetData} = require('../classes/getData');
const {SaveDB} = require('../classes/saveDB');

//copy data to db
router.post('/copy',checkKey,checkFields,(req,res)=>{
	const fields = req.body.fields;
	const newUrl = req.newUrl;
	const getData = new GetData(newUrl,USERKC,USERPC,fields);
	return getData.getData([],1)

	.then(data => {
		const modelMap = {
			product_id:'id',
			product_title:'title',
			variant_data:{
				variant_id:'id',
				variant_price:'price',
				item_code:'sku'
			}
		};
		const saveDB = new SaveDB(data,Prices,modelMap);
		console.log('===========data length',data.length);
		return saveDB.save(0)
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

module.exports = {router};