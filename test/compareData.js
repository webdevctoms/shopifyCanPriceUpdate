const {Prices} = require('../models/metafield'); 

function compareProductData(shopifyProduct,product){
	if(product.product_id != shopifyProduct.id || product.product_title != shopifyProduct.title){
		
		return false;
	}
	//console.log('shopify product metafields: ',shopifyProduct.metafields);
	for(let i = 0;i < shopifyProduct.metafields.length;i++){
		let objectLength = Object.keys(shopifyProduct.metafields[i]).length;
		//console.log(shopifyProduct.metafields[i]);
		for(let k = 0;k < product.metafields.length;k++){
			let metafieldMatches = 0;
			//console.log(product.metafields[k]);
			for(let key in shopifyProduct.metafields[i]){
				console.log('==========values: ',key,shopifyProduct.metafields[i][key],product.metafields[k][key]);
				if(shopifyProduct.metafields[i][key] != product.metafields[k][key]){
					break;
				}
				else{
					metafieldMatches++;
				}
			}
			if(metafieldMatches === objectLength){
				break;
			}
			//if there is no match the end of the array and object did not match
			console.log('length and matches errors: ',k,product.metafields.length,metafieldMatches,objectLength);
			if(k === product.metafields.length - 1 && metafieldMatches < objectLength){
				return false;
			}
		}
	}

	return true;
}

function compareMetafields(shopifyProducts,index,results){
	let promise = new Promise((resolve,reject) => {
		console.log("metafield test index & shopifyProducts.length: ",index,shopifyProducts.length);
		if(index < shopifyProducts.length){
			const productID = shopifyProducts[index].id;
			return Prices.find({'product_id':productID})

			.then(product => {
				console.log("product from db: ",product[0].metafields.length,product[0].product_title);
				console.log('product from shopify: ',shopifyProducts[index].metafields.length,shopifyProducts[index].title);
				const productResult = compareProductData(shopifyProducts[index],product[0]);
				if(!productResult){
					results.push({
						product_title:product[0].product_title,
					});

					resolve(compareMetafields(shopifyProducts,index + 1,results));
				}
				else{
					resolve(compareMetafields(shopifyProducts,index + 1,results));
				}
			})

			.catch(err => {
				console.log('==========error finding data in DB',err);
				reject(err);
			})
		}
		else{
			resolve(results);
		}
	});

	return promise;
}

module.exports = {compareMetafields};