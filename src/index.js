const InformSinkMail = require('./InformSinkMail.js');
module.exports = {
  name: 'not-inform-sink-email',
	paths:{
		controllers:  __dirname + '/controllers'
	},
  getClass(){
    return InformSinkMail;
  }
};
