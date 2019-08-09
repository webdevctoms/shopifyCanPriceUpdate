function getEndIndex(productArr,compareKey){
	let finalIndex = 0;
	for(let i = 0;i < productArr.length;i++){
		finalIndex += productArr[i][compareKey].length - 1;
	}

	return finalIndex;
}

function getStartIndex(productArr,compareKey){
	let startIndex = 0;
	for(let i = 0;i < productArr.length;i++){
		if(productArr[i][compareKey].length === 1 && productArr[i][compareKey][0].sku === ''){
			startIndex = i;
		}
		else{
			break;
		}
	}

	return startIndex + 1;
}

function convertPrice(price){
	let adjustedPrice = price.replace(',','');
	if(!adjustedPrice.includes('.')){
		adjustedPrice += '.00';
	}

	return adjustedPrice;
}

function buildVariants(product,variantIndex,newPrice){
	let variants = [];

	for(let i = 0;i < product.variants.length;i++){
		let variant = {};
		variant.id = product.variants[i].id;
		if(i === variantIndex){
			variant.price = newPrice;
		}
		else{
			variant.price = product.variants[i].price;
		}
		variants.push(variant);
	}

	return variants;
}

function convertToShopifyData(csvData,shopifyData,priceData){
	let updateData = [];

	for(let i = 0;i < priceData.length;i++){
		const currentProduct = shopifyData[priceData[i].shopifyIndex];
		let productData = {};
		let variants = buildVariants(currentProduct,priceData[i].variantIndex,priceData[i].csvPrice); 
		productData.product_id = currentProduct.id;
		productData.variants = variants;
		updateData.push(productData);
	}

	return updateData;
}

//compare csv data to shopify data
function compareCSVData(csvArr,productArr,compareIndex,priceIndex,compareKey){
	let priceData = [];

	for(let i = 0;i < csvArr.length;i++){
		let csvItemCode = csvArr[i][compareIndex].replace(',','');
		let csvPrice = convertPrice(csvArr[i][priceIndex]);	
		for(let k = 0;k < productArr.length;k++){
			for(let v = 0;v < productArr[k][compareKey].length;v++){
				let productItemCode = productArr[k][compareKey][v].sku;
				let variantPrice = productArr[k][compareKey][v].price;
				if(csvItemCode === productItemCode){
					//console.log(csvPrice,variantPrice,csvItemCode,productItemCode);
					if(csvPrice !== variantPrice){
						//console.log('=========================price no match===========================: ',csvPrice,csvItemCode);
						priceData.push({
							shopifyIndex:k,
							variantIndex:v,
							csvItemCode,
							productItemCode,
							csvPrice,
							variantPrice
						});
					}

					//console.log('======================found variant===============: ',csvItemCode,productItemCode);
					break;
				}
			}
		}
	}
	console.log('===========price differnces:',priceData.length);
	let updateData = convertToShopifyData(csvArr,productArr,priceData);

	return updateData;
}

module.exports = {compareCSVData};