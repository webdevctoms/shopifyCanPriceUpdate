 function CompareData(model,searchField){
	this.model = model;
	if(searchField === undefined){
		this.searchField = 'product_id';
	}
	else{
		this.searchField = searchField;
	}
}
//get single document from DB
CompareData.prototype.getDocument = function(productId) {
	let query = {};
	query[this.searchField] = productId;
	return this.model.find(query);
};

CompareData.prototype.compare = function(shopifyProducts,index,results) {
	let promise = new Promise((resolve,reject) => {
		console.log("metafield test index & shopifyProducts.length: ",index,shopifyProducts.length);
		if(index < shopifyProducts.length){
			return this.getDocument(shopifyProducts[index].id)

			.then(product => {
				console.log("product from db: ",product[0].variant_data.length,product[0].product_title);
				console.log('product from shopify: ',shopifyProducts[index].variants.length,shopifyProducts[index].title);

				resolve(this.compare(shopifyProducts,index + 1,results))
			})

			.catch(err => {
				console.log('err comparing data: ',err);
				reject(err);
			})
		}
		else{
			resolve(results)
		}
	});

	return promise;	
};

module.exports = {CompareData};