const fs = require('fs');

function ReadCSV(){
	this.fs = fs;
}
/*
columnData keys will be the column header name and the value will be the value wanted
in the column, value can be array do provide mulitple value possiblities in the columns
*/
ReadCSV.prototype.compareFilter = function(options,data){
	let columns = [];
	let filteredData = [data[0]];
	console.log('compare filtering',options);
	//capture header columns
	try{
		for(let i = 0;i < data[0].length;i++){
			if(Object.keys(options.columnData).includes(data[0][i].replace(',',''))){
				columns.push(i);
			}
		}
		//console.log(columns);
		for(let i = 1;i < data.length;i++){
			let columnCount = 0;
			for(let k = 0;k < columns.length;k++){
				let columnVal = data[i][columns[k]].replace(',','');
				let columnName = data[0][columns[k]].replace(',','');
				
				//check if the columndata for that column includes the column value
				if(options.columnData[columnName].includes(columnVal)){
					//filteredData.push(data[i]);
					columnCount++;
				}
				if(columnCount === columns.length){
					filteredData.push(data[i]);
				}
				//console.log(columnName,columnVal,i,data[i][0]);
				//console.log(columnCount);
			}
		}

		return filteredData;

	}
	catch(err){
		console.log('error comparing and filtering data, check options',err);
	}
	
};

ReadCSV.prototype.removeFilter = function(options,data){

};

//options type for now compare and remove
ReadCSV.prototype.filterArray = function(options,data){
	let filteredData = [];
	switch(options.type.toLowerCase()){
		case 'remove':
			filteredData = this.removeFilter(options,data);
			return filteredData;
			break;
		case 'compare':
			filteredData = this.compareFilter(options,data);
			return filteredData;
			break;
		default:
			console.log('Please provide a option type')
	}
};

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