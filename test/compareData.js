 function CompareData(model,searchField,modelMap){
	this.model = model;
	if(searchField === undefined){
		this.searchField = 'product_id';
	}
	else{
		this.searchField = searchField;
	}
	this.modelMap = modelMap;
}
//get single document from DB
CompareData.prototype.getDocument = function(productId) {
	let query = {};
	query[this.searchField] = productId;
	return this.model.find(query);
};

CompareData.prototype.compareInnerObject = function(shopifyData,productData,arrayMap){
	let errorData = {};
	let modelKeys = Object.keys(arrayMap);
	if(shopifyData.length !== productData.length){
		errorData.length_error = productData.item_code;
		return errorData;
	}

	for(let i = 0;i < productData.length;i++){
		for(let k = 0;k < modelKeys.length;k++){
			const currentKey = modelKeys[k];
			const shopifyKey = arrayMap[currentKey];
			//model title is the key for the db object(variant_data)
			if(!currentKey.includes('model_title')){
				if(productData[i][currentKey] != shopifyData[i][shopifyKey]){
					console.log('error key: ',currentKey,shopifyKey,productData[i][currentKey],shopifyData[i][shopifyKey],i);
					console.log('===================found error=====================',productData[i],shopifyData[i]);
					errorData[currentKey] = {
						item_code:productData[i].item_code,
						product_id:shopifyData[i].product_id
					};
				}
			}
		}
	}
	if(Object.keys(errorData).length > 0){
		console.log('================inner object error======================',errorData);
	}
	
	return errorData;
};

CompareData.prototype.compareProducts = function(shopifyProduct,product) {
	let errorObject = {};
	let modelKeys = Object.keys(this.modelMap);
	for(let i = 0;i < modelKeys.length;i++){
		const currentKey = modelKeys[i];
		const shopifyKey = this.modelMap[currentKey];
		if(typeof this.modelMap[currentKey] === 'object' && this.modelMap[currentKey] !== null){
			//console.log(shopifyKey,currentKey,shopifyKey.model_title,product[shopifyKey.model_title],product);
			let innerError = this.compareInnerObject(shopifyProduct[currentKey],product[shopifyKey.model_title],this.modelMap[currentKey]);
			if(Object.keys(innerError).length > 0){
				errorObject[currentKey] = innerError;
			}
		}
		else if(product[currentKey] != shopifyProduct[shopifyKey]){
			errorObject[currentKey] = {
				title:product.product_title,
				product_id:product.product_id
			};
		}
	}

	return errorObject;
};

CompareData.prototype.compare = function(shopifyProducts,index,results) {
	let promise = new Promise((resolve,reject) => {
		console.log("metafield test index & shopifyProducts.length: ",index,shopifyProducts.length);
		if(index < shopifyProducts.length){
			return this.getDocument(shopifyProducts[index].id)

			.then(product => {
				if(product.length === 0){
					results.push({
						no_id:shopifyProducts[index].id
					});
					resolve(this.compare(shopifyProducts,index + 1,results));
				}
				console.log("product from db: ",product[0].variant_data.length,product[0].product_title);
				console.log('product from shopify: ',shopifyProducts[index].variants.length,shopifyProducts[index].title);
				let compareError = this.compareProducts(shopifyProducts[index],product[0]);
				if(Object.keys(compareError).length > 0){
					results.push(compareError);
				}
				resolve(this.compare(shopifyProducts,index + 1,results));
			})

			.catch(err => {
				console.log('err comparing data: ',err);
				reject(err);
			})
		}
		else{
			resolve(results);
		}
	});

	return promise;	
};

module.exports = {CompareData};