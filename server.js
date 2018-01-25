const express			= require('express');
const bodyParser		= require('body-parser');
const expressValidator	= require('express-validator');
const multer			= require('multer');
const upload			= multer({dist: './uploads'});
const mongo 			= require('mongodb');
const mongoose 			= require('mongoose');

const {Employee} 		= require('./models/employee');

const dbUrl = 'mongodb://ahmed_soliman:123456@ds113358.mlab.com:13358/employees'
mongoose.connect( dbUrl , (err) => {
	if(err) {
		return console.log('Unable to connect to DB', err)
	}

	console.log('Connected Successfully fo DB.')
});

const db 	= mongoose.connection;
const app 	= express();
const port 	= process.env.PORT || 3000;



// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json 
app.use(bodyParser.json())

// Validator
app.use(expressValidator({
	errorFormatter: ( param, msg, value ) => {
		let namespace 	= param.split('.')
		, root			= namespace.shift()
		, formParam		= root;

		while ( namespace.length ) {
			formParam += `[${namespace.shift()}]`;
		}

		return {
			param  	: formParam,
			msg		: msg,
			value	: value
		};
	}
}));



app.listen(port, () => {
	console.log('Server is runung on port ' + port);
})