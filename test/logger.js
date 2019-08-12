function logErrors(errorData){
	for(let i = 0;i < errorData.length;i++){
		console.log('Error: ',errorData[i]);
	}
}

module.exports = {logErrors};