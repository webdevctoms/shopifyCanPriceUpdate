const fs = require('fs');

function ReadCSV(){
	this.fs = fs;
}

ReadCSV.prototype.splitByCommas = function(newLineArr){
	//const commaRegex = /\"*(.*?)(?:\"*\,)/g;
	const commaRegex = /\"(.*?)(?<!\")(?:\"\,)|\"(.*?)(?:\"{3}\,)|(.*?)(?:\,)/g;
	let commaSplitArr = [];
	for(let i = 0;i < newLineArr.length;i++){
		//issues with matching 3 " so just remove any cases of 3 "
		let sanitizedString = newLineArr[i].replace(/\"{3}/g,'"').replace(/\#/g,"");
		let rowMatches = sanitizedString.match(commaRegex);
		commaSplitArr.push(rowMatches);		
	}
	
	return commaSplitArr;
};

ReadCSV.prototype.addBlank = function(newLineArr){
	for(let i = 0;i < newLineArr.length;i++){
		newLineArr[i] = newLineArr[i].replace(/\r\n|\r|\n/,"");
		if(i === 0){
			
			newLineArr[i] += ",blank" + "\n";
		}
		else{
			newLineArr[i]+= "," + "\n";	
		}
	}
};

ReadCSV.prototype.readFile = function(fileName) {
	let promise = new Promise((resolve,reject) => {
		this.fs.readFile('./data/' + fileName + '.csv','utf-8',function(err,data){
			try{
				if(err){
					reject(err);
				}
				else{
					
					let newLineSplitFile = data.split('\n');
					this.addBlank(newLineSplitFile);
					let commaSplitArr = this.splitByCommas(newLineSplitFile);
					if(commaSplitArr[commaSplitArr.length - 1].length === 1){
						commaSplitArr.pop();
					}
					console.log('===split array length:',commaSplitArr.length);
					resolve(commaSplitArr)
				}
			}
			
			catch(error){
				//console.log(error);

				reject(error);
			}
		}.bind(this))
	});

	return promise;
};

module.exports = {ReadCSV};