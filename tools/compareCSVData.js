function convertPrice(price){
	let adjustedPrice = price.replace(',','');
	if(!adjustedPrice.includes('.')){
		adjustedPrice += '.00';
	}

	return adjustedPrice;
}
/*
function buildVariants(product,variantIndex,newPrice){
	let variants = [];

	for(let i = 0;i < product.variants.length;i++){
		let variant = {};
		variant.id = product.variants[i].id;
		variant.sku = product.variants[i].sku;
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
*/
function checkVariantLength(variants,shopifyVariants){
	let notFoundIndexes = [];
	if(variants.length !== shopifyVariants.length){
		for(let i = 0;i < shopifyVariants.length;i++){
			let foundVariant = false;
			for(let k = 0;k < variants.length;k++){
				if(variants[k].id === shopifyVariants[i].id){
					foundVariant = true;
					continue;
				}
			}
			if(!foundVariant){
				notFoundIndexes.push(i);
			}
		}
		//console.log('notFoundIndexes===================',notFoundIndexes,shopifyVariants[0].sku);
		if(notFoundIndexes.length > 0){
			for(let i = 0;i < notFoundIndexes.length;i++){
				let missingVariant = buildVariant(shopifyVariants[notFoundIndexes[i]],shopifyVariants[notFoundIndexes[i]].price);
				variants.push(missingVariant);
			}
		}
		//console.log('varaints after fix: ',variants);
	}

	return variants;
}

function buildVariant(variant,newPrice){
	let newVariant = {};

	newVariant.id = variant.id;
	//newVariant.sku = variant.sku;
	newVariant.price = newPrice;

	return newVariant
}

function convertToShopifyData(csvData,shopifyData,priceData){
	let updateData = [];
	let currentShopifyIndex = priceData[0].shopifyIndex;
	let productData = {};
	let variants = [];
	for(let i = 0;i < priceData.length;i++){
		if(priceData[i].shopifyIndex !== currentShopifyIndex){
			productData.product_id = shopifyData[currentShopifyIndex].id;
			variants = checkVariantLength(variants,shopifyData[currentShopifyIndex].variants);
			productData.variants = variants;	

			currentShopifyIndex = priceData[i].shopifyIndex;
			updateData.push(productData);
			productData = {};
			variants = [];
		}

		const currentProduct = shopifyData[currentShopifyIndex];
		let currentVariant = currentProduct.variants[priceData[i].variantIndex];
		let newPrice = currentVariant.price !== priceData[i].csvPrice ? priceData[i].csvPrice : currentVariant.price
		let variant = buildVariant(currentVariant,newPrice);
		variants.push(variant);
		//let variants = buildVariants(currentProduct,priceData[i].variantIndex,priceData[i].csvPrice); 
		//updateData.push(productData);
	}

	return updateData;
}
//final check to make sure variant lengths match
function finalLengthCheck(updateData,shopifyData){
	let foundCount = 0;
	for(let i = 0;i < updateData.length;i++){
		for(let k = 0;k < shopifyData.length;k++){
			if(updateData[i].product_id === shopifyData[k].id){
				foundCount++;
				if(updateData[i].variants.length !== shopifyData[k].variants.length){
					console.log('===error length===: ',updateData[i])
					return false;
				}
			}
		}
	}

	if(foundCount !== updateData.length){
		console.log('===error foundCount===: ',updateData.length,foundCount);
		return false;
	}

	return true;
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
	
	let updateData = convertToShopifyData(csvArr,productArr,priceData);
	let lengthCheck = finalLengthCheck(updateData,productArr);
	console.log('===========price differnces:',updateData.length,lengthCheck);
	if(lengthCheck){
		return updateData;
	}
	else{
		return null;
	}
	
}

module.exports = {compareCSVData};