const mongoose 		= require('mongoose');

const Employee = mongoose.model('Employee', {
	name: {
		type: String,
		reuqire: true,
		minLength: 2
	},
	position: {
		type: String
	},
	about: {
		type: String
	},
	linkedInAcc: {
		type:String
	},
	profileImage: {
		type: String
	}
});

module.exports = { Employee };