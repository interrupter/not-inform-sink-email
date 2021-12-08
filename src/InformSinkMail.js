const log = require('not-log')(module, 'notInformSinkEmail'),
	validator = require('validator');

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

		getEmailTo(recipient){
			if(
				recipient.email &&
				validator.isEmail(recipient.email)
			){
				return recipient.email;
			}else{
				return false;
			}
		}

		async deploy(message, rule){
			try{
				await this.deployCycle(message, rule);
			}catch(e){
				log.error(e);
			}
		}

		async deployOne({message, recipient,  index, recipientsFilter, rule}){
			let transporter,
				emailTo = this.getEmailTo(recipient),
				options = {
					account: this.options.account
				};
			if(!emailTo){
				throw new Error('No valid email for recipient');
			}
			if(rule && rule.getData()){
				options = Object.assign(options, {...rule.getData()});
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
		}
	}

	module.exports = InformSinkMail;

}catch(e){
	log.error(e);
}
