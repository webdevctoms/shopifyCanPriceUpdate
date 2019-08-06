const mongoose = require('mongoose');
//subschema to avoid auto id creation
const variantSchema = mongoose.Schema({
	variant_id:{type:String,required:true},
	variant_price:String,
	item_code:{type:String},
},{_id:false});
//main shcema
const priceSchema = mongoose.Schema({
	product_id:{type:String,required:true,unique:true},
	product_title:{type:String},
	variant_data:[variantSchema]
});

priceSchema.methods.serialize = function(){
	return{
		product_id:this.product_id,
		product_title:this.product_title,
		variant_data:this.variant_data
	}
};

const Prices = mongoose.model("Price",priceSchema);
module.exports = {Prices};