function SaveDB(productData,model,modelMap){
	this.productData = productData;
	this.model = model;
	//use this to make this class reusable for different models
	//key db model key the value will be the Shopify key
	this.modelMap = modelMap;
}

SaveDB.prototype.getArrayData = function(arrayData,arrayMap) {
	let newArrayData = [];
	let modelKeys = Object.keys(arrayMap);

	for(let i = 0;i < arrayData.length;i++){
		let singleVariant = {};
		for(let k = 0;k < modelKeys.length;k++){
			let currentKey = modelKeys[k];
			if(arrayData[i][arrayMap[currentKey]]){
				singleVariant[currentKey] = arrayData[i][arrayMap[currentKey]];
			}
		}
		newArrayData.push(singleVariant);
	}

	return newArrayData;
};

SaveDB.prototype.createData = function(product) {
	let createObj = {};
	let modelKeys = Object.keys(this.modelMap);
	//console.log(modelKeys);
	for(let i = 0;i < modelKeys.length;i++){
		let currentKey = modelKeys[i];
		//get the model key and set the correct product data to the model key
		//because i am dynamically creating create object need a way to check for variants
		if(typeof this.modelMap[currentKey] === 'object' && this.modelMap[currentKey] !== null){
			//pass the variant map within the model map
			createObj[this.modelMap[currentKey].model_title] = this.getArrayData(product[currentKey],this.modelMap[currentKey]);
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