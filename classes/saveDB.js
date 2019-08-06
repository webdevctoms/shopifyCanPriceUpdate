function SaveDB(productData,model,modelMap){
	this.productData = productData;
	this.model = model;
	//use this to make this class reusable for different models
	//key db model key the value will be the Shopify key
	this.modelMap = modelMap;
}

SaveDB.prototype.getVariantData = function(variants,variantMap) {
	let variantData = [];
	let modelKeys = Object.keys(variantMap);

	for(let i = 0;i < variants.length;i++){
		let singleVariant = {};
		for(let k = 0;k < modelKeys.length;k++){
			let currentKey = modelKeys[k];
			singleVariant[currentKey] = variants[i][variantMap[currentKey]];
		}
		variantData.push(singleVariant);
	}

	return variantData;
};

SaveDB.prototype.createData = function(product) {
	let createObj = {};
	let modelKeys = Object.keys(this.modelMap);

	for(let i = 0;i < modelKeys.length;i++){
		let currentKey = modelKeys[i];
		//get the model key and set the correct product data to the model key
		//because i am dynamically creating create object need a way to check for variants
		if(currentKey.includes('variant') || this.modelMap[currentKey].includes('variant')){
			//pass the variant map within the model map
			createObj[currentKey] = this.getVariantData(product.variants,this.modelMap[currentKey]);
		}
		else{
			createObj[currentKey] = product[this.modelMap[currentKey]];
		}
		
	}
	//console.log('==========create object: ',createObj);
	return this.model.create(createObj)
};

SaveDB.prototype.save = function(productIndex) {
	let promise = new Promise((resolve,reject) => {
		if(productIndex < this.productData.length){
			console.log('==============saving to db: ',productIndex,this.productData.length,this.productData[productIndex].title);

			return this.createData(this.productData[productIndex])

			.then(data => {
				resolve(this.save(productIndex + 1));
			})

			.catch( err => {
				console.log("===========Error saving products: ",productIndex,this.productData[productIndex].title);
				console.log(err);
				if(err.errmsg.includes("E11000")){
					resolve(this.save(productIndex + 1));
				}
				else{
					reject(err);
				}
			});
		}
		else{
			resolve('done');
		}
	});

	return promise;
};

module.exports = {SaveDB};