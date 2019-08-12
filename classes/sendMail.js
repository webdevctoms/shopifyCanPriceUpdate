const nodemailer = require("nodemailer");
//probably doesn't work on dev server works locally
function SendMail(user,pass){
	this.transporter = nodemailer.createTransport({
		service:'gmail',
		tls: { rejectUnauthorized: false },
		auth:{
			user,
			pass
		}
	});
}

SendMail.prototype.send = function(from,to,subject,message) {
	return this.transporter.sendMail({
		from,
		to,
		subject,
		html:message
	})
};

module.exports = {SendMail};