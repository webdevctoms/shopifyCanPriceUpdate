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

function checkVariant(currentVariant,csvArr,i,compareIndex,priceData,foundVariants,variantLength,productIndex,priceIndex){
	for(let k = 0;k < currentVariant.length;k++){
		let csvItemCode = csvArr[i][compareIndex].replace(',','');
		let productItemCode = currentVariant[k].sku;
		let csvPrice = convertPrice(csvArr[i][priceIndex]);
		let variantPrice = currentVariant[k].price;
		console.log('=======',i,productIndex,csvItemCode,productItemCode,csvItemCode === productItemCode);
		if(csvItemCode === productItemCode){
			//console.log(csvPrice,variantPrice,csvItemCode,productItemCode);
			if(csvPrice !== variantPrice){
				console.log('=========================price no match===========================: ',csvPrice,csvItemCode);
				priceData.push({
					csvItemCode,
					productItemCode,
					csvPrice,
					variantPrice
				});
			}

			foundVariants++;
			console.log('======================found variant===============: ',foundVariants,variantLength);
			break;
		}
		console.log('variant counter: ',foundVariants,variantLength);
		
	}

	return foundVariants;
}

//compare csv data to shopify data
function compareCSVData(csvArr,productArr,compareIndex,priceIndex,compareKey){
	let priceData = [];
	let productIndex = getStartIndex(productArr,compareKey);
	let finalIndex = getEndIndex(productArr,compareKey);
	let foundVariants = 0;
	let lastIndex = 0;
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
						console.log('=========================price no match===========================: ',csvPrice,csvItemCode);
						priceData.push({
							csvItemCode,
							productItemCode,
							csvPrice,
							variantPrice
						});
					}

					console.log('======================found variant===============: ',csvItemCode,productItemCode);
					break;
				}
			}
		}
		/*
		if(productIndex >= productArr.length - 1){
			productIndex = productArr.length - 1;
		}
		let csvItemCode = csvArr[i][compareIndex].replace(',','');
		let productItemCode = productArr[productIndex][compareKey][0].sku;
		let currentVariant = productArr[productIndex][compareKey];
		let variantLength = currentVariant.length;
		let variantDiff = variantLength - foundVariants;
		let indexDiff = i - lastIndex;
		//check to used to see if next cav item is the last variant
		if(!(csvItemCode < productItemCode) && csvItemCode !== productItemCode && variantDiff !== 1 && indexDiff !== 0){
			//console.log('==========skiping product diff==============',productItemCode);
			//console.log('==========csvItemCode diff==============',csvItemCode);
			foundVariants = 0;
			productIndex++;
			lastIndex = i;
		}
		if(productIndex >= productArr.length - 1){
			productIndex = productArr.length - 1;
		}
		csvItemCode = csvArr[i][compareIndex].replace(',','');
		productItemCode = productArr[productIndex][compareKey][0].sku;
		currentVariant = productArr[productIndex][compareKey];
		//console.log(i,productIndex,csvArr[i][compareIndex].replace(',',''),currentVariant[0].sku);
		//console.log('variant outside function: ',foundVariants,variantLength);
		foundVariants = checkVariant(currentVariant,csvArr,i,compareIndex,priceData,foundVariants,variantLength,productIndex,priceIndex);	
		if(foundVariants === variantLength){
			//console.log('variant finished: ',foundVariants,variantLength);
			productIndex++;
			foundVariants = 0;
			lastIndex = i;
		}
		if(!(csvItemCode < productItemCode) && csvItemCode !== productItemCode){
			//console.log('==========skiping product==============',productItemCode);
			//console.log('==========csvItemCode==============',csvItemCode);
			foundVariants = 0;
			productIndex++;
			lastIndex = i;
		}
		*/
	}

	return priceData;
}

module.exports = {compareCSVData};