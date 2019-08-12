const express = require("express");
const router = express.Router();
const {checkKey} = require("../tools/checkKey");
const {SendMail} = require('../classes/sendMail');
const {EMAIL,EP,SENDEMAIL} = require('../config');

router.get('/',checkKey,(req,res) => {
	const email = new SendMail(EMAIL,EP);

	return email.send('test@email.com',SENDEMAIL,'test','<b>test message</b>')

	.then( data=>{
		return res.json({
			status:200,
			message:'message sent'
		})
	})

	.catch(err => {
		console.log('error sending email: ',err);

		return res.json({
			status:200,
			err
		})
	})
});

module.exports = {router};