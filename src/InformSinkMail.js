const Sink = require('not-inform').Sink,
	log = require('not-log')(module),
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

	deploy(message, rule){
		let transporter,
			options = {
				account: options.account
			};
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
				to: 			message.to, 			// to email field
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
