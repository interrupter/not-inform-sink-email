const log = require('not-log')(module, 'notInformSinkEmail'),
	validator = require('validator')
try{
	const Sink = require('not-inform').Sink,
		nodemailer = require('nodemailer'),
		hb = require('handlebars'),
		wellknown = require('nodemailer-wellknown');

	class InformSinkMail extends Sink{
		/**
		 * @param {object} options
		 */
		constructor(options){
			super(options);
			return this;
		}

		async getEmailTo(message){
			if(
				Object.prototype.hasOwnProperty.call(message, 'to') &&
				validator.isEmail(message.to)
			){
				return message.to;
			}else{
				if(
					Object.prototype.hasOwnProperty.call(message, 'owner') &&
					Object.prototype.hasOwnProperty.call(message, 'ownerModel')
				){
					let model = notNode.Application.getModel(message.ownerModel);
					let owner = await model.getOne(message.owner);
					if(owner.email && validator.isEmail(owner.email)){
						return owner.email;
					}
				}
			}
			return false;
		}

		async deploy(message, rule){
			try{
				let transporter,
					emailTo = await this.getEmailTo(message),
					options = {
						account: this.options.account
					};
				if(!emailTo){
					throw new Error('No valid email or owner of valid email provided');
				}
				if(rule && rule.getData()){
					options = Object.assign(options, rule.getData());
				}
				if (options.account.service){
					let service = wellknown(options.account.service);
					transporter = nodemailer.createTransport(Object.assign({
						auth: options.account.auth
					}, service), {
						debug: process.env.NODE_ENV === 'development'
					});
				}else{
					transporter = nodemailer.createTransport(options.account, {
						debug: process.env.NODE_ENV === 'development'
					});
				}
				let	html = hb.compile(options.templates.html),
					text = hb.compile(options.templates.text),
					subject = hb.compile(options.templates.subject),
					mailOptions = {
						from: 		options.from, 		// from email field
						to: 			emailTo, 			// to email field
						subject: 	subject(message), 		// Subject line
						text: 		text(message), 			// Plain text body
						html: 		html(message)			// HTML version of email
					};
				transporter.sendMail(mailOptions, (error, info) => {
					if (error) {
						return log.error(error);
					}else{
						log.info('Message sent: ' + info.response);
					}
				});
			}catch(e){
				log.error(e);
			}
		}
	}

	module.exports = InformSinkMail;

}catch(e){
	log.error(e);
}
