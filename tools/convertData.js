function convertVariants(variants){
	let convertedVariants = [];

	for(let i = 0;i < variants.length;i++){
		let convertedVariant = {};
		//convertedVariant.sku = variants[i].item_code;
		convertedVariant.price = variants[i].variant_price;
		convertedVariant.id = variants[i].variant_id;
		convertedVariants.push(convertedVariant);
	}

	return convertedVariants;
}

function convertData(productData){
	let newData = [];

	for(let i = 0;i < productData.length;i++){
		let convertedProduct = {};
		convertedProduct.product_id = productData[i].product_id;
		convertedProduct.variants = convertVariants(productData[i].variant_data);
		newData.push(convertedProduct);
	}

	return newData;
}

module.exports = {convertData};