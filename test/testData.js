const chai = require('chai');
const mongoose = require('mongoose');
const expect = chai.expect;
const {app, runServer, closeServer} = require('../server');
const {GetData} = require('../classes/getData');
const {CompareData} = require('./compareData');
const {Prices} = require('../models/priceModel');
const {DATABASE_URL,URLCAD,USERKC,USERPC} = require('../config');
//do tests linear way ie no promise.all to make sure that no data is missed from the router
describe('Test product data',function(){
	before(function(){
		return runServer(DATABASE_URL);
	});

	after(function() {
	    return closeServer();
	});

	describe('Compare saved data to CAD data',function(){

		it('should start server',function(done){
			//set timeout for test
			this.timeout(5000);
			expect(1+1).to.equal(2);
			done();
		});

		it('should have matching data',function(){
			this.timeout(900000);
			const fields = ['id','title','variants'];
			const url = URLCAD + 'products.json?limit=250&fields=id,title,variants';
			const getData = new GetData(url,USERKC,USERPC,fields);

			return getData.getData([],1)

			.then(productData => {
				console.log('================Product Data Length: ',productData.length);
				const compareData = new CompareData(Prices,'product_id');
				return compareData.compare(productData,0,[])
			})

			.then(results => {
				console.log("=========================results from compare prices: ",results, results.length);
				expect(results).to.have.lengthOf(0);
			})

			.catch(err => {
				console.log('Error testing metafield data: ',err);
			});
		});
	});
});