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

	deploy(message){
		let transporter;
		if (this.options.service){
			let service = wellknown(this.options.service);
			transporter = nodemailer.createTransport(Object.assign({
				auth: this.options.auth
			}, service), {
				debug: process.env.NODE_ENV === 'development'
			});
		}else{
			transporter = nodemailer.createTransport(this.options.account, {
				debug: process.env.NODE_ENV === 'development'
			});
		}
		let	html = hb.compile(this.options.templates.html),
			text = hb.compile(this.options.templates.text),
			subject = hb.compile(this.options.templates.subject),
			mailOptions = {
				from: 		this.options.from, 		// from email field
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
